
# Projet JCIA Hackathon 2025 - Classification de la qualité des prunes africaines

## 📌 Objectif
Ce notebook Jupyter a été développé dans le cadre du **JCIA Hackathon 2025** pour évaluer la qualité et détecter les défauts des prunes africaines à l'aide de techniques de deep learning. Il utilise un modèle de classification d'images pour analyser un jeu de données de prunes, classées selon leur état (qualité saine vs. défectueuse).

---

## 📂 Structure du projet
### Données
- **Source** : Dataset Kaggle [`african-plums-quality-and-defect-assessment-data`](https://www.kaggle.com/arnaudfadja/african-plums-quality-and-defect-assessment-data).
- **Contenu** :
  - Images organisées en sous-dossiers par classe (ex: `defect`, `fresh`, `rotten`).
  - Chemin d'accès : `/kaggle/input/african-plums-quality-and-defect-assessment-data/african_plums_dataset/african_plums/`.

### Bibliothèques utilisées
- **Data Processing** : `numpy`, `pandas`, `matplotlib`, `seaborn`, `PIL`.
- **Deep Learning** : `torch`, `torchvision`, `timm`, `transformers` (ViT).
- **Utilitaires** : `os`, `shutil`, `tqdm`, `sklearn` pour les métriques.

---

## 🚀 Étapes clés du notebook
1. **Importation des données**  
   - Téléchargement du dataset Kaggle via `kagglehub`.
   - Exploration des répertoires d'images (`train/` , `test/` et `val/`).

2. **Visualisation des données**  
   - Affichage d'échantillons d'images de 6 classes différentes.

3. **Préparation des données**  
   - Utilisation de `torchvision.datasets.ImageFolder` pour structurer les données en 2 groupes :
        - **model_1** : contient les train, val et test de 3 classes d'images `defective, unaffected et unripe` (unaffective étant un mélange équilibré des autres classes).
        - **model_2** : contient les train, val et test de 4 classes d'images `unripe, cracked, rotten et spotted`.
   - Transformation, augmentation et équilibrage des images avec `transforms` (redimensionnement, normalisation, ...) en fonction du sous modèle.

4. **Architecture du modèle**  
   - Choix d'un modèle **ConvNeXt v2** via `transformers.AutoImageProcessor` pour les 2 sous modèles de l'architecture.
   - Configuration de l'entraînement avec `torch` (optimiseur, fonctions de perte).
   - 

5. **Entraînement, évaluation et test**  
   - Utilisation de `DataLoader` pour le chargement par lots.
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
- **Défi principal** : Déséquilibre des classes (ex: plus d'images de prunes saines que défectueuses).
- **Optimisation** : Fine-tuning du ConvNeXt v2 et augmentation + équilibrage des données pour améliorer la généralisation.

---

## Auteurs
Équipe du JCIA Hackathon 2025.

