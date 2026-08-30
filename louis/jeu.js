// ================================================
//  👾 L'AVENTURE DE LOUIS — jeu de plateforme
//  Modifie les réglages ci-dessous pour changer ton jeu !
// ================================================

const canvas = document.getElementById('jeu');
const ctx = canvas.getContext('2d');

// --- RÉGLAGES (à modifier pour t'amuser !) ---
const GRAVITE = 0.6;        // plus grand = on tombe plus vite
const VITESSE = 4.5;        // vitesse de course du héros
const FORCE_SAUT = 13;      // plus grand = on saute plus haut
const VIES_DEPART = 3;      // nombre de vies au début

// --- NIVEAUX ---
// Chaque plateforme : [x, y, largeur, hauteur]
// Chaque pièce : [x, y]   Chaque ennemi : [x, y, distance de patrouille]
const NIVEAUX = [
  {
    plateformes: [
      [0, 460, 600, 40], [700, 460, 500, 40], [1300, 460, 700, 40],
      [250, 360, 120, 20], [450, 290, 120, 20], [650, 220, 120, 20],
      [900, 340, 150, 20], [1150, 260, 120, 20], [1450, 350, 140, 20],
    ],
    pieces: [[290, 320], [500, 250], [700, 180], [960, 300], [1200, 220], [1510, 310], [800, 420], [1400, 420]],
    ennemis: [[750, 430, 120], [1350, 430, 150]],
    drapeau: [1900, 380],
    longueur: 2000,
  },
  {
    plateformes: [
      [0, 460, 400, 40], [520, 400, 150, 20], [780, 330, 130, 20],
      [1020, 260, 130, 20], [1260, 330, 130, 20], [1500, 400, 150, 20],
      [1750, 460, 550, 40], [900, 460, 250, 40],
    ],
    pieces: [[570, 360], [830, 290], [1070, 220], [1310, 290], [1550, 360], [1000, 420], [1900, 420], [2050, 420]],
    ennemis: [[950, 430, 90], [1800, 430, 180], [1050, 230, 60]],
    drapeau: [2200, 380],
    longueur: 2300,
  },
];

// --- ÉTAT DU JEU ---
let etat = 'accueil';   // accueil, jeu, gagne, perdu
let niveauActuel = 0;
let vies = VIES_DEPART;
let score = 0;
let camera = 0;

const heros = { x: 50, y: 300, l: 34, h: 40, vx: 0, vy: 0, auSol: false, direction: 1 };
let pieces = [];
let ennemis = [];
let rochers = [];       // les rochers qui tombent du ciel !
let tirs = [];          // les lasers du héros
let compteurRocher = 0; // compte les images avant le prochain rocher
let cooldownTir = 0;    // petit délai entre deux tirs

// --- RÉGLAGES DES ROCHERS ET DES TIRS ---
const RYTHME_ROCHERS = 120;  // plus petit = les rochers tombent plus souvent
const VITESSE_TIR = 11;      // vitesse des lasers

// --- LA FUSÉE 🚀 (arrivée au début, décollage à la fin !) ---
let fusee = { x: 60, y: -120, vy: 0 };
let timerIntro = 0;
const SOL_FUSEE = 430;       // hauteur où la fusée se pose

const touches = {};
document.addEventListener('keydown', e => {
  touches[e.code] = true;
  if (e.code === 'Space' || e.code === 'ArrowUp') e.preventDefault();
  if (e.code === 'KeyP') basculerPause();
  if ((etat === 'accueil' || etat === 'perdu' || etat === 'gagne') && e.code === 'Space') demarrer();
});
document.addEventListener('keyup', e => touches[e.code] = false);
canvas.addEventListener('click', () => {
  if (etat === 'pause') basculerPause();
  else if (etat === 'accueil' || etat === 'perdu' || etat === 'gagne') demarrer();
});

function basculerPause() {
  if (etat === 'jeu') etat = 'pause';
  else if (etat === 'pause') etat = 'jeu';
  document.getElementById('btnPause').textContent = (etat === 'pause') ? '▶️ Reprendre' : '⏸️ Pause';
}
document.getElementById('btnPause').addEventListener('click', basculerPause);

function demarrer() {
  if (etat === 'gagne' || etat === 'perdu') { niveauActuel = 0; vies = VIES_DEPART; score = 0; }
  chargerNiveau(niveauActuel);
  // Ta fusée arrive du ciel !
  etat = 'intro';
  fusee = { x: 117, y: -120, vy: 0 };
  timerIntro = 0;
}

