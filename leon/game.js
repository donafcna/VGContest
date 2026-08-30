// ==================================================
//  🕹️ THE IMPOSSIBLE MAZE — by Leon (v2!)
//  Giant dark mazes! Your torch is your only light.
//  Fight soldiers, loot coins & materials, buy and
//  EQUIP weapons, costumes and pets in the shop!
// ==================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const VIEW_W = canvas.width, VIEW_H = canvas.height;

// --- SETTINGS (play with these!) ---
const TILE = 40;
const PLAYER_SIZE = 26;
let   PLAYER_SPEED = 3;
const SOLDIER_SPEED = 1.2;
const SOLDIER_RANGE = 240;     // soldiers shoot when this close
const START_HEARTS = 5;
const TORCH_LENGTH = 220;      // how far your torch shines
const TORCH_WIDTH = 0.42;      // how wide the light cone is

// --- THE MAZES (computer-generated, always solvable!) ---
const LEVELS = [
  { cols: 51, rows: 31, soldiers: 12, coins: 18, crates: 7,  traps: 16, seed: 1101 },
  { cols: 61, rows: 37, soldiers: 16, coins: 22, crates: 9,  traps: 22, seed: 2202 },
  { cols: 71, rows: 41, soldiers: 20, coins: 26, crates: 10, traps: 28, seed: 3303 },
  { cols: 81, rows: 47, soldiers: 25, coins: 30, crates: 12, traps: 34, seed: 4404 },
  { cols: 91, rows: 51, soldiers: 30, coins: 36, crates: 14, traps: 40, seed: 5505 },
  { cols: 101, rows: 61, soldiers: 40, coins: 44, crates: 18, traps: 50, seed: 6606 },
];

// --- WEAPONS (press 1-4 in the maze to equip!) ---
const WEAPONS = [
  { name: 'Pistol',      icon: '🔫', dmg: 1, cooldown: 20, speed: 8,   color: '#FFC04D', owned: true  },
  { name: 'Shotgun',     icon: '💥', dmg: 1, cooldown: 40, speed: 7.5, color: '#FFD700', owned: false },
  { name: 'Machine Gun', icon: '🔥', dmg: 1, cooldown: 7,  speed: 9,   color: '#FF6347', owned: false },
  { name: 'Laser Rifle', icon: '⚡', dmg: 3, cooldown: 26, speed: 13,  color: '#00FFFF', owned: false },
];
let equipped = 0;

// --- COSTUMES (more realistic now!) ---
const COSTUMES = [
  { name: 'Adventurer', shirt: '#c0392b', pants: '#2c3e50', skin: '#f1c27d', hat: 'none'    },
  { name: 'Ninja',      shirt: '#23232b', pants: '#141418', skin: '#f1c27d', hat: 'band'    },
  { name: 'Robot',      shirt: '#7f8c8d', pants: '#566573', skin: '#bdc3c7', hat: 'antenna' },
  { name: 'Cowboy',     shirt: '#8e5a2a', pants: '#4e342e', skin: '#f1c27d', hat: 'cowboy'  },
];
const PETS = ['🐶', '🐱', '🦖', '🐉'];

// --- GAME STATE ---
let state = 'title';   // title, play, shop, dead, win, pause
let level = 0, frame = 0;
let grid = [], ROWS = 0, COLS = 0;
let camX = 0, camY = 0;

const player = { x: 0, y: 0, dirX: 1, dirY: 0, hp: START_HEARTS, maxHp: START_HEARTS, invuln: 0, costume: 0, moving: false };
let coins = 0, materials = 0;
let hasBoots = false;
let pet = null, petBiteTimer = 0;
let shootCooldown = 0, shopMessage = '', hudMessage = '', hudMessageTimer = 0;
let shopMode = 'exit';   // 'exit' = between mazes, 'visit' = opened with B

// --- YOUR PROFILE: display name, friends, leaderboard, inventory ---
let displayName = '', friends = [], board = [], ownedCostumes = [0];
let earnedCoins = 0;                 // total coins collected (your score!)
let typing = '', typingMode = null;  // 'name' or 'friend'
let prevState = 'title';
let lastScore = 0;
try {
  displayName = localStorage.getItem('maze_name') || '';
  friends = JSON.parse(localStorage.getItem('maze_friends') || '[]');
  board = JSON.parse(localStorage.getItem('maze_board') || '[]');
} catch (e) { /* saving not available, no problem */ }

function saveProfile() {
  try {
    localStorage.setItem('maze_name', displayName);
    localStorage.setItem('maze_friends', JSON.stringify(friends));
    localStorage.setItem('maze_board', JSON.stringify(board));
  } catch (e) { }
}

function gainCoins(n) { coins += n; earnedCoins += n; }

function submitScore() {
  const score = earnedCoins + player.hp * 10;
  board.push({ name: displayName || 'Player', score, when: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score);
  board = board.slice(0, 10);
  saveProfile();
  return score;
}

let soldiers = [], traps = [], coinPickups = [], crates = [], bullets = [], enemyBullets = [], popups = [];
let torches = [], webs = [], skulls = [];
let exitTile = { r: 0, c: 0 };

// Seeded random numbers (same maze every time for the same seed)
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// --- MAZE GENERATOR (carves perfect mazes, then adds loops) ---
function generateMaze(cols, rows, rnd) {
  const g = Array.from({ length: rows }, () => Array(cols).fill('#'));
  const stack = [[1, 1]];
  g[1][1] = '.';
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = [[0, 2], [0, -2], [2, 0], [-2, 0]].filter(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      return nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && g[nr][nc] === '#';
    });
    if (!options.length) { stack.pop(); continue; }
    const [dr, dc] = options[Math.floor(rnd() * options.length)];
    g[r + dr / 2][c + dc / 2] = '.';
    g[r + dr][c + dc] = '.';
    stack.push([r + dr, c + dc]);
  }
  // Open some walls to create loops (more fun, more escape routes!)
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (g[r][c] === '#' && rnd() < 0.09) {
        const horiz = g[r][c - 1] === '.' && g[r][c + 1] === '.';
        const vert = g[r - 1] && g[r + 1] && g[r - 1][c] === '.' && g[r + 1][c] === '.';
        if (horiz || vert) g[r][c] = '.';
      }
    }
  }
  return g;
}

