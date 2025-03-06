



# 🍑 Projet complet de Classification des Prunes_JCIA 🍑



## 🔍 Contexte du Projet

Dans le cadre du **JCIA Hackathon 2025**, nous avons développé **ConvNextV2_2_Plums**, une application web innovante visant à automatiser le processus de tri des prunes à l'aide de l'intelligence artificielle. L'objectif est de fournir un outil simple, intuitif et performant permettant à tout utilisateur de **détecter l'état d'une prune à partir d'une simple photo**.

Le projet repose sur une **architecture hiérarchique de modèles** combinée à une interface moderne pour une expérience utilisateur optimale.

---

## 🎯 Objectifs

- Réduire le temps de tri manuel
- Fournir une solution rapide, éfficace, mobile et accessible
- Améliorer la traçabilité des défauts
- Offrir des recommandations claires à chaque diagnostic

---

## 🌟 Technologies Utilisées

### Frontend

| Technologie       | Version | Usage                          |
|-------------------|---------|--------------------------------|
| React             | 18.2    | Framework principal            |
| Material-UI       | 5.14    | Composants UI                  |
| React Router      | 6.15    | Navigation                     |
| Axios             | 1.5     | Communication API              |


### Backend

| Technologie       | Usage                          |
|-------------------|--------------------------------|
| FastAPI (Python)  | API REST rapide et légère      |
| PyTorch + timm    | Modèles hiérarchiques convNext     |
| TorchVision       | Transformations images         |
| Pillow            | Chargement d’images            |

---

## 🤖 Intelligence Artificielle

Nous utilisons une approche **hiérarchique** :

- **Model 1** (`model1_best.pt`) :
  - Classe une prune parmi : `defective`, `unaffected`, `unripe`
- **Model 2** (`model2_best.pt`) :
  - S'active uniquement si `defective` est détecté, et précise le défaut :
    - `spotted` (tachetée)
    - `cracked` (fissurée)
    - `bruised` (meurtrie)
    - `rotten` (pourrie)

Cette organisation permet une **classification plus précise et plus robuste**, tout en offrant une lecture simple et lisible des résultats.

---



## 🖼️ Utilisation de l’Interface

### 📷 Capture ou Téléversement d'image

- **Caméra**
```js
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    videoRef.current.srcObject = stream;
  });
```

- **Upload manuel**
```html
<input
  type="file"
  accept="image/*"
  onChange={handleFileUpload}
/>
```

### ⚙️ Analyse automatique

Un indicateur de chargement MUI signale l'analyse :
```jsx
<LinearProgress 
  variant={loading ? 'indeterminate' : 'determinate'} 
  value={progress}
/>
```

### ✅ Résultat affiché

- Prédiction principale (catégorie)
- Détail du défaut (si applicable)
- Recommandations pratiques
- Score de confiance (fiabilité)

---

## 🧪 Données utilisées

Dataset de prunes sur kaggle : https://www.kaggle.com/datasets/arnaudfadja/african-plums-quality-and-defect-assessment-data?select=african_plums_dataset
- Bonnes qualités
- Non mûres
- Divers défauts (fissures, pourritures…)

Toutes les images ont été redimensionnées  et normalisées.

---

## 💡 Pourquoi une approche hiérarchique ?

✅ Plus lisible pour l’utilisateur  
✅ Plus modulaire et maintenable  
✅ Améliore la précision sur les cas "défectueux"

---

## 🧭 Cas d’usage typique

1. Je suis un agriculteur ou même tout simplement un consommateur, je prends une photo de ma prune.
2. L’application me dit : **"Prune fissurée par exemple"**
3. L'application me donne la précision de sa détection **"90% par exemple"**
4. Elle me recommande : **"Consommer dans les 24h"**


---


## 🚀 Lancement du Projet — Étapes détaillées

Voici comment utiliser notre application de classification de prunes à partir du dépôt GitHub 👇

---

### 🧰 1. Prérequis

Assurez-vous d’avoir installé :

- [Node.js (v16 ou +)](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/)
- `git` (outil de clonage de dépôt)

---

### 📥 2. Clonage du dépôt

Ouvrez un terminal (Windows, macOS ou Linux) et tapez :

```bash
git clone https://github.com/DOFRADJO/JCIA_TEAM_LTTMN.git
cd nom-du-repo

```


---

### 🖼️ 3. Installation et lancement du Frontend

Allez dans le dossier `frontend` et installez les dépendances :

```bash
cd frontend
npm install
```

Ensuite, démarrez l’interface React :

```bash
npm start
```

📍 Cela ouvre automatiquement l'application dans votre navigateur :  
➡️ [http://localhost:3000](http://localhost:3000)


**Notez Bien :** Bien vouloir telecharger les 2 modeles `model1_best.pt` et `model2.best.pt` depuis ce dossier [Drive](https://drive.google.com/drive/folders/1Vbrd3hxInYJVRQeQ_RDCQfNYDKliVzNa?usp=sharing) et les ajouter tous les 2 dans le dossier `model` du repertoire `JCIA_TEAM_LTTMN\api`

---

### 🧠 4. Installation et lancement du Backend (API)

Ouvrez **un deuxième terminal** et suivez ces étapes :

#### a. Créer un environnement virtuel Python

```bash
cd api
python -m venv env
```

#### b. Activer l’environnement virtuel

- Sur **Windows** :
  ```bash
  env\Scripts\activate
  ```
- Sur **macOS/Linux** :
  ```bash
  source env/bin/activate
  ```

#### c. Installer les dépendances Python

```bash
pip install -r requirements_api.txt
```

#### d. Démarrer le serveur FastAPI

```bash
uvicorn api:app --reload
```

💡 L’API est accessible par défaut sur :  
➡️ [http://localhost:8000](http://localhost:8000)

---

### 📸 5. Utilisation de l'application

1. Ouvrez l’interface à l’adresse : [http://localhost:3000](http://localhost:3000)
2. Cliquez sur **"Prendre une photo"** ou **téléversez une image**
3. L’application détecte automatiquement si une prune est présente dans l’image
4. Si c’est le cas, elle l’envoie à l’API pour analyse
5. Vous obtenez :
   - La **catégorie** de la prune
   - Un **score de confiance**
   - Des **recommandations** personnalisées (ex: *"Consommer sous 24h"* ou *"Prune non mûre, attendre 2 jours"*).

---

### ❗️ Remarques importantes

- La **caméra doit être autorisée** dans le navigateur (HTTPS recommandé pour la version déployée)
- Le modèle est optimisé pour des images individuelles, bien cadrées
- Fonctionne également sur **mobile** via navigateur 📱



## 📜 Licence

MIT © 2025 QuadraMind
---

**Mis à jour**: 16/04/2025  
**Projet présenté au**: JCIA Hackathon 2025
**Auteur**: QuadraMind
```
