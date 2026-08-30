# 👾 Louis dans l'Espace 🚀

Mon jeu pour le grand concours de la famille ! (vgcontest.vercel.app)
Tu pilotes une fusée 🚀 qui saute de plateforme en plateforme... dans l'espace !

## Comment jouer
- ⬅️ ➡️ : bouger
- ESPACE ou ⬆️ : sauter
- **X : tirer des lasers** sur les météorites ☄️ et les soucoupes volantes 🛸
- P (ou le bouton) : pause
- Saute sur la tête des champignons pour les écraser !
- Attrape les pièces ⭐ et atteins le drapeau 🚩
- Le jeu commence par l'atterrissage de ta fusée 🚀 et se termine quand tu redécolles à la fin du dernier niveau !

## Idées pour personnaliser MON jeu (c'est ça le game design !)
Ouvre `jeu.js` et modifie les **RÉGLAGES** en haut du fichier :
- `GRAVITE` : la lune (0.3) ou une planète géante (1.2) ?
- `FORCE_SAUT` : des super-sauts ?
- `RYTHME_ROCHERS` : une pluie de météorites (60) ou tranquille (200) ?
- `NIVEAUX` : ajoute tes propres plateformes, pièces et ennemis, ou un niveau 3 !
- Change les emojis : remplace 🚀 par 👾 ou 🐱, 🛸 par 🤖, ☄️ par 🪨...
- Dans `style.css` : change les couleurs du jeu !

## Pour tester le jeu
Demande à Claude, ou ouvre un terminal et lance :
```
python -m http.server 8642 --directory C:\Users\donat\Desktop\vgcontest
```
puis va sur http://localhost:8642/louis/