function loadLevel(n) {
  const cfg = LEVELS[n];
  const rnd = mulberry32(cfg.seed);
  ROWS = cfg.rows; COLS = cfg.cols;
  grid = generateMaze(COLS, ROWS, rnd);

  soldiers = []; traps = []; coinPickups = []; crates = [];
  bullets = []; enemyBullets = []; popups = [];
  torches = []; webs = []; skulls = [];

  player.x = TILE + 7; player.y = TILE + 7;
  exitTile = { r: ROWS - 2, c: COLS - 2 };
  grid[exitTile.r][exitTile.c] = '.';

  // Every empty floor tile (not too close to the start or the exit)
  const floors = [];
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (grid[r][c] === '.' && (r + c > 6) && !(r === exitTile.r && c === exitTile.c)) floors.push([r, c]);
    }
  }
  // Shuffle the floor tiles
  for (let i = floors.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [floors[i], floors[j]] = [floors[j], floors[i]];
  }
  let k = 0;
  for (let i = 0; i < cfg.soldiers && k < floors.length; i++, k++) {
    const [r, c] = floors[k];
    soldiers.push({ x: c * TILE + 6, y: r * TILE + 6, hp: 2, dx: 1, dy: 0, moveTimer: 60, shootTimer: 80 + i * 37 });
  }
  for (let i = 0; i < cfg.traps && k < floors.length; i++, k++) {
    const [r, c] = floors[k];
    traps.push({ r, c, offset: (r * 7 + c * 13) % 120 });
  }
  for (let i = 0; i < cfg.coins && k < floors.length; i++, k++) {
    const [r, c] = floors[k];
    coinPickups.push({ r, c });
  }
  for (let i = 0; i < cfg.crates && k < floors.length; i++, k++) {
    const [r, c] = floors[k];
    crates.push({ r, c });
  }

  // Spooky decorations
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      const h = (r * 31 + c * 17 + n * 7) % 100;
      if (grid[r][c] === '#' && grid[r + 1] && grid[r + 1][c] === '.' && h % 7 === 0) torches.push({ r, c });
      if (grid[r][c] === '.') {
        if (h % 23 === 3) webs.push({ r, c });
        if (h % 31 === 7) skulls.push({ r, c });
      }
    }
  }

  player.hp = player.maxHp;
  player.invuln = 60;
  player.dirX = 1; player.dirY = 0;
  if (pet) { pet.x = player.x - 20; pet.y = player.y; }
}

// --- KEYBOARD ---
const keys = {};
document.addEventListener('keydown', e => {
  // Typing your name or a friend's name?
  if (state === 'name' || typingMode === 'friend') {
    e.preventDefault();
    if (e.key === 'Enter') {
      const text = typing.trim();
      if (state === 'name') {
        displayName = text || 'Player';
        saveProfile();
        beginRun();
      } else {
        if (text && !friends.includes(text)) friends.push(text);
        saveProfile();
        typingMode = null;
      }
      typing = '';
    } else if (e.key === 'Backspace') typing = typing.slice(0, -1);
    else if (e.key === 'Escape' && typingMode === 'friend') { typingMode = null; typing = ''; }
    else if (e.key.length === 1 && typing.length < 12 && /[a-zA-Z0-9 _\-!.]/.test(e.key)) typing += e.key;
    return;
  }

  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyP') togglePause();
  if (e.code === 'KeyM') toggleMusic();

  // Leaderboard 🏆
  if (e.code === 'KeyL') { toggleBoard(); return; }
  if (state === 'board') {
    if (e.code === 'KeyF') { typingMode = 'friend'; typing = ''; }
    if (e.code === 'Escape') toggleBoard();
    return;
  }
  // Inventory 🎒
  if (state === 'inventory') { inventoryKey(e.code); return; }

  if (state === 'title' && e.code === 'Space') startGame();
  if (state === 'dead' && e.code === 'Space') { loadLevel(level); state = 'play'; }
  if (state === 'win' && e.code === 'Space') startGame();
  if (state === 'shop') {
    if (e.code === 'KeyB' && shopMode === 'visit') { state = 'play'; return; }
    shopKey(e.code);
  }
  else if (state === 'play') {
    // Open the shop anytime with B, your items with I!
    if (e.code === 'KeyB') { shopMode = 'visit'; shopMessage = ''; state = 'shop'; return; }
    if (e.code === 'KeyI') { state = 'inventory'; return; }
    // Equip your weapons with 1-4!
    const nums = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
    const idx = nums.indexOf(e.code);
    if (idx >= 0) {
      if (WEAPONS[idx].owned) { equipped = idx; setHudMessage('Equipped: ' + WEAPONS[idx].icon + ' ' + WEAPONS[idx].name); }
      else setHudMessage(WEAPONS[idx].name + ' not owned — press B to buy it in the shop!');
    }
  }
});

function toggleBoard() {
  if (state === 'board') { state = prevState; typingMode = null; }
  else if (['title', 'play', 'win', 'shop', 'pause'].includes(state)) { prevState = state; state = 'board'; }
}