function chargerNiveau(n) {
  const niv = NIVEAUX[n];
  pieces = niv.pieces.map(p => ({ x: p[0], y: p[1], prise: false }));
  ennemis = niv.ennemis.map(e => ({ x: e[0], y: e[1], depart: e[0], dist: e[2], sens: 1, l: 32, h: 30 }));
  rochers = [];
  tirs = [];
  compteurRocher = 0;
  heros.x = 100; heros.y = 300; heros.vx = 0; heros.vy = 0;
  camera = 0;
}

function perdreVie() {
  vies--;
  if (vies <= 0) { etat = 'perdu'; }
  else { heros.x = 100; heros.y = 300; heros.vx = 0; heros.vy = 0; camera = 0; }
}

// --- MISE À JOUR (la logique du jeu) ---
function maj() {
  // La fusée se pose au début du jeu
  if (etat === 'intro') {
    if (fusee.y < SOL_FUSEE) { fusee.y += 4; }
    else { timerIntro++; if (timerIntro > 35) etat = 'jeu'; }
    return;
  }
  // La fusée décolle à la fin du jeu !
  if (etat === 'decollage') {
    fusee.vy -= 0.3;
    fusee.y += fusee.vy;
    if (fusee.y < -180) etat = 'gagne';
    return;
  }
  if (etat !== 'jeu') return;
  const niv = NIVEAUX[niveauActuel];

  // Déplacements
  heros.vx = 0;
  if (touches['ArrowLeft'] || touches['KeyA'] || touches['KeyQ']) { heros.vx = -VITESSE; heros.direction = -1; }
  if (touches['ArrowRight'] || touches['KeyD']) { heros.vx = VITESSE; heros.direction = 1; }
  if ((touches['Space'] || touches['ArrowUp'] || touches['KeyW'] || touches['KeyZ']) && heros.auSol) {
    heros.vy = -FORCE_SAUT;
    heros.auSol = false;
  }

  // Tirer un laser avec X
  if (cooldownTir > 0) cooldownTir--;
  if (touches['KeyX'] && cooldownTir <= 0) {
    tirs.push({ x: heros.x + heros.l / 2, y: heros.y + 16, vx: heros.direction * VITESSE_TIR });
    cooldownTir = 15;
  }

  heros.vy += GRAVITE;
  heros.x += heros.vx;
  heros.y += heros.vy;
  if (heros.x < 0) heros.x = 0;

  // Collisions avec les plateformes
  heros.auSol = false;
  for (const p of niv.plateformes) {
    const [px, py, pl, ph] = p;
    if (heros.x + heros.l > px && heros.x < px + pl) {
      // On atterrit dessus
      if (heros.vy >= 0 && heros.y + heros.h > py && heros.y + heros.h - heros.vy <= py + 1) {
        heros.y = py - heros.h;
        heros.vy = 0;
        heros.auSol = true;
      }
    }
  }

  // Tombé dans le vide ?
  if (heros.y > canvas.height + 100) perdreVie();

  // Pièces
  for (const piece of pieces) {
    if (!piece.prise && Math.abs(heros.x + heros.l/2 - piece.x) < 30 && Math.abs(heros.y + heros.h/2 - piece.y) < 30) {
      piece.prise = true;
      score += 10;
    }
  }

  // Ennemis qui patrouillent
  for (const e of ennemis) {
    e.x += e.sens * 1.5;
    if (e.x > e.depart + e.dist || e.x < e.depart) e.sens *= -1;
    // Collision avec le héros
    if (heros.x < e.x + e.l && heros.x + heros.l > e.x && heros.y < e.y + e.h && heros.y + heros.h > e.y) {
      // Si on saute sur sa tête, on l'écrase !
      if (heros.vy > 0 && heros.y + heros.h - e.y < 20) {
        e.x = -9999; // l'ennemi disparaît
        heros.vy = -8;
        score += 25;
      } else {
        perdreVie();
      }
    }
  }

  // Les météorites tombent de l'espace ! ☄️
  compteurRocher++;
  if (compteurRocher >= RYTHME_ROCHERS) {
    compteurRocher = 0;
    // La météorite apparaît au-dessus du héros (un peu au hasard)
    const rx = heros.x - 100 + Math.random() * 400;
    rochers.push({ x: rx, y: -40, vy: 1, taille: 34 });
  }
  for (const r of rochers) {
    r.vy += GRAVITE * 0.35;   // les rochers tombent un peu moins vite que le héros
    r.y += r.vy;
    // Le rocher touche le héros ? Aïe !
    if (r.x < heros.x + heros.l && r.x + r.taille > heros.x &&
        r.y < heros.y + heros.h && r.y + r.taille > heros.y) {
      r.detruit = true;
      perdreVie();
    }
    // Le rocher touche une plateforme ? Il se casse.
    for (const [px, py, pl] of niv.plateformes) {
      if (r.x + r.taille > px && r.x < px + pl && r.y + r.taille > py && r.y + r.taille < py + 30) r.detruit = true;
    }
    if (r.y > canvas.height + 60) r.detruit = true;
  }
  rochers = rochers.filter(r => !r.detruit);

  // Les lasers avancent et détruisent rochers et ennemis 💥
  for (const t of tirs) {
    t.x += t.vx;
    if (t.x < camera - 50 || t.x > camera + canvas.width + 50) t.fini = true;
    for (const r of rochers) {
      if (!r.detruit && t.x > r.x && t.x < r.x + r.taille && t.y > r.y && t.y < r.y + r.taille) {
        r.detruit = true; t.fini = true; score += 15;
      }
    }
    for (const e of ennemis) {
      if (e.x > -100 && t.x > e.x && t.x < e.x + e.l && t.y > e.y && t.y < e.y + e.h) {
        e.x = -9999; t.fini = true; score += 25;
      }
    }
  }
  tirs = tirs.filter(t => !t.fini);
  rochers = rochers.filter(r => !r.detruit);

  // Drapeau d'arrivée (ou rampe de lancement au dernier niveau !)
  const [dx, dy] = niv.drapeau;
  if (Math.abs(heros.x - dx) < 30 && heros.y + heros.h > dy - 20) {
    if (niveauActuel === NIVEAUX.length - 1) {
      // Ta fusée décolle pour rentrer à la maison !
      etat = 'decollage';
      fusee = { x: heros.x + heros.l / 2, y: SOL_FUSEE, vy: 0 };
    } else {
      niveauActuel++;
      chargerNiveau(niveauActuel);
    }
  }

  // La caméra suit le héros
  camera = Math.max(0, Math.min(heros.x - 300, niv.longueur - canvas.width));
}

