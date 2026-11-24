import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const required = [
  'www/index.html',
  'www/native.css',
  'www/native.js',
  'capacitor.config.json',
  'ios/App/App/Info.plist',
  'ios/App/App.xcodeproj/project.pbxproj'
];

for (const file of required) {
  await stat(resolve(root, file));
}

const html = await readFile(resolve(root, 'www/index.html'), 'utf8');
for (const marker of ['native.css', 'native.js', 'Space Pirates']) {
  if (!html.includes(marker)) throw new Error(`Missing ${marker} in www/index.html`);
}

const config = JSON.parse(await readFile(resolve(root, 'capacitor.config.json'), 'utf8'));
if (config.appId !== 'ch.vgcontest.noel.spacepirates') throw new Error('Unexpected appId');
if (config.webDir !== 'www') throw new Error('Unexpected webDir');

console.log('Space Pirates iOS project verification passed.');