function inventoryKey(code) {
  if (code === 'KeyI' || code === 'Enter' || code === 'Escape') { state = 'play'; return; }
  const nums = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
  const idx = nums.indexOf(code);
  if (idx >= 0) {
    if (WEAPONS[idx].owned) { equipped = idx; }
  }
  if (code === 'KeyC' && ownedCostumes.length > 1) {
    const at = ownedCostumes.indexOf(player.costume);
    player.costume = ownedCostumes[(at + 1) % ownedCostumes.length];
  }
}
document.addEventListener('keyup', e => keys[e.code] = false);
canvas.addEventListener('click', () => {
  if (state === 'pause') togglePause();
  else if (state === 'title' || state === 'win') startGame();
  else if (state === 'dead') { loadLevel(level); state = 'play'; }
});

function setHudMessage(msg) { hudMessage = msg; hudMessageTimer = 150; }

function togglePause() {
  if (state === 'play') state = 'pause';
  else if (state === 'pause') state = 'play';
  document.getElementById('btnPause').textContent = (state === 'pause') ? '▶️ Resume' : '⏸️ Pause';
}
document.getElementById('btnPause').addEventListener('click', togglePause);
document.getElementById('btnItems').addEventListener('click', () => {
  if (state === 'play') state = 'inventory';
  else if (state === 'inventory') state = 'play';
});
document.getElementById('btnBoard').addEventListener('click', toggleBoard);

function startGame() {
  startMusic();
  if (!displayName) { state = 'name'; typing = ''; return; }
  beginRun();
}

function beginRun() {
  level = 0; coins = 0; materials = 0; earnedCoins = 0;
  hasBoots = false; PLAYER_SPEED = 3;
  WEAPONS.forEach((w, i) => w.owned = (i === 0));
  equipped = 0;
  player.maxHp = START_HEARTS; player.costume = 0;
  ownedCostumes = [0];
  pet = null;
  claimDailyGift();
  loadLevel(0);
  state = 'play';
}

// --- DAILY FREEBIE 🎁 (once per day!) ---
let giftBanner = 0;
function claimDailyGift() {
  try {
    const today = new Date().toDateString();
    if (localStorage.getItem('maze_lastGift') !== today) {
      localStorage.setItem('maze_lastGift', today);
      gainCoins(10); materials += 1;
      giftBanner = 240;
    }
  } catch (e) { /* no saving available, no problem */ }
}

// --- SPOOKY MUSIC 🎵 (made with code, no files needed!) ---
let audioCtx = null, droneGain = null, musicOn = true;
function startMusic() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) { return; }
  const drone = audioCtx.createOscillator();
  drone.type = 'sawtooth';
  drone.frequency.value = 55;
  droneGain = audioCtx.createGain();
  droneGain.gain.value = 0.035;
  drone.connect(droneGain).connect(audioCtx.destination);
  drone.start();
  const notes = [220, 233.08, 220, 174.61, 164.81, 174.61, 146.83, 110];
  let i = 0;
  setInterval(() => {
    if (!musicOn || !audioCtx || state === 'pause' || state === 'title') return;
    const o = audioCtx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = notes[i % notes.length] / 2;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.09, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.1);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 1.15);
    i++;
  }, 1100);
}
function toggleMusic() {
  musicOn = !musicOn;
  if (droneGain) droneGain.gain.value = musicOn ? 0.035 : 0;
}

// --- HELPERS ---
function hitsWall(x, y, size) {
  const pts = [[x, y], [x + size, y], [x, y + size], [x + size, y + size]];
  for (const [px, py] of pts) {
    const c = Math.floor(px / TILE), r = Math.floor(py / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] === '#') return true;
  }
  return false;
}
function onTile(obj, size, r, c) {
  const cx = obj.x + size / 2, cy = obj.y + size / 2;
  return Math.floor(cx / TILE) === c && Math.floor(cy / TILE) === r;
}
function hurtPlayer() {
  if (player.invuln > 0) return;
  player.hp--;
  player.invuln = 90;
  if (player.hp <= 0) state = 'dead';
}
function addPopup(x, y, text) { popups.push({ x, y, text, life: 50 }); }
function trapActive(t) { return ((frame + t.offset) % 120) < 60; }
function killSoldier(s) {
  s.dead = true;
  gainCoins(5); materials += 1;
  addPopup(s.x, s.y, '+5 🪙 +1 📦');
}