// --- DESSIN ---
function dessiner() {
  // L'espace ! 🌌
  const espace = ctx.createLinearGradient(0, 0, 0, canvas.height);
  espace.addColorStop(0, '#020208');
  espace.addColorStop(0.6, '#0d0d33');
  espace.addColorStop(1, '#2a1a4a');
  ctx.fillStyle = espace;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Les étoiles qui scintillent ✨ (elles bougent moins vite : effet de profondeur)
  for (let i = 0; i < 90; i++) {
    const ex = ((i * 137 - camera * 0.25) % (canvas.width + 40) + canvas.width + 40) % (canvas.width + 40) - 20;
    const ey = (i * 53) % (canvas.height - 60);
    const taille = (i % 3 === 0) ? 2.2 : 1.2;
    ctx.fillStyle = (i % 7 === 0) ? '#aaddff' : '#ffffff';
    ctx.fillRect(ex, ey, taille, taille);
  }

  // La Terre au loin 🌍 et une planète
  ctx.font = '52px serif';
  ctx.fillText('🌍', ((720 - camera * 0.1) % (canvas.width + 100) + canvas.width + 100) % (canvas.width + 100) - 50, 90);
  ctx.font = '34px serif';
  ctx.fillText('🪐', ((200 - camera * 0.15) % (canvas.width + 100) + canvas.width + 100) % (canvas.width + 100) - 50, 150);

  if (etat === 'accueil') { ecranTexte('👾 LOUIS DANS L\'ESPACE 🚀', 'Appuie sur ESPACE pour jouer !'); return; }
  if (etat === 'perdu')  { ecranTexte('💀 GAME OVER', 'Score : ' + score + '  —  ESPACE pour rejouer'); return; }
  if (etat === 'gagne')  { ecranTexte('🏆 BRAVO LOUIS !', 'Score final : ' + score + '  —  ESPACE pour rejouer'); return; }

  const niv = NIVEAUX[niveauActuel];
  ctx.save();
  ctx.translate(-camera, 0);

  // Plateformes de roche lunaire
  for (const [px, py, pl, ph] of niv.plateformes) {
    ctx.fillStyle = '#4a4a63';
    ctx.fillRect(px, py, pl, ph);
    ctx.fillStyle = '#9c9cc4';
    ctx.fillRect(px, py, pl, 8);
    // Quelques cratères pour faire joli
    ctx.fillStyle = '#3a3a50';
    for (let cx = px + 25; cx < px + pl - 15; cx += 70) {
      ctx.beginPath();
      ctx.arc(cx, py + ph / 2 + 4, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pièces
  for (const piece of pieces) {
    if (piece.prise) continue;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(piece.x, piece.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Ennemis : des soucoupes volantes !
  for (const e of ennemis) {
    if (e.x < -100) continue;
    ctx.font = '28px serif';
    ctx.fillText('🛸', e.x, e.y + e.h - 2);
  }

  // Drapeau (niveaux normaux) ou rampe de lancement (dernier niveau)
  const [dx, dy] = niv.drapeau;
  if (niveauActuel === NIVEAUX.length - 1) {
    // La rampe de lancement qui te ramène à la maison
    ctx.fillStyle = '#2e2e44';
    ctx.fillRect(dx - 25, 445, 90, 15);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#00FF66';
      ctx.beginPath();
      ctx.arc(dx - 12 + i * 22, 452, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = '26px serif';
    ctx.fillText('🏠', dx + 8, 430);
  } else {
    ctx.fillStyle = '#555';
    ctx.fillRect(dx, dy - 60, 5, 80);
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.moveTo(dx + 5, dy - 60);
    ctx.lineTo(dx + 45, dy - 48);
    ctx.lineTo(dx + 5, dy - 36);
    ctx.fill();
  }

  // Ta fusée qui atterrit au début...
  if (etat === 'intro') dessinerFusee(fusee.x, fusee.y, fusee.y < SOL_FUSEE);

  // ...et qui décolle à la fin !
  if (etat === 'decollage') dessinerFusee(fusee.x, fusee.y, true);

  // Les météorites ☄️
  for (const r of rochers) {
    ctx.font = r.taille + 'px serif';
    ctx.fillText('☄️', r.x, r.y + r.taille);
  }

  // Les lasers 💚
  for (const t of tirs) {
    ctx.fillStyle = '#00FF66';
    ctx.shadowColor = '#00FF66';
    ctx.shadowBlur = 8;
    ctx.fillRect(t.x - 8, t.y - 3, 16, 6);
    ctx.shadowBlur = 0;
  }

  // Le héros : TA FUSÉE ! 🚀 (avec des flammes quand elle saute)
  if (etat !== 'intro' && etat !== 'decollage') {
    ctx.save();
    ctx.translate(heros.x + heros.l / 2, heros.y + heros.h / 2);
    ctx.rotate(-Math.PI / 4);   // on redresse l'emoji 🚀
    ctx.font = '42px serif';
    ctx.fillText('🚀', -21, 15);
    ctx.restore();
    if (!heros.auSol && heros.vy < -1) {
      ctx.font = '22px serif';
      ctx.fillText('🔥', heros.x + 6, heros.y + heros.h + 22);
    }
  }

  ctx.restore();

  // HUD (les infos en haut)
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(10, 10, 280, 34);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Segoe UI';
  ctx.fillText('❤️ ' + vies + '    ⭐ ' + score + '    Niveau ' + (niveauActuel + 1), 22, 33);

  // Écran de pause par-dessus le jeu
  if (etat === 'pause') {
    ctx.fillStyle = 'rgba(20, 20, 60, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('⏸️ PAUSE', canvas.width / 2, 240);
    ctx.font = '20px Segoe UI';
    ctx.fillText('Appuie sur P (ou clique) pour continuer', canvas.width / 2, 290);
    ctx.textAlign = 'left';
  }
}

// Dessine la fusée 🚀 (pointée vers le haut, avec des flammes si elle vole)
function dessinerFusee(x, y, flamme) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 4);   // l'emoji 🚀 penche, on le redresse
  ctx.font = '56px serif';
  ctx.fillText('🚀', -30, 20);
  ctx.restore();
  if (flamme) {
    ctx.font = '30px serif';
    ctx.fillText('🔥', x - 16, y + 55);
  }
}

function ecranTexte(titre, sousTitre) {
  ctx.fillStyle = 'rgba(20, 20, 60, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#7CFC00';
  ctx.font = 'bold 44px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(titre, canvas.width / 2, 220);
  ctx.fillStyle = '#fff';
  ctx.font = '22px Segoe UI';
  ctx.fillText(sousTitre, canvas.width / 2, 280);
  ctx.textAlign = 'left';
}

// --- BOUCLE DU JEU (60 images par seconde) ---
function boucle() {
  maj();
  dessiner();
  requestAnimationFrame(boucle);
}
boucle();
