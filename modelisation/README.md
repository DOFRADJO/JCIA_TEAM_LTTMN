
# Projet JCIA Hackathon 2025 - Procédé de classification de la qualité des prunes africaines

## 📌 Objectif
Ce notebook Jupyter a été développé dans le cadre du **JCIA Hackathon 2025** pour évaluer la qualité et détecter les défauts des prunes africaines à l'aide de techniques de deep learning. Il utilise un modèle de classification d'images pour analyser un jeu de données de prunes, classées selon leur état (qualité saine vs. défectueuse).

---

## 📜 Fichiers de code
   *  JCIA_HACKATON_2025_Final.ipynb (version jupyter)
   *  JCIA_HACKATON_2025_Final.pdf
   *  JCIA_HACKATON_2025_Final.html
   *  JCIA_HACKATON_2025_Final.py

---

## 📂 Structure du projet
### Données
- **Source** : Dataset Kaggle [`african-plums-quality-and-defect-assessment-data`](https://www.kaggle.com/arnaudfadja/african-plums-quality-and-defect-assessment-data).
- **Contenu** :
  - Images organisées en sous-dossiers par classe (ex: `defect`, `fresh`, `rotten`).
  - Chemin d'accès : `/kaggle/input/african-plums-quality-and-defect-assessment-data/african_plums_dataset/african_plums/`.

### Bibliothèques utilisées
- **Kaggle** : `pip install kagglehub`
- **Data Processing** : `numpy`, `pandas`, `matplotlib`, `seaborn`, `PIL`.
- **Deep Learning** : `torch`, `torchvision`, `timm`, `transformers` (ViT).
- **Utilitaires** : `os`, `shutil`, `tqdm`, `sklearn` pour les métriques.

Voir le fichier `requirements_models.txt`

---

## 🚀 Étapes clés du notebook
1. **Importation des données et visualisations**  
   - Téléchargement du dataset Kaggle via `kagglehub`.
   - Affichage d'échantillons d'images de 6 classes différentes.
   - Visualisation du nombre d'images par dossiers

2. **Préparation des données** 
   - Copie double de 90% et 10% des données image dans 2 autres dossiers contenues dans les repertoires `dossier_1 et dossier_2`: `train_val_temp_(1/2)` et `test_(1/2)` respectivement, chacun contenant les 6 classes d'image
   - transformation des classes de tout les repertoires du dossier `model_1` en 3 classes (`defective, unaffected et unripe`).
   - transformatiions et data augmentation et équilibrage des classes de chaques sous dossiers de `dossier_1` et `dossier_2`

3. **Architecture du modèle**
   - **Choix d'un modèle** : **ConvNeXt v2** via `transformers.AutoImageProcessor` pour les 2 sous modèles de l'architecture.
   - **Comment fonctionne l'algorithme ConvNeXt v2** : voir le fichier `ConvNext_v2.pdf` du repertoire.
   - **✅ Pourquoi ConvNeXt V2 ?** : ConvNeXt V2 est une architecture **convolutionnelle moderne**, optimisée pour offrir la performance des Transformers (ViT), tout en conservant les avantages fondamentaux des CNNs classiques.
   - **⚙️ Avantages dans ce contexte spécifique** : 
| Avantage | Détail |
|---------|--------|
| 📉 **Robuste aux petits datasets** | Grâce à ses inducteurs de biais (localité, translational equivariance), ConvNeXt V2 apprend efficacement avec peu d’images. |
| 🚀 **Entraînement plus rapide et stable** | Moins sensible à l’instabilité que les architectures Transformer (ViT), surtout sans préentraînement. |
| 🧠 **Excellente généralisation** | Capable de bien se généraliser sur des données de type visuel avec peu d’overfitting. |
| 🔄 **Compatible avec le transfert learning** | Peut être initialisé avec des poids préentraînés sur ImageNet pour des performances accrues. |
| 🤙 **Facile à intégrer dans les pipelines existants** | API supportée via PyTorch, `timm`, et autres frameworks. |

4. **Entraînement, évaluation et test**  
   - Utilisation de `DataLoader` pour le chargement par lots.
   - **Métriques** : Accuracy, precission, recall, f1_score, matrice de confusion
   - **Régularisation** : Early stopping, label smoothing, dropout
   - **Optimisation** : AdamW (Adaptive Moment Estimation with Weight Decay), weight decay
   - Calcul des métriques de performance (`classification_report (accuracy (général et par classe), precision, recall, f1-score)`, `confusion_matrix`).

---

## 📊 Résultats
- Visualisation des prédictions et analyse des erreurs.
- Matrice de confusion pour évaluer la précision par classe.
- Rapport de classification incluant **précision**, **rappel**, et **F1-score**.

---

## 💻 Exécution du code
### Prérequis
- Compte Kaggle pour accéder au dataset.
- Librairies Python listées dans les cellules d'import.

### Étapes
1. Téléchargez le dataset Kaggle via l'API `kagglehub`.
2. Exécutez les cellules dans l'ordre pour :
   - Charger les données.
   - Entraîner le modèle.
   - Générer les visualisations et métriques.

---

## 🔍 Insights
- **Défi principal** : Déséquilibre des classes.
- **Optimisation** : Fine-tuning du ConvNeXt v2 et augmentation + équilibrage des données pour améliorer la généralisation.

---

## ✍ Auteurs
Équipe du JCIA Hackathon 2025 : **QuadraMind**