// --- UPDATE ---
function update() {
  if (state !== 'play') return;
  frame++;

  // Move the player
  let mx = 0, my = 0;
  if (keys['ArrowLeft'] || keys['KeyA']) mx = -1;
  if (keys['ArrowRight'] || keys['KeyD']) mx = 1;
  if (keys['ArrowUp'] || keys['KeyW']) my = -1;
  if (keys['ArrowDown'] || keys['KeyS']) my = 1;
  player.moving = (mx !== 0 || my !== 0);
  if (player.moving) { player.dirX = mx; player.dirY = my; }
  player.x += mx * PLAYER_SPEED;
  if (hitsWall(player.x, player.y, PLAYER_SIZE)) player.x -= mx * PLAYER_SPEED;
  player.y += my * PLAYER_SPEED;
  if (hitsWall(player.x, player.y, PLAYER_SIZE)) player.y -= my * PLAYER_SPEED;
  if (player.invuln > 0) player.invuln--;

  // Camera follows you
  camX = Math.max(0, Math.min(player.x + PLAYER_SIZE / 2 - VIEW_W / 2, COLS * TILE - VIEW_W));
  camY = Math.max(0, Math.min(player.y + PLAYER_SIZE / 2 - VIEW_H / 2, ROWS * TILE - VIEW_H));

  // Shoot your equipped weapon with X
  const weapon = WEAPONS[equipped];
  if (shootCooldown > 0) shootCooldown--;
  if (keys['KeyX'] && shootCooldown <= 0) {
    let dx = player.dirX, dy = player.dirY;
    if (dx === 0 && dy === 0) dx = 1;
    const norm = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);
    const angles = (weapon.name === 'Shotgun') ? [baseAngle - 0.25, baseAngle, baseAngle + 0.25] : [baseAngle];
    for (const a of angles) {
      bullets.push({
        x: player.x + PLAYER_SIZE / 2, y: player.y + PLAYER_SIZE / 2,
        vx: Math.cos(a) * weapon.speed, vy: Math.sin(a) * weapon.speed,
        dmg: weapon.dmg, color: weapon.color,
      });
    }
    shootCooldown = weapon.cooldown;
  }

  // Your bullets
  for (const b of bullets) {
    b.x += b.vx; b.y += b.vy;
    const c = Math.floor(b.x / TILE), r = Math.floor(b.y / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] === '#') { b.dead = true; continue; }
    for (const s of soldiers) {
      if (!s.dead && b.x > s.x && b.x < s.x + 28 && b.y > s.y && b.y < s.y + 28) {
        b.dead = true;
        s.hp -= b.dmg;
        if (s.hp <= 0) killSoldier(s);
      }
    }
  }
  bullets = bullets.filter(b => !b.dead);
  soldiers = soldiers.filter(s => !s.dead);

  // Your pet follows you and bites soldiers! 🐾
  if (pet) {
    pet.x += (player.x - player.dirX * 26 - pet.x) * 0.08;
    pet.y += (player.y + 6 - pet.y) * 0.08;
    if (petBiteTimer > 0) petBiteTimer--;
    if (petBiteTimer <= 0) {
      for (const s of soldiers) {
        const dx = s.x - pet.x, dy = s.y - pet.y;
        if (Math.sqrt(dx * dx + dy * dy) < 55) {
          s.hp -= 1;
          petBiteTimer = 50;
          addPopup(s.x, s.y - 10, pet.emoji + ' CHOMP!');
          if (s.hp <= 0) killSoldier(s);
          break;
        }
      }
      soldiers = soldiers.filter(s => !s.dead);
    }
  }

  // Soldiers walk around and attack you (only the ones nearby)
  for (const s of soldiers) {
    const distX = (player.x - s.x), distY = (player.y - s.y);
    const dist = Math.sqrt(distX * distX + distY * distY);
    if (dist > 700) continue;   // too far away to bother

    s.moveTimer--;
    const nx = s.x + s.dx * SOLDIER_SPEED, ny = s.y + s.dy * SOLDIER_SPEED;
    if (hitsWall(nx, ny, 28) || s.moveTimer <= 0) {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const d = dirs[Math.floor(Math.random() * 4)];
      s.dx = d[0]; s.dy = d[1];
      s.moveTimer = 50 + Math.random() * 80;
    } else { s.x = nx; s.y = ny; }

    s.shootTimer--;
    if (s.shootTimer <= 0 && dist < SOLDIER_RANGE) {
      enemyBullets.push({ x: s.x + 14, y: s.y + 14, vx: distX / dist * 3.2, vy: distY / dist * 3.2 });
      s.shootTimer = 110;
    }
    if (player.x < s.x + 28 && player.x + PLAYER_SIZE > s.x && player.y < s.y + 28 && player.y + PLAYER_SIZE > s.y) hurtPlayer();
  }

  // Soldier bullets
  for (const b of enemyBullets) {
    b.x += b.vx; b.y += b.vy;
    const c = Math.floor(b.x / TILE), r = Math.floor(b.y / TILE);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] === '#') { b.dead = true; continue; }
    if (b.x > player.x && b.x < player.x + PLAYER_SIZE && b.y > player.y && b.y < player.y + PLAYER_SIZE) {
      b.dead = true;
      hurtPlayer();
    }
  }
  enemyBullets = enemyBullets.filter(b => !b.dead);

  // Traps
  for (const t of traps) {
    if (trapActive(t) && onTile(player, PLAYER_SIZE, t.r, t.c)) hurtPlayer();
  }

  // Pick up coins and crates
  coinPickups = coinPickups.filter(p => {
    if (onTile(player, PLAYER_SIZE, p.r, p.c)) { gainCoins(3); addPopup(p.c * TILE, p.r * TILE, '+3 🪙'); return false; }
    return true;
  });
  crates = crates.filter(p => {
    if (onTile(player, PLAYER_SIZE, p.r, p.c)) { materials += 1; gainCoins(2); addPopup(p.c * TILE, p.r * TILE, '+1 📦 +2 🪙'); return false; }
    return true;
  });

  for (const p of popups) { p.y -= 0.6; p.life--; }
  popups = popups.filter(p => p.life > 0);
  if (giftBanner > 0) giftBanner--;
  if (hudMessageTimer > 0) hudMessageTimer--;

  // Reached the exit door?
  if (onTile(player, PLAYER_SIZE, exitTile.r, exitTile.c)) {
    if (level === LEVELS.length - 1) { lastScore = submitScore(); state = 'win'; }
    else { shopMessage = ''; shopMode = 'exit'; state = 'shop'; }
  }
}

