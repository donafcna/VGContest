import { cp, mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const template = path.join(root, 'apps/noel-space-pirates');
const require = createRequire(path.join(template, 'package.json'));
const sharp = require('sharp');
const editions = {
  leon: {
    title: 'The Impossible Maze', locale: 'en', bundle: 'ch.vgcontest.leon.impossiblemaze',
    background: '#21140d', accent: '#ffaf46',
    artwork: '<path d="M752 768H268V256h484v390H398V390h225v122H512" fill="none" stroke="#ffaf46" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/>',
    files: [],
  },
  louis: {
    title: 'Louis dans l’Espace', locale: 'fr', bundle: 'ch.vgcontest.louis.danslespace',
    background: '#17123c', accent: '#bafc68',
    artwork: '<path d="M512 190Q690 302 626 620l83 120-154-42h-86l-154 42 83-120Q334 302 512 190Z" fill="#e6f6ff"/><circle cx="512" cy="440" r="64" fill="#5443bd"/><path d="M448 738h128l-64 150Z" fill="#bafc68"/><circle cx="240" cy="320" r="22" fill="#bafc68"/><circle cx="780" cy="330" r="31" fill="#bafc68"/>',
    files: ['style.css', 'jeu.js'],
  },
};

const id = process.argv[2];
const edition = Object.hasOwn(editions, id) && editions[id];
if (!edition) throw new Error('Usage: node apps/contest-ios/prepare.mjs leon|louis');
const output = path.join(here, 'build', id);
const www = path.join(output, 'www');
await mkdir(www, { recursive: true });
for (const file of ['package.json', 'package-lock.json']) {
  await copyFile(path.join(template, file), path.join(output, file));
}
await cp(path.join(template, 'ios'), path.join(output, 'ios'), {
  recursive: true,
  filter: (source) => !/^(public|DerivedData|xcuserdata|capacitor\.config\.json|config\.xml|Package\.resolved)$/.test(path.basename(source)),
});
const config = { appId: edition.bundle, appName: edition.title, webDir: 'www' };
await writeFile(path.join(output, 'capacitor.config.json'), JSON.stringify(config, null, 2));

const iosApp = path.join(output, 'ios/App/App');
async function replace(file, before, after) {
  const source = (await readFile(file, 'utf8')).replaceAll('\r\n', '\n');
  if (!source.includes(before)) throw new Error(`Missing template marker in ${file}`);
  await writeFile(file, source.replaceAll(before, after));
}
await replace(path.join(iosApp, 'Info.plist'), '<string>Space Pirates</string>', `<string>${edition.title}</string>`);
await replace(path.join(iosApp, 'Info.plist'), '<string>en</string>', `<string>${edition.locale}</string>`);
await replace(path.join(output, 'ios/App/App.xcodeproj/project.pbxproj'), 'ch.vgcontest.noel.spacepirates', edition.bundle);

const assets = path.join(iosApp, 'Assets.xcassets');
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${edition.background}"/>${edition.artwork}</svg>`);
await sharp(svg).removeAlpha().png().toFile(path.join(assets, 'AppIcon.appiconset/AppIcon-512@2x.png'));
const splash = path.join(assets, 'Splash.imageset');
const manifest = JSON.parse(await readFile(path.join(splash, 'Contents.json'), 'utf8'));
await sharp(svg).resize(540, 540).extend({
  top: 1096, bottom: 1096, left: 1096, right: 1096, background: edition.background,
}).removeAlpha().png().toFile(path.join(splash, 'launch.png'));
await writeFile(path.join(splash, 'Contents.json'), JSON.stringify({
  ...manifest, images: [{ idiom: 'universal', filename: 'launch.png' }],
}, null, 2));

let html = await readFile(path.join(root, id, 'index.html'), 'utf8');
if (id === 'leon') {
  html = `<!doctype html><html lang="en"><head>${html.replace('</style>', '</style></head><body>')}</body></html>`;
  html = html.replace('Math.atan2(player.dirY, player.dirX || 1)', 'Math.atan2(player.dirY, player.dirX)')
    .replace('Press SPACE to start... if you dare', 'Tap Play… if you dare')
    .replace('Press SPACE to retry maze ', 'Tap Play again to retry maze ')
    .replace('Press P (or click) to continue', 'Tap Resume to continue')
    .replace('Type your name and press ENTER (max 12 letters)', 'Enter your display name below')
    .replace("'You escaped maze ' + (level + 1) + '!   Your loot: '", "(shopMode === 'exit' ? 'Maze escaped!   ' : '') + 'Your loot: '")
    .replace('Buy weapons in the shop and EQUIP them with keys 1-4!', 'Buy gear in the Shop and equip it from Items');
}
html = html.replace(/<meta name="viewport"[^>]*>/i, '').replace('</head>', `
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <link rel="stylesheet" href="mobile.css">
</head>`).replace('</body>', `<script src="mobile.js" data-edition="${id}"></script></body>`);
await writeFile(path.join(www, 'index.html'), html);
await writeFile(path.join(www, 'mobile.css'), `:root{--accent:${edition.accent};--game-background:${edition.background}}\n` + await readFile(path.join(here, 'mobile.css'), 'utf8'));
await copyFile(path.join(here, 'mobile.js'), path.join(www, 'mobile.js'));
for (const file of edition.files) await copyFile(path.join(root, id, file), path.join(www, file));
if (id === 'louis') {
  const script = path.join(www, 'jeu.js');
  await replace(script, 'Appuie sur ESPACE pour jouer !', 'Appuie sur Jouer !');
  await replace(script, 'ESPACE pour rejouer', 'appuie sur Rejouer');
  await replace(script, 'heros.vy = 0;\n  camera = 0;', 'heros.vy = 0; heros.auSol = false;\n  camera = 0;');
}
console.log(output);
