import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';

const require = createRequire(new URL('../noel-space-pirates/package.json', import.meta.url));
const { chromium } = require('playwright-core');
const executablePath = [
  process.env.CONTEST_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((file) => file && existsSync(file));
const browser = await chromium.launch({ executablePath });
try {
  for (const edition of ['leon', 'louis']) {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(new URL(`build/${edition}/www/index.html`, import.meta.url).href);
    const tap = (name) => page.getByRole('button', { name, exact: true }).tap();
    await tap(edition === 'leon' ? 'Play' : 'Jouer');
    if (edition === 'leon') {
      await page.getByRole('textbox', { name: 'Display name' }).fill('Leon');
      await tap('Start');
      await tap('Shop');
      await tap('Back');
      await tap('Items');
      await tap('1');
      await tap('Back');
      await tap('Pause');
      await tap('Resume');
      const start = await page.evaluate(() => [player.x, player.y]);
      const direction = await page.evaluate(() => grid[1][2] === '.' ? '→' : '↓');
      await page.getByRole('button', { name: direction, exact: true }).hover();
      await page.mouse.down();
      await page.waitForFunction(([x, y]) => player.x > x || player.y > y, start);
      await page.mouse.up();
      for (let stage = 0; stage < 6; stage++) {
        assert.equal(await page.evaluate(() => level), stage);
        assert.ok(await page.evaluate(() => {
          const queue = [[1, 1]];
          const seen = new Set(['1,1']);
          for (const [r, c] of queue) {
            if (r === exitTile.r && c === exitTile.c) return true;
            for (const [dr, dc] of [[0,1], [0,-1], [1,0], [-1,0]]) {
              const next = [r + dr, c + dc];
              if (grid[next[0]]?.[next[1]] === '.' && !seen.has(next.join())) {
                queue.push(next);
                seen.add(next.join());
              }
            }
          }
          return false;
        }));
        await page.evaluate(() => {
          player.x = exitTile.c * TILE + 7;
          player.y = exitTile.r * TILE + 7;
          player.invuln = 90;
        });
        if (stage < 5) await tap('Next maze');
      }
      await page.waitForFunction(() => state === 'win');
      await tap('Scores');
      await tap('Add friend');
      await page.getByRole('textbox', { name: 'Friend’s name' }).fill('Louis');
      await tap('Add');
      assert.ok(await page.evaluate(() => friends.includes('Louis')));
    } else {
      await page.waitForFunction(() => etat === 'jeu');
      await tap('Pause');
      await tap('Reprendre');
      const start = await page.evaluate(() => heros.x);
      await page.getByRole('button', { name: '→', exact: true }).hover();
      await page.mouse.down();
      await page.waitForFunction((x) => heros.x > x, start);
      await page.mouse.up();
      for (let stage = 0; stage < 2; stage++) {
        await page.waitForFunction((n) => niveauActuel === n, stage);
        await page.evaluate(() => {
          const [x, y] = NIVEAUX[niveauActuel].drapeau;
          heros.x = x;
          heros.y = y;
        });
      }
      await page.waitForFunction(() => etat === 'gagne');
      await tap('Rejouer');
      await page.waitForFunction(() => etat === 'intro' && niveauActuel === 0);
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`${edition}: touch controls and progression transitions verified`);
  }
} finally {
  await browser.close();
}