// --- THE SHOP ---
function shopKey(code) {
  if (code === 'Enter' || code === 'Space') {
    if (shopMode === 'visit') { state = 'play'; return; }
    level++;
    loadLevel(level);
    state = 'play';
    return;
  }
  function buyWeapon(i, price, mats) {
    const w = WEAPONS[i];
    if (w.owned) { shopMessage = 'You already own the ' + w.name + '!'; return; }
    if (coins >= price && materials >= mats) {
      coins -= price; materials -= mats; w.owned = true; equipped = i;
      shopMessage = w.icon + ' ' + w.name + ' bought and equipped!';
    } else shopMessage = 'Not enough! Need ' + price + ' 🪙 + ' + mats + ' 📦';
  }
  if (code === 'Digit1') buyWeapon(1, 15, 2);
  if (code === 'Digit2') buyWeapon(2, 20, 2);
  if (code === 'Digit3') buyWeapon(3, 25, 3);
  if (code === 'Digit4') {
    if (hasBoots) shopMessage = 'You already have the Speed Boots!';
    else if (coins >= 10 && materials >= 1) { coins -= 10; materials -= 1; hasBoots = true; PLAYER_SPEED = 4.2; shopMessage = '👟 Speed Boots! Zoom zoom!'; }
    else shopMessage = 'Not enough! Need 10 🪙 + 1 📦';
  }
  if (code === 'Digit5') {
    if (player.maxHp >= 6) shopMessage = 'Max hearts reached!';
    else if (coins >= 10) { coins -= 10; player.maxHp++; player.hp = player.maxHp; shopMessage = '❤️ Extra heart!'; }
    else shopMessage = 'Not enough! Need 10 🪙';
  }
  if (code === 'Digit6') {
    const notOwned = COSTUMES.map((c, i) => i).filter(i => !ownedCostumes.includes(i));
    if (!notOwned.length) shopMessage = 'You own ALL the costumes! Switch in your Items 🎒';
    else if (coins >= 5) {
      coins -= 5;
      ownedCostumes.push(notOwned[0]);
      player.costume = notOwned[0];
      shopMessage = 'New costume: ' + COSTUMES[player.costume].name + ' (switch anytime in Items 🎒)';
    }
    else shopMessage = 'Not enough! Need 5 🪙';
  }
  if (code === 'Digit7') {
    const next = pet ? (PETS.indexOf(pet.emoji) + 1) % PETS.length : 0;
    const price = pet ? 6 : 12;
    if (coins >= price) {
      coins -= price;
      pet = { emoji: PETS[next], x: player.x, y: player.y };
      shopMessage = 'Your new pet ' + pet.emoji + ' will bite soldiers for you!';
    } else shopMessage = 'Not enough! Need ' + price + ' 🪙';
  }
}

// --- DRAWING PEOPLE (realistic characters!) ---
function drawPerson(x, y, opts) {
  // opts: {shirt, pants, skin, hat, aimAngle, walking, holdTorch, hp}
  const walk = opts.walking ? Math.sin(frame * 0.25) * 3 : 0;
  ctx.save();
  ctx.translate(x + 13, y + 14);

  // Legs (they walk!)
  ctx.fillStyle = opts.pants;
  ctx.fillRect(-7, 8, 6, 10 + walk);
  ctx.fillRect(1, 8, 6, 10 - walk);
  // Feet
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-8, 16 + walk, 8, 3);
  ctx.fillRect(0, 16 - walk, 8, 3);

  // Body
  ctx.fillStyle = opts.shirt;
  ctx.beginPath();
  ctx.roundRect(-9, -6, 18, 16, 4);
  ctx.fill();
  // Belt
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(-9, 6, 18, 3);

  // Weapon arm (points where you aim)
  if (opts.aimAngle !== undefined) {
    ctx.save();
    ctx.rotate(opts.aimAngle);
    ctx.fillStyle = opts.skin;
    ctx.fillRect(4, -2, 9, 4);          // arm
    ctx.fillStyle = '#333';
    ctx.fillRect(12, -3, 10, 5);        // the gun!
    ctx.fillStyle = '#555';
    ctx.fillRect(12, 2, 3, 4);          // handle
    ctx.restore();
  }

  // Torch arm 🔦 (your light!)
  if (opts.holdTorch) {
    ctx.fillStyle = '#6b4a2a';
    ctx.fillRect(-14, -4, 4, 12);       // torch stick
    const fl = 3 + Math.sin(frame * 0.4) * 1.5;
    ctx.fillStyle = '#ff9500';
    ctx.beginPath(); ctx.arc(-12, -7, fl + 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe08a';
    ctx.beginPath(); ctx.arc(-12, -8, fl, 0, Math.PI * 2); ctx.fill();
  }

  // Head
  ctx.fillStyle = opts.skin;
  ctx.beginPath(); ctx.arc(0, -12, 7, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#222';
  ctx.fillRect(-3, -13, 2, 2);
  ctx.fillRect(2, -13, 2, 2);

  // Hats and hair
  if (opts.hat === 'helmet') {
    ctx.fillStyle = '#3d4f2f';
    ctx.beginPath(); ctx.arc(0, -14, 8, Math.PI, 0); ctx.fill();
    ctx.fillRect(-8, -15, 16, 3);
  } else if (opts.hat === 'band') {
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-7, -16, 14, 3);
  } else if (opts.hat === 'antenna') {
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, -24); ctx.stroke();
    ctx.fillStyle = '#ff4444';
    ctx.beginPath(); ctx.arc(0, -25, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (opts.hat === 'cowboy') {
    ctx.fillStyle = '#5d4023';
    ctx.fillRect(-10, -17, 20, 3);
    ctx.beginPath(); ctx.arc(0, -17, 6, Math.PI, 0); ctx.fill();
  } else {
    ctx.fillStyle = '#4a2f1a';  // hair
    ctx.beginPath(); ctx.arc(0, -14, 7, Math.PI, 0); ctx.fill();
  }
  ctx.restore();

  // Health bar for soldiers
  if (opts.hp !== undefined) {
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y - 10, 28, 4);
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(x, y - 10, 28 * (opts.hp / 2), 4);
  }
}

// --- DRAW ---
const darkCanvas = document.createElement('canvas');
darkCanvas.width = VIEW_W; darkCanvas.height = VIEW_H;
const dctx = darkCanvas.getContext('2d');

