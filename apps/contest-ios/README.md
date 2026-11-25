# The Impossible Maze et Louis dans l’Espace sur iPhone

Deux applications iOS indépendantes incorporent les jeux HTML5 en local via Capacitor. Le dossier généré prend le jeu de Léon dans `leon/index.html` et celui de Louis dans `louis/`. Le projet Xcode de Noel sert de base pour les paramètres communs. Les icônes, écrans de lancement et identifiants sont propres à chaque jeu.

```sh
npm ci --prefix apps/noel-space-pirates
node apps/contest-ios/prepare.mjs leon
node apps/contest-ios/prepare.mjs louis
cd apps/contest-ios/build/leon
npm ci
npx cap sync ios
npx cap open ios
```

Pour Louis, ouvrir `apps/contest-ios/build/louis` et exécuter les mêmes commandes Capacitor. Xcode est requis pour la compilation. Le workflow GitHub Actions compile les deux projets pour le simulateur. Pour TestFlight, sélectionner l’équipe Apple Developer dans le projet généré, archiver pour iPhone et valider l’archive dans Xcode. Vérifier les commandes multitouch et les interruptions sur un iPhone avant la distribution.
