from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
from PIL import Image, UnidentifiedImageError
import torch
from torchvision import transforms
from timm import create_model
import io
import numpy as np
import logging
from datetime import datetime

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PruneTrier API Pro",
    description="API avancée de classification hiérarchique des prunes avec ViT",
    version="2.0.0",
    docs_url="/docs",
    redoc_url=None
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelConfig:
    MODEL_NAME = 'convnextv2_base.fcmae_ft_in1k'
    IMG_SIZE = 224
    MEAN = (0.485, 0.456, 0.406)
    STD = (0.229, 0.224, 0.225)
    MODEL1_CLASSES = ['defective', 'unaffected', 'unripe']
    MODEL2_CLASSES = ['spotted', 'cracked', 'bruised', 'rotten']
    MODEL1_PATH = "model/model1_best.pt"
    MODEL2_PATH = "model/model2_best.pt"
    MAX_FILE_SIZE = 8_000_000

class LevelResponse(BaseModel):
    category: str
    confidence: float
    description: str
    severity: str

class PredictionResponse(BaseModel):
    status: str
    timestamp: str
    level1: LevelResponse
    level2: Optional[LevelResponse] = None
    recommendations: list[str]
    quality_score: float


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Utilisation du device: {device}")

transform = transforms.Compose([
    transforms.Resize((ModelConfig.IMG_SIZE, ModelConfig.IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(ModelConfig.MEAN, ModelConfig.STD)
])

def softmax(x: np.ndarray) -> np.ndarray:
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

def get_description(category: str) -> str:
    descriptions = {
        'unaffected': "La prune est en parfait état, sans aucun défaut visible",
        'unripe': "La prune n'a pas atteint sa maturité optimale pour la consommation",
        'defective': "La prune présente des défauts nécessitant une inspection plus poussée",
        'spotted': "Présence de taches superficielles probablement dues à des conditions de croissance",
        'cracked': "La prune présente des fissures pouvant affecter sa conservation",
        'bruised': "La prune montre des signes de chocs mécaniques",
        'rotten': "La prune présente des signes avancés de décomposition"
    }
    return descriptions.get(category, "Description non disponible")

def get_recommendations(category: str) -> list[str]:
    recommendations = {
        'unaffected': ["✅ Excellente qualité - Prête à la consommation", "Conserver au réfrigérateur (3-5 jours)", "Idéale pour consommation directe"],
        'unripe': ["⏳ Laisser mûrir à température ambiante (2-3 jours)", "Conserver dans un sac en papier pour accélérer la maturation", "Vérifier la maturation quotidiennement"],
        'spotted': ["⚠️ Laver soigneusement avant consommation", "Retirer les parties tachetées si nécessaire", "Consommer rapidement (dans les 2 jours)"],
        'cracked': ["❗ Consommer dans les 24 heures", "Vérifier l'absence de moisissures internes", "Idéale pour transformation immédiate"],
        'bruised': ["🛑 Utiliser rapidement pour cuisiner", "Jeter les parties trop abîmées", "Ne pas conserver plus de 24 heures"],
        'rotten': ["☠️ DANGER - Non consommable", "Jeter immédiatement", "Désinfecter le contenant de stockage"],
        'defective': ["🔍 Inspection secondaire requise", "Manipuler avec précaution", "Conserver à part des autres fruits"]
    }
    return recommendations.get(category, ["Aucune recommandation disponible"])

def calculate_quality_score(category: str, confidence: float) -> float:
    quality_factors = {
        'unaffected': 1.0,
        'unripe': 0.7,
        'spotted': 0.5,
        'cracked': 0.4,
        'bruised': 0.3,
        'rotten': 0.0,
        'defective': 0.2
    }
    base_score = quality_factors.get(category, 0.5)
    return round(base_score * (confidence / 100.0), 2)

def get_severity(category: str) -> str:
    severity_map = {
        'unaffected': 'excellent',
        'unripe': 'medium',
        'spotted': 'warning',
        'cracked': 'warning',
        'bruised': 'serious',
        'rotten': 'critical',
        'defective': 'warning'
    }
    return severity_map.get(category, 'info')

try:
    model1 = create_model(ModelConfig.MODEL_NAME, pretrained=False, num_classes=len(ModelConfig.MODEL1_CLASSES))
    model1.load_state_dict(torch.load(ModelConfig.MODEL1_PATH, map_location=device))
    model1.to(device).eval()

    model2 = create_model(ModelConfig.MODEL_NAME, pretrained=False, num_classes=len(ModelConfig.MODEL2_CLASSES))
    model2.load_state_dict(torch.load(ModelConfig.MODEL2_PATH, map_location=device))
    model2.to(device).eval()

    logger.info("Modèles chargés avec succès")
except Exception as e:
    logger.critical(f"Erreur de chargement des modèles: {str(e)}")
    raise RuntimeError(f"Impossible de charger les modèles: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    try:
        start_time = datetime.now()

        if not file.content_type.startswith('image/'):
            raise HTTPException(400, "Seules les images sont acceptées")

        if 'content-length' in file.headers and int(file.headers['content-length']) > ModelConfig.MAX_FILE_SIZE:
            raise HTTPException(413, f"Fichier trop volumineux (> {ModelConfig.MAX_FILE_SIZE//1_000_000}MB)")

        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output1 = model1(img_tensor)
            probs1 = softmax(output1.cpu().numpy()[0])
            pred1_idx = np.argmax(probs1)
            pred1_label = ModelConfig.MODEL1_CLASSES[pred1_idx]
            confidence1 = float(probs1[pred1_idx]) * 100

        response = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "level1": {
                "category": pred1_label,
                "confidence": confidence1,
                "description": get_description(pred1_label),
                "severity": get_severity(pred1_label)
            },
            "recommendations": get_recommendations(pred1_label),
            "quality_score": calculate_quality_score(pred1_label, confidence1)
        }

        if pred1_label == "defective":
            with torch.no_grad():
                output2 = model2(img_tensor)
                probs2 = softmax(output2.cpu().numpy()[0])
                pred2_idx = np.argmax(probs2)
                pred2_label = ModelConfig.MODEL2_CLASSES[pred2_idx]
                confidence2 = float(probs2[pred2_idx]) * 100

            response["level2"] = {
                "category": pred2_label,
                "confidence": confidence2,
                "description": get_description(pred2_label),
                "severity": get_severity(pred2_label)
            }
            response["recommendations"] = get_recommendations(pred2_label)
            response["quality_score"] = calculate_quality_score(pred2_label, confidence2)

        logger.info(f"Analyse terminée en {(datetime.now() - start_time).total_seconds():.2f}s")
        return response

    except UnidentifiedImageError:
        raise HTTPException(400, "Format d'image non supporté")
    except Exception as e:
        logger.error(f"Erreur d'analyse: {str(e)}", exc_info=True)
        raise HTTPException(500, f"Erreur interne: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": str(device),
        "models_ready": True,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)