function draw() {
  ctx.fillStyle = '#0a0a0e';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  if (state === 'title') { drawTitle(); return; }
  if (state === 'name') { drawNameEntry(); return; }
  if (state === 'board') { drawBoard(); return; }
  if (state === 'inventory') { drawInventory(); return; }
  if (state === 'win') { drawScreen('🏆 YOU ESCAPED THEM ALL, ' + (displayName || 'HERO').toUpperCase() + '!', 'Score: ' + lastScore + '  —  L: leaderboard  —  SPACE to play again'); return; }
  if (state === 'shop') { drawShop(); return; }

  ctx.save();
  ctx.translate(-camX, -camY);

  // Only draw the part of the maze we can see
  const r0 = Math.max(0, Math.floor(camY / TILE)), r1 = Math.min(ROWS - 1, Math.ceil((camY + VIEW_H) / TILE));
  const c0 = Math.max(0, Math.floor(camX / TILE)), c1 = Math.min(COLS - 1, Math.ceil((camX + VIEW_W) / TILE));
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const x = c * TILE, y = r * TILE;
      if (grid[r][c] === '#') {
        ctx.fillStyle = '#3d3d5c';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = '#2a2a40';
        ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      } else {
        ctx.fillStyle = ((r + c) % 2 === 0) ? '#1b1b22' : '#1e1e26';
        ctx.fillRect(x, y, TILE, TILE);
      }
    }
  }

  const visible = (x, y) => x > camX - 60 && x < camX + VIEW_W + 60 && y > camY - 60 && y < camY + VIEW_H + 60;

  // Spooky decorations 🔥🕸️💀
  const visibleTorches = [];
  for (const t of torches) {
    const x = t.c * TILE + 12, y = t.r * TILE + 34;
    if (!visible(x, y)) continue;
    visibleTorches.push({ x: x + 8, y: y - 8 });
    const glow = ctx.createRadialGradient(x + 8, y - 8, 4, x + 8, y - 8, 42);
    glow.addColorStop(0, 'rgba(255,150,30,0.3)');
    glow.addColorStop(1, 'rgba(255,150,30,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 34, y - 50, 84, 84);
    ctx.font = (Math.floor(frame / 8) % 2 === 0 ? '17px' : '19px') + ' serif';
    ctx.fillText('🔥', x, y);
  }
  ctx.font = '18px serif';
  for (const w of webs) if (visible(w.c * TILE, w.r * TILE)) ctx.fillText('🕸️', w.c * TILE + 10, w.r * TILE + 24);
  for (const s of skulls) if (visible(s.c * TILE, s.r * TILE)) ctx.fillText('💀', s.c * TILE + 10, s.r * TILE + 26);

  // Traps: spikes pop in and out!
  for (const t of traps) {
    const x = t.c * TILE, y = t.r * TILE;
    if (!visible(x, y)) continue;
    if (trapActive(t)) {
      ctx.fillStyle = '#ff4444';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 4 + i * 9, y + TILE - 4);
        ctx.lineTo(x + 8 + i * 9, y + 8);
        ctx.lineTo(x + 12 + i * 9, y + TILE - 4);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#553333';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 7 + i * 9, y + TILE - 8, 3, 4);
    }
  }

  // The exit: a real glowing door!
  {
    const x = exitTile.c * TILE, y = exitTile.r * TILE;
    const glow = ctx.createRadialGradient(x + 20, y + 20, 5, x + 20, y + 20, 55);
    glow.addColorStop(0, 'rgba(120,255,120,0.35)');
    glow.addColorStop(1, 'rgba(120,255,120,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 35, y - 35, 110, 110);
    ctx.fillStyle = '#5d4023';
    ctx.fillRect(x + 6, y + 4, 28, 34);
    ctx.fillStyle = '#7a5a35';
    ctx.fillRect(x + 9, y + 7, 22, 28);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(x + 27, y + 22, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  // Coins and crates
  for (const p of coinPickups) {
    const x = p.c * TILE + 20, y = p.r * TILE + 20;
    if (!visible(x, y)) continue;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#B8860B'; ctx.stroke();
  }
  for (const p of crates) {
    const x = p.c * TILE + 8, y = p.r * TILE + 10;
    if (!visible(x, y)) continue;
    ctx.fillStyle = '#8a6034';
    ctx.fillRect(x, y, 24, 20);
    ctx.strokeStyle = '#5d4023'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 24, 20);
    ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x + 24, y + 10); ctx.stroke();
  }

  // Soldiers (realistic, with helmets and guns!)
  for (const s of soldiers) {
    if (!visible(s.x, s.y)) continue;
    const aim = Math.atan2(player.y - s.y, player.x - s.x);
    drawPerson(s.x, s.y, { shirt: '#4a5d33', pants: '#3d4f2f', skin: '#e0ac69', hat: 'helmet', aimAngle: aim, walking: true, hp: s.hp });
  }

  // Bullets (colored tracers by weapon)
  for (const b of bullets) {
    ctx.strokeStyle = b.color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(b.x - b.vx, b.y - b.vy); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.fillStyle = '#ff3333';
  for (const b of enemyBullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill(); }

  // Your pet 🐾
  if (pet) {
    ctx.font = '22px serif';
    ctx.fillText(pet.emoji, pet.x, pet.y + 20);
  }

  // You! (blinking when hurt)
  if (player.invuln % 10 < 6) {
    const c = COSTUMES[player.costume];
    const aim = Math.atan2(player.dirY, player.dirX || 1);
    drawPerson(player.x, player.y, { shirt: c.shirt, pants: c.pants, skin: c.skin, hat: c.hat, aimAngle: aim, walking: player.moving, holdTorch: true });
  }

  // Popups
  ctx.font = 'bold 14px Segoe UI';
  ctx.fillStyle = '#FFD700';
  for (const p of popups) ctx.fillText(p.text, p.x, p.y);

  ctx.restore();

  // ===== THE DARKNESS + YOUR TORCH LIGHT 🔦 =====
  const px = player.x + PLAYER_SIZE / 2 - camX;
  const py = player.y + PLAYER_SIZE / 2 - camY;
  const angle = Math.atan2(player.dirY, player.dirX || 1);
  const flicker = 1 + Math.sin(frame * 0.3) * 0.03 + Math.sin(frame * 0.71) * 0.02;

  dctx.globalCompositeOperation = 'source-over';
  dctx.clearRect(0, 0, VIEW_W, VIEW_H);
  dctx.fillStyle = 'rgba(0,0,0,0.965)';
  dctx.fillRect(0, 0, VIEW_W, VIEW_H);
  dctx.globalCompositeOperation = 'destination-out';

  // A little glow all around you
  let g = dctx.createRadialGradient(px, py, 8, px, py, 70 * flicker);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = g;
  dctx.beginPath(); dctx.arc(px, py, 70 * flicker, 0, Math.PI * 2); dctx.fill();

  // The torch cone — you only see where you point it!
  const len = TORCH_LENGTH * flicker;
  g = dctx.createRadialGradient(px, py, 25, px, py, len);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = g;
  dctx.beginPath();
  dctx.moveTo(px, py);
  dctx.arc(px, py, len, angle - TORCH_WIDTH, angle + TORCH_WIDTH);
  dctx.closePath();
  dctx.fill();

  // Wall torches glow through the dark too
  for (const t of visibleTorches) {
    const tx = t.x - camX, ty = t.y - camY;
    g = dctx.createRadialGradient(tx, ty, 3, tx, ty, 55);
    g.addColorStop(0, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    dctx.fillStyle = g;
    dctx.beginPath(); dctx.arc(tx, ty, 55, 0, Math.PI * 2); dctx.fill();
  }
  ctx.drawImage(darkCanvas, 0, 0);

  // Warm torchlight tint
  ctx.fillStyle = 'rgba(255, 140, 40, 0.05)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // HUD
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(8, 8, 620, 30);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Segoe UI';
  let hearts = '';
  for (let i = 0; i < player.maxHp; i++) hearts += (i < player.hp) ? '❤️' : '🖤';
  const w = WEAPONS[equipped];
  ctx.fillText(displayName + '  ' + hearts + '  🪙 ' + coins + '  📦 ' + materials + '  Maze ' + (level + 1) + '/' + LEVELS.length + '  ' + w.icon + ' ' + w.name, 16, 29);

  if (hudMessageTimer > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(VIEW_W / 2 - 200, VIEW_H - 46, 400, 30);
    ctx.fillStyle = '#7CFC00';
    ctx.font = 'bold 16px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(hudMessage, VIEW_W / 2, VIEW_H - 25);
    ctx.textAlign = 'left';
  }

  if (giftBanner > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(VIEW_W / 2 - 220, 50, 440, 40);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 DAILY GIFT: +10 🪙 +1 📦 — come back tomorrow!', VIEW_W / 2, 77);
    ctx.textAlign = 'left';
  }

  if (state === 'pause') drawScreen('⏸️ PAUSED', 'Press P (or click) to continue');
  if (state === 'dead') drawScreen('💀 YOU GOT CAUGHT!', 'Press SPACE to retry maze ' + (level + 1) + ' (you keep your stuff!)');
}

function drawTitle() {
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 52px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('🕹️ THE IMPOSSIBLE MAZE', VIEW_W / 2, 150);
  ctx.fillStyle = '#fff';
  ctx.font = '20px Segoe UI';
  ctx.fillText('Giant dark mazes... your torch 🔦 is your only light!', VIEW_W / 2, 215);
  ctx.fillText('Fight soldiers, loot coins 🪙 and materials 📦', VIEW_W / 2, 247);
  ctx.fillText('Buy weapons in the shop and EQUIP them with keys 1-4!', VIEW_W / 2, 279);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 26px Segoe UI';
  ctx.fillText('Press SPACE to start... if you dare', VIEW_W / 2, 380);
  ctx.textAlign = 'left';
}

function drawShop() {
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 38px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('🛒 THE SHOP', VIEW_W / 2, 66);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 20px Segoe UI';
  ctx.fillText('You escaped maze ' + (level + 1) + '!   Your loot: ' + coins + ' 🪙   ' + materials + ' 📦', VIEW_W / 2, 108);

  ctx.font = '18px Segoe UI';
  const line = (i, text, owned) => {
    ctx.fillStyle = owned ? '#777' : '#fff';
    ctx.fillText(text + (owned ? '  ✔ OWNED' : ''), VIEW_W / 2, 152 + i * 34);
  };
  line(0, '[1]  💥 Shotgun (3-way spread shot) — 15 🪙 + 2 📦', WEAPONS[1].owned);
  line(1, '[2]  🔥 Machine Gun (super fast) — 20 🪙 + 2 📦', WEAPONS[2].owned);
  line(2, '[3]  ⚡ Laser Rifle (mega damage) — 25 🪙 + 3 📦', WEAPONS[3].owned);
  line(3, '[4]  👟 Speed Boots (run faster) — 10 🪙 + 1 📦', hasBoots);
  line(4, '[5]  ❤️ Extra Heart — 10 🪙', false);
  line(5, '[6]  🎭 New Costume (' + COSTUMES.map(c => c.name).join(', ') + ') — 5 🪙', false);
  line(6, '[7]  🐾 Pet (' + PETS.join(' ') + ') — bites soldiers! — ' + (pet ? '6' : '12') + ' 🪙', false);

  if (shopMessage) {
    ctx.fillStyle = '#7CFC00';
    ctx.font = 'bold 19px Segoe UI';
    ctx.fillText(shopMessage, VIEW_W / 2, 428);
  }
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 24px Segoe UI';
  if (shopMode === 'visit') ctx.fillText('Press B or ENTER to go back to the maze 🔦', VIEW_W / 2, 490);
  else ctx.fillText('Press ENTER for the next maze ➡️', VIEW_W / 2, 490);
  ctx.textAlign = 'left';
}

function drawNameEntry() {
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 38px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('WHAT IS YOUR DISPLAY NAME?', VIEW_W / 2, 190);
  ctx.fillStyle = '#1e1e26';
  ctx.fillRect(VIEW_W / 2 - 180, 230, 360, 54);
  ctx.strokeStyle = '#FFA500'; ctx.lineWidth = 3;
  ctx.strokeRect(VIEW_W / 2 - 180, 230, 360, 54);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px Segoe UI';
  const cursor = (Math.floor(Date.now() / 400) % 2 === 0) ? '|' : ' ';
  ctx.fillText(typing + cursor, VIEW_W / 2, 268);
  ctx.fillStyle = '#FFD700';
  ctx.font = '20px Segoe UI';
  ctx.fillText('Type your name and press ENTER (max 12 letters)', VIEW_W / 2, 330);
  ctx.textAlign = 'left';
}

function drawInventory() {
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 38px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('🎒 YOUR ITEMS — ' + (displayName || 'Player'), VIEW_W / 2, 62);

  ctx.font = '19px Segoe UI';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('WEAPONS (press 1-4 to equip)', VIEW_W / 2, 110);
  WEAPONS.forEach((w, i) => {
    ctx.fillStyle = w.owned ? (i === equipped ? '#7CFC00' : '#fff') : '#555';
    const tag = w.owned ? (i === equipped ? '  ◄ EQUIPPED' : '') : '  (not owned)';
    ctx.fillText('[' + (i + 1) + ']  ' + w.icon + ' ' + w.name + tag, VIEW_W / 2, 142 + i * 30);
  });

  ctx.fillStyle = '#FFD700';
  ctx.fillText('TOOLS & GEAR', VIEW_W / 2, 290);
  ctx.fillStyle = hasBoots ? '#fff' : '#555';
  ctx.fillText('👟 Speed Boots ' + (hasBoots ? '✔' : '(not owned)'), VIEW_W / 2, 320);
  ctx.fillStyle = '#fff';
  ctx.fillText('❤️ Hearts: ' + player.maxHp + '     🪙 ' + coins + '     📦 ' + materials, VIEW_W / 2, 350);

  ctx.fillStyle = '#FFD700';
  ctx.fillText('COSTUME & PET', VIEW_W / 2, 398);
  ctx.fillStyle = '#fff';
  const extra = ownedCostumes.length > 1 ? '   [C] switch (' + ownedCostumes.length + ' owned)' : '';
  ctx.fillText('🎭 ' + COSTUMES[player.costume].name + extra, VIEW_W / 2, 428);
  ctx.fillText('🐾 Pet: ' + (pet ? pet.emoji : 'none — buy one in the shop!'), VIEW_W / 2, 458);

  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 22px Segoe UI';
  ctx.fillText('Press I to go back to the maze 🔦', VIEW_W / 2, 520);
  ctx.textAlign = 'left';
}

function drawBoard() {
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 40px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 LEADERBOARD', VIEW_W / 2, 66);

  ctx.font = '20px Segoe UI';
  if (!board.length) {
    ctx.fillStyle = '#aaa';
    ctx.fillText('No scores yet... escape all ' + LEVELS.length + ' mazes to set one!', VIEW_W / 2, 200);
  }
  board.forEach((entry, i) => {
    const isFriend = friends.includes(entry.name);
    const isMe = entry.name === displayName;
    ctx.fillStyle = isMe ? '#7CFC00' : (isFriend ? '#FFD700' : '#fff');
    const star = isFriend ? '⭐ ' : '';
    const medal = ['🥇', '🥈', '🥉'][i] || (i + 1) + '.';
    ctx.fillText(medal + '  ' + star + entry.name + ' — ' + entry.score + ' pts  (' + entry.when + ')', VIEW_W / 2, 116 + i * 32);
  });

  if (friends.length) {
    ctx.fillStyle = '#FFD700';
    ctx.font = '17px Segoe UI';
    ctx.fillText('⭐ Friends: ' + friends.join(', '), VIEW_W / 2, 462);
  }

  if (typingMode === 'friend') {
    ctx.fillStyle = '#1e1e26';
    ctx.fillRect(VIEW_W / 2 - 180, 476, 360, 40);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.strokeRect(VIEW_W / 2 - 180, 476, 360, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Segoe UI';
    const cursor = (Math.floor(Date.now() / 400) % 2 === 0) ? '|' : ' ';
    ctx.fillText('Friend name: ' + typing + cursor, VIEW_W / 2, 503);
  } else {
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 20px Segoe UI';
    ctx.fillText('[F] add a friend ⭐      [L] back to the game', VIEW_W / 2, 505);
  }
  ctx.textAlign = 'left';
}

function drawScreen(title, subtitle) {
  ctx.fillStyle = 'rgba(10, 10, 20, 0.75)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#FFA500';
  ctx.font = 'bold 46px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(title, VIEW_W / 2, 250);
  ctx.fillStyle = '#fff';
  ctx.font = '20px Segoe UI';
  ctx.fillText(subtitle, VIEW_W / 2, 300);
  ctx.textAlign = 'left';
}

// --- GAME LOOP (60 frames per second) ---
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
