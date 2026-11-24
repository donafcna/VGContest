import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const edgePath = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = process.env.SPACE_PIRATES_URL || 'http://127.0.0.1:4173/';
const artifacts = resolve(import.meta.dirname, '..', 'artifacts');
await mkdir(artifacts, { recursive: true });

const browser = await chromium.launch({ executablePath: edgePath, headless: true });
const page = await browser.newPage({
  viewport: { width: 844, height: 390 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2
});

const errors = [];
const failedResponses = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(message.text());
});
page.on('response', (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#startbtn', { state: 'attached' });

const menuState = await page.evaluate(() => ({
  title: document.title,
  canvas: Boolean(document.querySelector('canvas')),
  startVisible: !document.getElementById('startbtn')?.closest('.overlay')?.classList.contains('hidden')
}));

if (menuState.title !== 'Space Pirates') throw new Error(`Unexpected title: ${menuState.title}`);
if (!menuState.canvas) throw new Error('Game canvas is missing');
if (!menuState.startVisible) throw new Error('Start action is not visible');

await page.evaluate(() => window.startInstantCombat?.(new Event('click')));
await page.waitForTimeout(1800);

const playState = await page.evaluate(() => ({
  menuHidden: document.getElementById('menu')?.classList.contains('hidden'),
  pauseVisible: getComputedStyle(document.getElementById('pausebtn')).display !== 'none',
  canvasWidth: document.querySelector('canvas')?.width || 0,
  canvasHeight: document.querySelector('canvas')?.height || 0
}));

await page.screenshot({ path: resolve(artifacts, 'iphone-gameplay.png') });
await browser.close();

if (!playState.menuHidden) throw new Error('Main menu did not close');
if (!playState.pauseVisible) throw new Error('Pause control is unavailable');
if (playState.canvasWidth < 800 || playState.canvasHeight < 350) throw new Error('Canvas did not size for iPhone landscape');
const brokenLocalAssets = failedResponses.filter((item) => item.includes('127.0.0.1') && !item.endsWith('/favicon.ico'));
if (brokenLocalAssets.length) throw new Error(`Broken packaged assets:\n${brokenLocalAssets.join('\n')}`);
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);

if (failedResponses.length) console.log(`Non-fatal online responses:\n${failedResponses.join('\n')}`);

console.log('iPhone landscape smoke test passed.');
