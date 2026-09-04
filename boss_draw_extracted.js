// 7. Render 6 Distinct Colossal Flagship Bosses
  if (boss) {
    cx.save(); cx.translate(boss.x, boss.y);

    // Enrage Overload Lightning & Fiery Aura
    if (boss.enraged) {
      const eg = cx.createRadialGradient(0, 0, 40, 0, 0, boss.w * 0.58);
      eg.addColorStop(0, 'rgba(255, 0, 50, 0.45)');
      eg.addColorStop(0.5, 'rgba(255, 100, 0, 0.25)');
      eg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = eg;
      cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.56, boss.h * 0.52, 0, 0, Math.PI * 2); cx.fill();

      // Overload Electric Lightning Sparks
      cx.strokeStyle = '#ff3300'; cx.lineWidth = 2.5;
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + t * 12;
        const px = Math.cos(a) * (boss.w * 0.48), py = Math.sin(a) * (boss.h * 0.44);
        cx.beginPath();
        cx.moveTo(px, py);
        cx.lineTo(px + (Math.random() - 0.5) * 25, py + (Math.random() - 0.5) * 25);
        cx.stroke();
      }
    }
    
    // Captain Solo Hyperspace Overdrive Transparency Shimmer
    if (boss.isCloaked) {
      cx.globalAlpha = 0.22 + Math.sin(t * 18) * 0.12;
    }

    if (boss.type === 'dread') {
      // BOSS 1: GRAND ADMIRAL VEX: IMPERIAL ECLIPSE SUPER-DREADNOUGHT (Star Wars Imperial Star Destroyer)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.55);
      bg.addColorStop(0, 'rgba(0, 255, 170, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.54, boss.h * 0.50, 0, 0, Math.PI * 2); cx.fill();

      // Active Axial Planet-Killer Continuous Death Ray
      if (boss.beamActive > 0) {
        cx.save();
        cx.shadowColor = '#00ffaa'; cx.shadowBlur = 24;
        cx.strokeStyle = 'rgba(0, 255, 170, 0.85)'; cx.lineWidth = 32;
        cx.beginPath(); cx.moveTo(-boss.w * 0.48, 0); cx.lineTo(-boss.x - 80, 0); cx.stroke();
        cx.strokeStyle = '#ffffff'; cx.lineWidth = 12;
        cx.beginPath(); cx.moveTo(-boss.w * 0.48, 0); cx.lineTo(-boss.x - 80, 0); cx.stroke();
        // Electric Tachyon Arc Rings along the beam
        cx.strokeStyle = '#00ffee'; cx.lineWidth = 2.5;
        for (let bx = -boss.w * 0.5; bx > -boss.x - 80; bx -= 75) {
          cx.beginPath(); cx.ellipse(bx, 0, 8, 22 + Math.sin(t * 20 + bx) * 6, 0, 0, Math.PI * 2); cx.stroke();
        }
        cx.restore();
      }

      // Main Triangular Imperial Star Destroyer Dagger Wedge
      const dg = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      dg.addColorStop(0, '#050811'); dg.addColorStop(0.35, '#0f172a'); dg.addColorStop(0.7, '#1e293b'); dg.addColorStop(1, '#475569');
      cx.fillStyle = dg;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.48, 0);                 // Forward prow tip
      cx.lineTo(boss.w * 0.44, -boss.h * 0.46);    // Port aft corner
      cx.lineTo(boss.w * 0.48, -boss.h * 0.22);    // Port engine
      cx.lineTo(boss.w * 0.40, 0);                 // Aft center notch
      cx.lineTo(boss.w * 0.48, boss.h * 0.22);     // Starboard engine
      cx.lineTo(boss.w * 0.44, boss.h * 0.46);     // Starboard aft corner
      cx.closePath();
      cx.fill();
      cx.strokeStyle = '#00ffaa'; cx.lineWidth = 3.5; cx.stroke();

      // Side Trench Greeble Armor Plating
      cx.fillStyle = '#090d16';
      cx.beginPath();
      cx.moveTo(-boss.w * 0.25, 0);
      cx.lineTo(boss.w * 0.38, -boss.h * 0.34);
      cx.lineTo(boss.w * 0.38, boss.h * 0.34);
      cx.closePath();
      cx.fill();
      cx.strokeStyle = 'rgba(0, 255, 170, 0.4)'; cx.lineWidth = 1.4; cx.stroke();

      // Axial Planet-Killer Superlaser Trench
      cx.strokeStyle = '#00ffaa'; cx.lineWidth = 3;
      cx.beginPath(); cx.moveTo(-boss.w * 0.48, 0); cx.lineTo(-boss.w * 0.1, 0); cx.stroke();

      // Death Star-Style Axial Superlaser Focus Core
      const cr = cx.createRadialGradient(-boss.w * 0.18, 0, 4, -boss.w * 0.18, 0, 36);
      cr.addColorStop(0, '#ffffff'); cr.addColorStop(0.35, '#00ffaa'); cr.addColorStop(0.8, '#059669'); cr.addColorStop(1, '#022c22');
      cx.fillStyle = cr; cx.beginPath(); cx.arc(-boss.w * 0.18, 0, 22 + Math.sin(t * 12) * 2.5, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 2.2; cx.stroke();

      // Dual Elevated Imperial Command Bridge Towers with Scanner Globes
      cx.fillStyle = '#020617';
      cx.fillRect(boss.w * 0.12, -boss.h * 0.28, boss.w * 0.22, boss.h * 0.56);
      cx.strokeStyle = '#00ffaa'; cx.lineWidth = 2;
      cx.strokeRect(boss.w * 0.12, -boss.h * 0.28, boss.w * 0.22, boss.h * 0.56);

      // Deflector Shield Sensor Globes on Bridge
      for (const by of [-boss.h * 0.34, boss.h * 0.34]) {
        cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(boss.w * 0.22, by, 7, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#00ffaa'; cx.lineWidth = 1.5; cx.stroke();
        cx.fillStyle = '#00ffaa'; cx.beginPath(); cx.arc(boss.w * 0.22, by, 3, 0, Math.PI * 2); cx.fill();
      }

      // Ventral Crimson Hangar Bay
      cx.fillStyle = '#ff0033';
      cx.fillRect(boss.w * 0.02, -8, 24, 16);

      // Dual Aimed Heavy Turbolasers
      const aimAng = Math.atan2(ship.y - boss.y, ship.x - boss.x);
      for (const wy of [-boss.h * 0.22, boss.h * 0.22]) {
        cx.save(); cx.translate(boss.w * 0.05, wy); cx.rotate(aimAng);
        cx.fillStyle = '#020617'; cx.fillRect(0, -5, 28, 10);
        cx.fillStyle = '#00ffaa'; cx.fillRect(22, -3, 6, 6);
        cx.strokeStyle = '#00ffaa'; cx.lineWidth = 1.5; cx.strokeRect(0, -5, 28, 10);
        cx.restore();
      }

      // 3 Primary Imperial Ion Engines with Emerald Flares
      for (const ty of [-boss.h * 0.22, 0, boss.h * 0.22]) {
        cx.fillStyle = '#00ffaa';
        cx.beginPath(); cx.arc(boss.w * 0.46, ty, 6.5 + Math.sin(t * 18 + ty) * 2, 0, Math.PI * 2); cx.fill();
      }

    } else if (boss.type === 'hive') {
      // BOSS 2: OVERLORD CHRONOS: DEATH STAR ORBITAL CITADEL (Star Wars Death Star Battlestation)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.58);
      bg.addColorStop(0, 'rgba(0, 229, 255, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.arc(0, 0, boss.w * 0.54, 0, Math.PI * 2); cx.fill();

      // Active Gravitational Tractor Beam Stream to Player Galleon
      if (boss.tractorT > 0) {
        cx.save();
        const dishX = -boss.w * 0.12, dishY = -boss.h * 0.15;
        const tx = ship.x - boss.x, ty = ship.y - boss.y;
        const beamDist = Math.hypot(tx - dishX, ty - dishY) || 1;
        const beamAng = Math.atan2(ty - dishY, tx - dishX);

        // 1. Wide Gravitational Lensing / Atmospheric Suction Funnel
        const coneGrad = cx.createRadialGradient(dishX, dishY, 20, dishX, dishY, beamDist);
        coneGrad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
        coneGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.25)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        cx.fillStyle = coneGrad;
        cx.beginPath();
        cx.moveTo(dishX, dishY);
        cx.lineTo(tx + Math.cos(beamAng + Math.PI * 0.5) * 65, ty + Math.sin(beamAng + Math.PI * 0.5) * 65);
        cx.lineTo(tx + Math.cos(beamAng - Math.PI * 0.5) * 65, ty + Math.sin(beamAng - Math.PI * 0.5) * 65);
        cx.closePath();
        cx.fill();

        // 2. Multi-Strand High-Energy Tractor Beams (Outer cyan aura & inner white laser)
        cx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
        cx.lineWidth = 26 + Math.sin(t * 30) * 8;
        cx.beginPath(); cx.moveTo(dishX, dishY); cx.lineTo(tx, ty); cx.stroke();

        cx.strokeStyle = '#00ffee';
        cx.lineWidth = 12 + Math.cos(t * 35) * 4;
        cx.beginPath(); cx.moveTo(dishX, dishY); cx.lineTo(tx, ty); cx.stroke();

        cx.strokeStyle = '#ffffff';
        cx.lineWidth = 4;
        cx.beginPath(); cx.moveTo(dishX, dishY); cx.lineTo(tx, ty); cx.stroke();

        // 3. Spiraling Helical Magnetic Energy Coils wrapping the beam
        cx.strokeStyle = '#38bdf8';
        cx.lineWidth = 2.5;
        cx.beginPath();
        const steps = 30;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const lx = dishX + (tx - dishX) * u;
          const ly = dishY + (ty - dishY) * u;
          const coilOffset = Math.sin(u * 22 - t * 35) * (18 * (1 - u * 0.5));
          const px = lx + Math.cos(beamAng + Math.PI * 0.5) * coilOffset;
          const py = ly + Math.sin(beamAng + Math.PI * 0.5) * coilOffset;
          if (s === 0) cx.moveTo(px, py);
          else cx.lineTo(px, py);
        }
        cx.stroke();

        // 4. Inward-Sliding Concentric Gravitational Wave Distortion Rings
        for (let rIdx = 0; rIdx < 6; rIdx++) {
          const p = (rIdx / 6 + (t * 1.8)) % 1.0;
          const ringX = tx + (dishX - tx) * p; // moving from ship to dish!
          const ringY = ty + (dishY - ty) * p;
          const ringRadius = 12 + p * 24;
          cx.strokeStyle = `rgba(0, 255, 238, ${0.9 - p * 0.5})`;
          cx.lineWidth = 3.0;
          cx.beginPath(); cx.ellipse(ringX, ringY, ringRadius, ringRadius * 0.55, beamAng, 0, Math.PI * 2); cx.stroke();
        }

        // 5. Magnetic Lightning Tendrils branching from Dish onto Ship
        cx.strokeStyle = '#ffffff';
        cx.lineWidth = 1.8;
        for (let lt = 0; lt < 3; lt++) {
          const lSeed = lt * 1.3 + Math.floor(t * 15);
          cx.beginPath();
          let curX = dishX, curY = dishY;
          cx.moveTo(curX, curY);
          for (let seg = 1; seg <= 5; seg++) {
            const segU = seg / 5;
            const targetSegX = dishX + (tx - dishX) * segU;
            const targetSegY = dishY + (ty - dishY) * segU;
            curX = targetSegX + (Math.sin(lSeed * 7 + seg) * 16);
            curY = targetSegY + (Math.cos(lSeed * 5 + seg) * 16);
            cx.lineTo(curX, curY);
          }
          cx.stroke();
        }

        cx.restore();
      }

      // Outer Magnetic Docking Pylon Ring Arms
      cx.strokeStyle = 'rgba(0, 229, 255, 0.35)'; cx.lineWidth = 3;
      cx.beginPath(); cx.arc(0, 0, boss.w * 0.46, 0, Math.PI * 2); cx.stroke();

      // 4 Heavy Magnetic Hyperdrive Pylons with Active Lightning Arcs
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + boss.spinRing * 0.6;
        const px = Math.cos(a) * (boss.w * 0.42), py = Math.sin(a) * (boss.h * 0.40);
        cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(px, py, 18, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#00ffee'; cx.lineWidth = 2.5; cx.stroke();
        
        // Pylon Core
        cx.fillStyle = '#ffffff'; cx.beginPath(); cx.arc(px, py, 7, 0, Math.PI * 2); cx.fill();
        
        // Lightning Arc to Battlestation Core
        if (Math.random() < 0.6) {
          cx.strokeStyle = '#00ffee'; cx.lineWidth = 1.8;
          cx.beginPath();
          cx.moveTo(px, py);
          cx.lineTo(px * 0.5 + (Math.random() - 0.5) * 14, py * 0.5 + (Math.random() - 0.5) * 14);
          cx.lineTo(0, 0);
          cx.stroke();
        }
      }

      // Colossal Spherical Death Star Armored Hull
      const tg = cx.createLinearGradient(0, -boss.h * 0.44, 0, boss.h * 0.44);
      tg.addColorStop(0, '#38bdf8'); tg.addColorStop(0.35, '#0284c7'); tg.addColorStop(0.75, '#082f49'); tg.addColorStop(1, '#020617');
      cx.fillStyle = tg;
      cx.beginPath(); cx.arc(0, 0, boss.w * 0.36, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#00e5ff'; cx.lineWidth = 3.5; cx.stroke();

      // Equatorial Super-Trench with Turbolasers
      cx.strokeStyle = '#020617'; cx.lineWidth = 6;
      cx.beginPath(); cx.moveTo(-boss.w * 0.36, 0); cx.lineTo(boss.w * 0.36, 0); cx.stroke();
      cx.strokeStyle = '#00ffee'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(-boss.w * 0.36, 0); cx.lineTo(boss.w * 0.36, 0); cx.stroke();

      // Death Star Concave Superlaser Focus Dish
      const dishX = -boss.w * 0.12, dishY = -boss.h * 0.15;
      const cr = cx.createRadialGradient(dishX, dishY, 3, dishX, dishY, 24);
      cr.addColorStop(0, '#ffffff'); cr.addColorStop(0.35, '#00e5ff'); cr.addColorStop(0.8, '#0284c7'); cr.addColorStop(1, '#082f49');
      cx.fillStyle = cr; cx.beginPath(); cx.ellipse(dishX, dishY, 18, 14, -0.2, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 2; cx.stroke();

      // Convergence Laser Beams into Focus Core
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 1.2;
      for (const ba of [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]) {
        cx.beginPath();
        cx.moveTo(dishX + Math.cos(ba) * 14, dishY + Math.sin(ba) * 10);
        cx.lineTo(dishX, dishY);
        cx.stroke();
      }

    } else if (boss.type === 'ram') {
      // BOSS 3: ADMIRAL RADDUS: MON CALAMARI MC85 STAR CRUISER (THE PROFUNDITY / RADDUS)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.58);
      bg.addColorStop(0, 'rgba(56, 189, 248, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.56, boss.h * 0.52, 0, 0, Math.PI * 2); cx.fill();

      // MASSIVE DEEP VENTRAL COMMAND CITY FIN / SPIRE MAST (From User Reference Photo)
      const finX = -boss.w * 0.05;
      const fg = cx.createLinearGradient(finX, 0, finX, boss.h * 0.50);
      fg.addColorStop(0, '#334155'); fg.addColorStop(0.5, '#475569'); fg.addColorStop(1, '#0f172a');
      cx.fillStyle = fg;
      cx.beginPath();
      cx.moveTo(finX - 16, 0);
      cx.lineTo(finX - 8, boss.h * 0.48);
      cx.lineTo(finX + 8, boss.h * 0.48);
      cx.lineTo(finX + 22, 0);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#38bdf8'; cx.lineWidth = 2.4; cx.stroke();

      // Ventral Observation Command Bridge Pod at Bottom of Fin
      cx.fillStyle = '#0f172a';
      cx.beginPath(); cx.ellipse(finX, boss.h * 0.48, 16, 8, 0, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#00e5ff'; cx.lineWidth = 2; cx.stroke();
      cx.fillStyle = '#00e5ff';
      cx.beginPath(); cx.arc(finX, boss.h * 0.48, 4.5 + Math.sin(t * 12) * 1.5, 0, Math.PI * 2); cx.fill();

      // Main Hydrodynamic Curved Whale-like Mon Calamari Upper Hull
      const mg = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      mg.addColorStop(0, '#0f172a'); mg.addColorStop(0.3, '#334155'); mg.addColorStop(0.65, '#94a3b8'); mg.addColorStop(0.9, '#e2e8f0'); mg.addColorStop(1, '#f8fafc');
      cx.fillStyle = mg;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.50, -boss.h * 0.12);     // Forward bulbous prow
      cx.quadraticCurveTo(-boss.w * 0.15, -boss.h * 0.48, boss.w * 0.38, -boss.h * 0.38); // Dorsal curve
      cx.lineTo(boss.w * 0.48, -boss.h * 0.18);      // Aft upper engine notch
      cx.lineTo(boss.w * 0.46, boss.h * 0.08);       // Aft lower spine
      cx.quadraticCurveTo(0, boss.h * 0.14, -boss.w * 0.50, -boss.h * 0.12); // Ventral keel curve
      cx.closePath();
      cx.fill();
      cx.strokeStyle = '#38bdf8'; cx.lineWidth = 3.6; cx.stroke();

      // Mon Calamari Organic Hull Blister Domes & Shield Bulbs
      const blisters = [
        { x: -boss.w * 0.28, y: -boss.h * 0.28, rx: 22, ry: 8 },
        { x: -boss.w * 0.05, y: -boss.h * 0.32, rx: 28, ry: 9 },
        { x: boss.w * 0.20, y: -boss.h * 0.26, rx: 20, ry: 7 },
        { x: -boss.w * 0.32, y: -boss.h * 0.04, rx: 16, ry: 6 }
      ];
      for (const b of blisters) {
        cx.fillStyle = '#1e293b';
        cx.beginPath(); cx.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#cbd5e1'; cx.lineWidth = 1.4; cx.stroke();
        cx.fillStyle = '#38bdf8'; cx.beginPath(); cx.arc(b.x, b.y, 3, 0, Math.PI * 2); cx.fill();
      }

      // Dorsal Command Spire & Sensor Mast
      cx.fillStyle = '#0f172a';
      cx.beginPath();
      cx.moveTo(boss.w * 0.08, -boss.h * 0.34);
      cx.lineTo(boss.w * 0.24, -boss.h * 0.44);
      cx.lineTo(boss.w * 0.28, -boss.h * 0.36);
      cx.lineTo(boss.w * 0.12, -boss.h * 0.28);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#00e5ff'; cx.lineWidth = 1.6; cx.stroke();

      // Accompanying Nebulon-B Escort Frigate in Formation
      cx.save(); cx.translate(boss.w * 0.28, boss.h * 0.32);
      cx.fillStyle = '#cbd5e1'; cx.beginPath();
      cx.moveTo(-16, -4); cx.lineTo(4, -8); cx.lineTo(8, 6); cx.lineTo(-16, 2);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#38bdf8'; cx.lineWidth = 1.5; cx.stroke();
      cx.strokeStyle = '#475569'; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(8, -1); cx.lineTo(24, -1); cx.stroke();
      cx.fillStyle = '#334155'; cx.fillRect(24, -6, 12, 10);
      cx.restore();

      // Multi-Engine Sub-Light Ion Thrusters Cluster (Cyan Glow)
      for (const ty of [-boss.h * 0.26, -boss.h * 0.18, -boss.h * 0.08, 0]) {
        cx.fillStyle = '#00e5ff';
        cx.beginPath(); cx.arc(boss.w * 0.46, ty, 5.5 + Math.sin(t * 18 + ty) * 1.8, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#ffffff';
        cx.beginPath(); cx.arc(boss.w * 0.46, ty, 2.5, 0, Math.PI * 2); cx.fill();
      }

    } else if (boss.type === 'void') {
      // BOSS 4: CAPTAIN SOLO: THE ROGUE MILLENNIUM FALCON (YT-1300 CORELLIAN GUNSHIP)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.58);
      bg.addColorStop(0, 'rgba(0, 229, 255, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.56, boss.h * 0.52, 0, 0, Math.PI * 2); cx.fill();

      // Glowing Full-Width Cyan Sub-Light Ion Thruster Strip along Stern
      const eg = cx.createLinearGradient(boss.w * 0.35, 0, boss.w * 0.65, 0);
      eg.addColorStop(0, '#ffffff'); eg.addColorStop(0.35, '#00ffee'); eg.addColorStop(0.75, '#0284c7'); eg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = eg;
      cx.beginPath();
      cx.moveTo(boss.w * 0.34, -boss.h * 0.32);
      cx.lineTo(boss.w * 0.58 + Math.random() * 12, 0);
      cx.lineTo(boss.w * 0.34, boss.h * 0.32);
      cx.closePath(); cx.fill();

      // Main Circular Saucer Hull in Light Industrial Plating
      const fg = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      fg.addColorStop(0, '#0f172a'); fg.addColorStop(0.35, '#334155'); fg.addColorStop(0.7, '#64748b'); fg.addColorStop(1, '#f8fafc');
      cx.fillStyle = fg;
      cx.beginPath();
      cx.ellipse(0, 0, boss.w * 0.44, boss.h * 0.42, 0, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 3.6; cx.stroke();

      // Forward Cargo Docking Mandibles with Central Freight Notch
      cx.fillStyle = '#1e293b';
      cx.fillRect(-boss.w * 0.48, -boss.h * 0.32, boss.w * 0.36, boss.h * 0.18);
      cx.fillRect(-boss.w * 0.48, boss.h * 0.14, boss.w * 0.36, boss.h * 0.18);
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 2.4;
      cx.strokeRect(-boss.w * 0.48, -boss.h * 0.32, boss.w * 0.36, boss.h * 0.18);
      cx.strokeRect(-boss.w * 0.48, boss.h * 0.14, boss.w * 0.36, boss.h * 0.18);

      // Red Hazard Racing Stripes on Mandibles
      cx.fillStyle = '#ef4444';
      cx.fillRect(-boss.w * 0.44, -boss.h * 0.25, boss.w * 0.26, 4);
      cx.fillRect(-boss.w * 0.44, boss.h * 0.21, boss.w * 0.26, 4);

      // Offset Starboard Cockpit Corridor Tube
      cx.fillStyle = '#334155';
      cx.fillRect(-boss.w * 0.18, -boss.h * 0.46, boss.w * 0.32, boss.h * 0.14);
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 2;
      cx.strokeRect(-boss.w * 0.18, -boss.h * 0.46, boss.w * 0.32, boss.h * 0.14);

      // Conical Starboard Cockpit Pod with Illuminated Viewport Grid
      cx.fillStyle = '#0f172a';
      cx.beginPath();
      cx.moveTo(-boss.w * 0.18, -boss.h * 0.48);
      cx.lineTo(-boss.w * 0.34, -boss.h * 0.44);
      cx.lineTo(-boss.w * 0.34, -boss.h * 0.36);
      cx.lineTo(-boss.w * 0.18, -boss.h * 0.32);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#00ffee'; cx.lineWidth = 1.8; cx.stroke();
      cx.fillStyle = '#00ffee'; cx.beginPath(); cx.arc(-boss.w * 0.26, -boss.h * 0.40, 4, 0, Math.PI * 2); cx.fill();

      // Top Center Rotating Dorsal Quad-Laser Blaster Turret
      const aimAng = Math.atan2(ship.y - boss.y, ship.x - boss.x);
      cx.save(); cx.translate(0, 0); cx.rotate(aimAng);
      cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(0, 0, 16, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 2.4; cx.stroke();
      cx.fillStyle = '#475569'; cx.beginPath(); cx.arc(0, 0, 8, 0, Math.PI * 2); cx.fill();
      // Quad Blaster Barrels
      cx.fillStyle = '#ff0033';
      cx.fillRect(4, -6, 26, 3.5);
      cx.fillRect(4, -2, 28, 4);
      cx.fillRect(4, 2.5, 26, 3.5);
      cx.restore();

      // Military Sensor Radar Dish with Scanning Beam
      cx.fillStyle = '#475569';
      cx.beginPath(); cx.arc(-boss.w * 0.14, -boss.h * 0.18, 10, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 1.8; cx.stroke();
      cx.strokeStyle = '#00ffee'; cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(-boss.w * 0.14, -boss.h * 0.18);
      cx.lineTo(-boss.w * 0.14 + Math.cos(t * 8) * 16, -boss.h * 0.18 + Math.sin(t * 8) * 16);
      cx.stroke();

      // 4 Aft Circular Heat Exhaust Grille Ports
      for (const pos of [
        { x: boss.w * 0.14, y: -boss.h * 0.16 },
        { x: boss.w * 0.26, y: -boss.h * 0.12 },
        { x: boss.w * 0.14, y: boss.h * 0.16 },
        { x: boss.w * 0.26, y: boss.h * 0.12 }
      ]) {
        cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(pos.x, pos.y, 6.5, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#64748b'; cx.lineWidth = 1.4; cx.stroke();
        cx.fillStyle = '#ff4400'; cx.beginPath(); cx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2); cx.fill();
      }

    } else if (boss.type === 'cryo') {
      // BOSS 5: ADMIRAL SLOANE: IMPERIAL CANTWELL-CLASS ARRESTOR BATTLECRUISER (4 SWEPT OUTRIGGERS)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.58);
      bg.addColorStop(0, 'rgba(0, 255, 170, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.arc(0, 0, boss.w * 0.54, 0, Math.PI * 2); cx.fill();

      // 4 MASSIVE SWEPT OUTRIGGER STABILIZER WINGS / RADIATOR PYLONS (From User Reference Photo)
      const outriggers = [
        { sx: -boss.w * 0.15, sy: -boss.h * 0.22, tx: -boss.w * 0.42, ty: -boss.h * 0.48, col: '#00ffaa' }, // Upper-Forward Port
        { sx: -boss.w * 0.15, sy: boss.h * 0.22, tx: -boss.w * 0.42, ty: boss.h * 0.48, col: '#00ffaa' },  // Lower-Forward Starboard
        { sx: boss.w * 0.18, sy: -boss.h * 0.22, tx: boss.w * 0.46, ty: -boss.h * 0.46, col: '#ff0033' },   // Upper-Aft Port
        { sx: boss.w * 0.18, sy: boss.h * 0.22, tx: boss.w * 0.46, ty: boss.h * 0.46, col: '#ff0033' }     // Lower-Aft Starboard
      ];

      for (const out of outriggers) {
        cx.fillStyle = '#0f172a';
        cx.beginPath();
        cx.moveTo(out.sx, out.sy);
        cx.lineTo(out.tx, out.ty);
        cx.lineTo(out.tx + 18, out.ty + (out.ty < 0 ? 8 : -8));
        cx.lineTo(out.sx + 24, out.sy);
        cx.closePath(); cx.fill();
        cx.strokeStyle = out.col; cx.lineWidth = 2.4; cx.stroke();

        // Glowing Laser Emitter Tip
        cx.fillStyle = out.col;
        cx.beginPath(); cx.arc(out.tx, out.ty, 4.5 + Math.sin(t * 14) * 1.5, 0, Math.PI * 2); cx.fill();
      }

      // Heavy Diamond-Faceted Arrowhead Cruiser Hull
      const cg = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      cg.addColorStop(0, '#0f172a'); cg.addColorStop(0.35, '#1e293b'); cg.addColorStop(0.7, '#475569'); cg.addColorStop(1, '#cbd5e1');
      cx.fillStyle = cg;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.50, 0);                 // Forward prow apex
      cx.lineTo(-boss.w * 0.10, -boss.h * 0.38);    // Forward port slope
      cx.lineTo(boss.w * 0.38, -boss.h * 0.36);     // Port aft wing
      cx.lineTo(boss.w * 0.48, -boss.h * 0.18);     // Port engine
      cx.lineTo(boss.w * 0.40, 0);                  // Aft spine
      cx.lineTo(boss.w * 0.48, boss.h * 0.18);      // Starboard engine
      cx.lineTo(boss.w * 0.38, boss.h * 0.36);      // Starboard aft wing
      cx.lineTo(-boss.w * 0.10, boss.h * 0.38);     // Forward starboard slope
      cx.closePath();
      cx.fill();
      cx.strokeStyle = '#00ffaa'; cx.lineWidth = 3.6; cx.stroke();

      // Elevated Command Bridge Superstructure Tower
      cx.fillStyle = '#1e293b';
      cx.beginPath();
      cx.moveTo(boss.w * 0.05, -boss.h * 0.18);
      cx.lineTo(boss.w * 0.28, -boss.h * 0.16);
      cx.lineTo(boss.w * 0.28, boss.h * 0.16);
      cx.lineTo(boss.w * 0.05, boss.h * 0.18);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 1.8; cx.stroke();

      // Glowing Emerald Command Bridge Viewport Slits
      cx.fillStyle = '#00ffaa';
      cx.fillRect(boss.w * 0.10, -boss.h * 0.08, boss.w * 0.12, 4);
      cx.fillRect(boss.w * 0.10, boss.h * 0.05, boss.w * 0.12, 4);

      // Accompanying TIE Interceptor Escort Formation
      for (const ty of [-boss.h * 0.42, boss.h * 0.42]) {
        cx.save(); cx.translate(-boss.w * 0.25, ty);
        cx.strokeStyle = '#64748b'; cx.lineWidth = 2;
        cx.beginPath(); cx.moveTo(-8, -10); cx.lineTo(-8, 10); cx.moveTo(8, -10); cx.lineTo(8, 10); cx.stroke();
        cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(0, 0, 4, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#ff0033'; cx.beginPath(); cx.arc(0, 0, 1.8, 0, Math.PI * 2); cx.fill();
        cx.restore();
      }

      // Active Outrigger Deflector Shield Barrier (Absorbs Hits)
      const shardsCount = boss.iceShards !== undefined ? boss.iceShards : 4;
      for (let k = 0; k < shardsCount; k++) {
        const a = (k / 4) * Math.PI * 2 + boss.spinRing * 0.4;
        const px = Math.cos(a) * (boss.w * 0.38), py = Math.sin(a) * (boss.h * 0.38);
        cx.fillStyle = 'rgba(0, 255, 170, 0.85)';
        cx.beginPath();
        cx.moveTo(px, py - 12); cx.lineTo(px + 10, py); cx.lineTo(px, py + 12); cx.lineTo(px - 10, py);
        cx.closePath(); cx.fill();
        cx.strokeStyle = '#ffffff'; cx.lineWidth = 2; cx.stroke();
      }

    } else if (boss.type === 'fondor') {
      // BOSS 6: LUTHEN RAEL: THE FONDOR HAULCRAFT (ARMED CUSTOM CRUISER)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.58);
      bg.addColorStop(0, 'rgba(56, 189, 248, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.arc(0, 0, boss.w * 0.54, 0, Math.PI * 2); cx.fill();

      // Swept Back Armored Wings (Upper & Lower)
      const wg = cx.createLinearGradient(0, -boss.h * 0.5, 0, boss.h * 0.5);
      wg.addColorStop(0, '#475569'); wg.addColorStop(0.5, '#1e293b'); wg.addColorStop(1, '#0f172a');
      cx.fillStyle = wg;
      // Upper Wing
      cx.beginPath();
      cx.moveTo(-boss.w * 0.12, -boss.h * 0.18);
      cx.lineTo(boss.w * 0.38, -boss.h * 0.48);
      cx.lineTo(boss.w * 0.48, -boss.h * 0.42);
      cx.lineTo(boss.w * 0.22, -boss.h * 0.12);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 1.8; cx.stroke();

      // Lower Wing
      cx.beginPath();
      cx.moveTo(-boss.w * 0.12, boss.h * 0.18);
      cx.lineTo(boss.w * 0.38, boss.h * 0.48);
      cx.lineTo(boss.w * 0.48, boss.h * 0.42);
      cx.lineTo(boss.w * 0.22, boss.h * 0.12);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 1.8; cx.stroke();

      // 4 Cylindrical Sublight Turbine Engine Nacelles with Animated Blue Thruster Flames
      const nacelles = [
        { x: boss.w * 0.18, y: -boss.h * 0.36, w: 72, h: 26, isRaised: true },
        { x: boss.w * 0.26, y: -boss.h * 0.14, w: 76, h: 28, isRaised: false },
        { x: boss.w * 0.26, y: boss.h * 0.14, w: 76, h: 28, isRaised: false },
        { x: boss.w * 0.18, y: boss.h * 0.36, w: 72, h: 26, isRaised: true }
      ];

      for (const n of nacelles) {
        // Thruster plume cone
        const flameLen = 45 + Math.sin(t * 30 + n.y) * 12;
        const fGrad = cx.createRadialGradient(n.x + n.w * 0.5, n.y, 2, n.x + n.w * 0.5 + flameLen, n.y, n.h * 0.6);
        fGrad.addColorStop(0, '#ffffff');
        fGrad.addColorStop(0.3, '#00ffee');
        fGrad.addColorStop(0.7, '#0284c7');
        fGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        cx.fillStyle = fGrad;
        cx.beginPath();
        cx.moveTo(n.x + n.w * 0.5, n.y - n.h * 0.4);
        cx.lineTo(n.x + n.w * 0.5 + flameLen, n.y);
        cx.lineTo(n.x + n.w * 0.5, n.y + n.h * 0.4);
        cx.closePath(); cx.fill();

        // Nacelle body cylinder
        const nGrad = cx.createLinearGradient(n.x - n.w * 0.5, n.y - n.h * 0.5, n.x - n.w * 0.5, n.y + n.h * 0.5);
        nGrad.addColorStop(0, '#64748b');
        nGrad.addColorStop(0.4, '#1e293b');
        nGrad.addColorStop(0.8, '#0f172a');
        nGrad.addColorStop(1, '#020617');
        cx.fillStyle = nGrad;
        cx.beginPath();
        cx.roundRect(n.x - n.w * 0.5, n.y - n.h * 0.5, n.w, n.h, 6);
        cx.fill();
        cx.strokeStyle = '#38bdf8'; cx.lineWidth = 1.6; cx.stroke();

        // Forward circular intake lip ring
        cx.fillStyle = '#0f172a';
        cx.beginPath();
        cx.ellipse(n.x - n.w * 0.5, n.y, 4, n.h * 0.45, 0, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = '#cbd5e1'; cx.lineWidth = 1.4; cx.stroke();
      }

      // Main Brushed Titanium Wedge Hull Fuselage
      const hGrad = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      hGrad.addColorStop(0, '#0f172a');
      hGrad.addColorStop(0.25, '#1e293b');
      hGrad.addColorStop(0.65, '#475569');
      hGrad.addColorStop(0.90, '#94a3b8');
      hGrad.addColorStop(1, '#cbd5e1');
      cx.fillStyle = hGrad;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.50, 0);                 // Forward prow tip
      cx.lineTo(-boss.w * 0.32, -boss.h * 0.28);    // Forward port bevel
      cx.lineTo(boss.w * 0.25, -boss.h * 0.26);     // Mid port flank
      cx.lineTo(boss.w * 0.42, -boss.h * 0.16);     // Aft port engine shoulder
      cx.lineTo(boss.w * 0.36, 0);                  // Aft center spine
      cx.lineTo(boss.w * 0.42, boss.h * 0.16);      // Aft starboard engine shoulder
      cx.lineTo(boss.w * 0.25, boss.h * 0.26);      // Mid starboard flank
      cx.lineTo(-boss.w * 0.32, boss.h * 0.28);     // Forward starboard bevel
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#38bdf8'; cx.lineWidth = 3.2; cx.stroke();

      // Forward Recessed Cargo Bay / Tractor Beam Grille (Dark with Cyan Emitting Slats)
      cx.fillStyle = '#020617';
      cx.beginPath();
      cx.moveTo(-boss.w * 0.48, 0);
      cx.lineTo(-boss.w * 0.36, -boss.h * 0.14);
      cx.lineTo(-boss.w * 0.28, -boss.h * 0.14);
      cx.lineTo(-boss.w * 0.28, boss.h * 0.14);
      cx.lineTo(-boss.w * 0.36, boss.h * 0.14);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#00ffee'; cx.lineWidth = 1.4; cx.stroke();

      for (let s = -boss.w * 0.44; s <= -boss.w * 0.30; s += 7) {
        cx.strokeStyle = '#00ffee'; cx.lineWidth = 1.2;
        cx.beginPath(); cx.moveTo(s, -boss.h * 0.10); cx.lineTo(s, boss.h * 0.10); cx.stroke();
      }

      // Recessed Mechanical Dorsal Greeble Machinery Trench
      cx.fillStyle = '#090d16';
      cx.beginPath();
      cx.roundRect(-boss.w * 0.10, -boss.h * 0.14, boss.w * 0.32, boss.h * 0.28, 4);
      cx.fill();
      cx.strokeStyle = '#64748b'; cx.lineWidth = 1.4; cx.stroke();

      // Greeble conduit piping
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.2;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.06, -boss.h * 0.08); cx.lineTo(boss.w * 0.18, -boss.h * 0.08);
      cx.moveTo(-boss.w * 0.06, boss.h * 0.08); cx.lineTo(boss.w * 0.18, boss.h * 0.08);
      cx.stroke();

      // Swivel Turret Dome & Dual Heavy Turbolaser Cannons
      cx.fillStyle = '#1e293b';
      cx.beginPath(); cx.arc(-boss.w * 0.16, 0, 12, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#38bdf8'; cx.lineWidth = 2; cx.stroke();
      cx.fillStyle = '#00ffee';
      cx.beginPath(); cx.arc(-boss.w * 0.16, 0, 5, 0, Math.PI * 2); cx.fill();
      // Turret Barrels aimed towards player ship
      const tAng = Math.atan2(ship.y - boss.y, ship.x - boss.x);
      cx.save();
      cx.translate(-boss.w * 0.16, 0);
      cx.rotate(tAng);
      cx.fillStyle = '#64748b';
      cx.fillRect(0, -4, 22, 3);
      cx.fillRect(0, 1, 22, 3);
      cx.fillStyle = '#00ffee';
      cx.fillRect(20, -4, 4, 3);
      cx.fillRect(20, 1, 4, 3);
      cx.restore();

      // Lateral Ball Turrets (Port & Starboard)
      for (const by of [-boss.h * 0.22, boss.h * 0.22]) {
        cx.fillStyle = '#0f172a';
        cx.beginPath(); cx.arc(0, by, 7.5, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.5; cx.stroke();
        cx.fillStyle = '#ffd23c';
        cx.beginPath(); cx.arc(0, by, 3, 0, Math.PI * 2); cx.fill();
      }

      // ACTIVE ULTIMATE: Colossal Twin Lateral Plasma Scythes FX!
      if (boss.scytheActive && boss.scytheActive > 0) {
        for (const sDir of [-1, 1]) {
          const topY = (sDir === -1 ? -420 : 20);
          const botY = (sDir === -1 ? -20 : 420);

          // Outer diffuse cyan glow
          cx.strokeStyle = 'rgba(0, 255, 238, 0.45)';
          cx.lineWidth = 36 + Math.sin(t * 30) * 8;
          cx.lineCap = 'round';
          cx.beginPath(); cx.moveTo(0, topY); cx.lineTo(0, botY); cx.stroke();

          // Mid laser blade
          cx.strokeStyle = '#00ffee';
          cx.lineWidth = 18 + Math.cos(t * 35) * 4;
          cx.beginPath(); cx.moveTo(0, topY); cx.lineTo(0, botY); cx.stroke();

          // White-hot core
          cx.strokeStyle = '#ffffff';
          cx.lineWidth = 6;
          cx.beginPath(); cx.moveTo(0, topY); cx.lineTo(0, botY); cx.stroke();

          // Crackling electric arcs along the blade
          cx.strokeStyle = '#ffd23c';
          cx.lineWidth = 3;
          cx.beginPath();
          for (let y = topY; y <= botY; y += 40) {
            const sx = Math.sin(y * 0.1 + t * 25) * 14;
            if (y === topY) cx.moveTo(sx, y);
            else cx.lineTo(sx, y);
          }
          cx.stroke();
        }
      }

    } else if (boss.type === 'ataraxia') {
      // BOSS 8: MASTER AVAR KRISS: JEDI STARCRUISER ATARAXIA (HIGH REPUBLIC JEDI CRUISER)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.65);
      bg.addColorStop(0, 'rgba(224, 231, 255, 0.35)');
      bg.addColorStop(0.6, 'rgba(56, 189, 248, 0.20)');
      bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.62, boss.h * 0.58, 0, 0, Math.PI * 2); cx.fill();

      // Radiant Force Pulse expanding shockwave aura
      if (boss.forcePulseT && boss.forcePulseT > 0) {
        const pulseR = boss.forcePulseRadius || 30;
        cx.save();
        cx.strokeStyle = 'rgba(255, 210, 60, 0.7)';
        cx.lineWidth = 14;
        cx.beginPath(); cx.arc(0, 0, pulseR, 0, Math.PI * 2); cx.stroke();

        cx.strokeStyle = 'rgba(0, 255, 238, 0.9)';
        cx.lineWidth = 6;
        cx.beginPath(); cx.arc(0, 0, pulseR, 0, Math.PI * 2); cx.stroke();
        cx.restore();
      }

      // 1. Stepped Outrigger Wing Sponsons with Crimson Racing Trim
      for (const wDir of [-1, 1]) {
        const wy1 = wDir * (boss.h * 0.18);
        const wy2 = wDir * (boss.h * 0.48);
        const wy3 = wDir * (boss.h * 0.40);
        const wy4 = wDir * (boss.h * 0.22);

        const wingGrad = cx.createLinearGradient(0, wy1, 0, wy2);
        wingGrad.addColorStop(0, '#f8fafc');
        wingGrad.addColorStop(0.5, '#cbd5e1');
        wingGrad.addColorStop(1, '#64748b');
        cx.fillStyle = wingGrad;
        cx.beginPath();
        cx.moveTo(-boss.w * 0.12, wy1);
        cx.lineTo(boss.w * 0.28, wy2);
        cx.lineTo(boss.w * 0.42, wy3);
        cx.lineTo(boss.w * 0.16, wy4);
        cx.closePath(); cx.fill();
        cx.strokeStyle = '#e2e8f0'; cx.lineWidth = 2.0; cx.stroke();

        // High Republic Crimson Accent Strip along the wing outer edge
        cx.strokeStyle = '#dc2626'; cx.lineWidth = 4.0;
        cx.beginPath();
        cx.moveTo(-boss.w * 0.08, wy1 + wDir * 3);
        cx.lineTo(boss.w * 0.26, wy2 - wDir * 2);
        cx.stroke();
      }

      // 2. Twin Massive Cylindrical Turbine Engine Nacelles & Forward Longbeam Barrels
      const nacelles = [
        { y: -boss.h * 0.32, isPort: true },
        { y: boss.h * 0.32, isPort: false }
      ];

      for (const n of nacelles) {
        const nw = boss.w * 0.38, nh = boss.h * 0.22;
        const nx = boss.w * 0.12;

        // Kyber Ion Thruster Exhaust Plume
        const plumeLen = 50 + Math.sin(t * 26 + (n.isPort ? 0 : 2)) * 14;
        const pGrad = cx.createLinearGradient(nx + nw * 0.5, n.y, nx + nw * 0.5 + plumeLen, n.y);
        pGrad.addColorStop(0, '#ffffff');
        pGrad.addColorStop(0.25, '#00ffee');
        pGrad.addColorStop(0.7, '#0284c7');
        pGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        cx.fillStyle = pGrad;
        cx.beginPath();
        cx.moveTo(nx + nw * 0.5, n.y - nh * 0.35);
        cx.lineTo(nx + nw * 0.5 + plumeLen, n.y);
        cx.lineTo(nx + nw * 0.5, n.y + nh * 0.35);
        cx.closePath(); cx.fill();

        // Nacelle Cylindrical Body
        const nGrad = cx.createLinearGradient(0, n.y - nh * 0.5, 0, n.y + nh * 0.5);
        nGrad.addColorStop(0, '#ffffff');
        nGrad.addColorStop(0.3, '#cbd5e1');
        nGrad.addColorStop(0.7, '#64748b');
        nGrad.addColorStop(1, '#1e293b');
        cx.fillStyle = nGrad;
        cx.beginPath();
        cx.roundRect(nx - nw * 0.5, n.y - nh * 0.5, nw, nh, 8);
        cx.fill();
        cx.strokeStyle = '#e2e8f0'; cx.lineWidth = 2.2; cx.stroke();

        // Ribbed Engine Cooling Rings / Cowling Segment
        cx.fillStyle = '#1e293b';
        cx.fillRect(nx - nw * 0.15, n.y - nh * 0.52, nw * 0.30, nh * 1.04);
        cx.strokeStyle = '#dc2626'; cx.lineWidth = 2.5;
        cx.strokeRect(nx - nw * 0.15, n.y - nh * 0.52, nw * 0.30, nh * 1.04);

        // Forward Longbeam Heavy Turbolaser Cannon Barrel protruding forward
        const barrelLen = boss.w * 0.36;
        const bx = nx - nw * 0.5 - barrelLen;
        cx.fillStyle = '#64748b';
        cx.fillRect(bx, n.y - 4, barrelLen, 8);
        cx.strokeStyle = '#0f172a'; cx.lineWidth = 1.4;
        cx.strokeRect(bx, n.y - 4, barrelLen, 8);

        // Longbeam Cannon Muzzle & Glowing Kyber Emitter
        cx.fillStyle = '#00ffee';
        cx.beginPath(); cx.arc(bx, n.y, 5, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#ffffff'; cx.lineWidth = 1.5; cx.stroke();

        // Kyber Lance Firing FX from barrels
        if (boss.lanceActive && boss.lanceActive > 0) {
          // Colossal continuous cyan beam forward across screen
          cx.save();
          // Outer beam glow
          cx.strokeStyle = 'rgba(0, 255, 238, 0.4)';
          cx.lineWidth = 28 + Math.sin(t * 30) * 6;
          cx.beginPath(); cx.moveTo(bx, n.y); cx.lineTo(bx - 1200, n.y); cx.stroke();

          // Mid cyan beam
          cx.strokeStyle = '#00ffee';
          cx.lineWidth = 14 + Math.cos(t * 35) * 3;
          cx.beginPath(); cx.moveTo(bx, n.y); cx.lineTo(bx - 1200, n.y); cx.stroke();

          // White-hot core
          cx.strokeStyle = '#ffffff';
          cx.lineWidth = 5;
          cx.beginPath(); cx.moveTo(bx, n.y); cx.lineTo(bx - 1200, n.y); cx.stroke();

          // Electric crackle arcs
          cx.strokeStyle = '#ffd23c';
          cx.lineWidth = 2.5;
          cx.beginPath();
          for (let lx = bx; lx >= bx - 1200; lx -= 50) {
            const ly = n.y + Math.sin(lx * 0.08 + t * 30) * 10;
            if (lx === bx) cx.moveTo(lx, ly);
            else cx.lineTo(lx, ly);
          }
          cx.stroke();
          cx.restore();
        }
      }

      // 3. Main Pristine High Republic Pearl-White Cruiser Hull
      const hGrad = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      hGrad.addColorStop(0, '#334155');
      hGrad.addColorStop(0.2, '#64748b');
      hGrad.addColorStop(0.55, '#cbd5e1');
      hGrad.addColorStop(0.85, '#f8fafc');
      hGrad.addColorStop(1, '#ffffff');
      cx.fillStyle = hGrad;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.48, 0);                 // Aerodynamic forward prow tip
      cx.lineTo(-boss.w * 0.18, -boss.h * 0.24);    // Port forward shoulder
      cx.lineTo(boss.w * 0.36, -boss.h * 0.22);     // Port aft flank
      cx.lineTo(boss.w * 0.46, 0);                  // Aft central spine
      cx.lineTo(boss.w * 0.36, boss.h * 0.22);      // Starboard aft flank
      cx.lineTo(-boss.w * 0.18, boss.h * 0.24);     // Starboard forward shoulder
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 3.0; cx.stroke();

      // 4. Central Crimson & Gold High Republic Royal Racing Stripes
      cx.fillStyle = '#dc2626';
      cx.beginPath();
      cx.moveTo(-boss.w * 0.42, 0);
      cx.lineTo(-boss.w * 0.16, -boss.h * 0.14);
      cx.lineTo(boss.w * 0.32, -boss.h * 0.12);
      cx.lineTo(boss.w * 0.32, -boss.h * 0.07);
      cx.lineTo(-boss.w * 0.14, -boss.h * 0.08);
      cx.lineTo(-boss.w * 0.32, 0);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.2; cx.stroke();

      cx.fillStyle = '#dc2626';
      cx.beginPath();
      cx.moveTo(-boss.w * 0.42, 0);
      cx.lineTo(-boss.w * 0.16, boss.h * 0.14);
      cx.lineTo(boss.w * 0.32, boss.h * 0.12);
      cx.lineTo(boss.w * 0.32, boss.h * 0.07);
      cx.lineTo(-boss.w * 0.14, boss.h * 0.08);
      cx.lineTo(-boss.w * 0.32, 0);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.2; cx.stroke();

      // Centerline Gold Stripe
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 2.0;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.30, 0);
      cx.lineTo(boss.w * 0.38, 0);
      cx.stroke();

      // 5. Elevated High Republic Command Bridge Superstructure
      const brGrad = cx.createLinearGradient(0, -boss.h * 0.10, 0, boss.h * 0.10);
      brGrad.addColorStop(0, '#ffffff');
      brGrad.addColorStop(0.5, '#94a3b8');
      brGrad.addColorStop(1, '#1e293b');
      cx.fillStyle = brGrad;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.12, 0);
      cx.lineTo(boss.w * 0.06, -boss.h * 0.10);
      cx.lineTo(boss.w * 0.18, -boss.h * 0.08);
      cx.lineTo(boss.w * 0.20, 0);
      cx.lineTo(boss.w * 0.18, boss.h * 0.08);
      cx.lineTo(boss.w * 0.06, boss.h * 0.10);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.8; cx.stroke();

      // Command Bridge Viewport Slit (Cyan Kyber Glow)
      cx.fillStyle = '#00ffee';
      cx.fillRect(-boss.w * 0.04, -4, 20, 8);
      cx.strokeStyle = '#ffffff'; cx.lineWidth = 1.0;
      cx.strokeRect(-boss.w * 0.04, -4, 20, 8);

    } else if (boss.type === 'pathogen') {
      // BOSS 9: OVERLORD PATHOGEN: THE IMPERIAL BIO-SPORE CARRIER (IDENTICAL CLONES & MUTATION ENGINE)
      
      const drawFullPathogenFrigate = (cx, fObj, t, isPrime, mutLevel, relAimAng) => {
        const fw = fObj.w || 280, fh = fObj.h || 145;
        const ang = relAimAng !== undefined ? relAimAng : Math.atan2(ship.y - (fObj.y || boss.y), ship.x - (fObj.x || boss.x));
        const auraAlpha = 0.35 + (mutLevel * 0.08);

        // 0. Toxic Mutagenic Spore Aura & Bio-Shield Wave
        const bg = cx.createRadialGradient(0, 0, 20, 0, 0, fw * 0.65);
        bg.addColorStop(0, `rgba(16, 185, 129, ${auraAlpha})`);
        bg.addColorStop(0.5, `rgba(5, 150, 105, ${auraAlpha * 0.5})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, fw * 0.62, fh * 0.58, 0, 0, Math.PI * 2); cx.fill();

        // Pulsating Bio-Membrane Ring
        cx.save();
        cx.strokeStyle = isPrime ? 'rgba(0, 255, 170, 0.8)' : 'rgba(52, 211, 153, 0.6)';
        cx.lineWidth = 3 + mutLevel * 0.6;
        cx.setLineDash([12, 8]);
        cx.lineDashOffset = -t * 22;
        cx.beginPath(); cx.ellipse(0, 0, fw * 0.56 + Math.sin(t * 8) * 6, fh * 0.52 + Math.cos(t * 8) * 6, 0, 0, Math.PI * 2); cx.stroke();
        cx.restore();

        // Mutation Electric Sparks
        if (mutLevel > 0 || isPrime) {
          cx.strokeStyle = isPrime ? '#00ffaa' : '#ffd23c';
          cx.lineWidth = 2;
          for (let sp = 0; sp < (isPrime ? 6 : mutLevel + 1); sp++) {
            const sAng = (sp / 6) * Math.PI * 2 + t * 14;
            const sx = Math.cos(sAng) * (fw * 0.45), sy = Math.sin(sAng) * (fh * 0.42);
            cx.beginPath(); cx.moveTo(sx, sy); cx.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20); cx.stroke();
          }
        }

        // 1. Heavy Outrigger Wing Sponsons & Pylons
        for (const wDir of [-1, 1]) {
          const wy1 = wDir * (fh * 0.16);
          const wy2 = wDir * (fh * 0.46);
          const wy3 = wDir * (fh * 0.38);
          const wy4 = wDir * (fh * 0.20);

          const wingGrad = cx.createLinearGradient(0, wy1, 0, wy2);
          wingGrad.addColorStop(0, '#064e3b');
          wingGrad.addColorStop(0.5, '#047857');
          wingGrad.addColorStop(1, '#022c22');
          cx.fillStyle = wingGrad;
          cx.beginPath();
          cx.moveTo(-fw * 0.15, wy1);
          cx.lineTo(fw * 0.22, wy2);
          cx.lineTo(fw * 0.38, wy3);
          cx.lineTo(fw * 0.12, wy4);
          cx.closePath(); cx.fill();
          cx.strokeStyle = '#10b981'; cx.lineWidth = 2.0; cx.stroke();

          // Bio-Luminescing Armor Trim
          cx.strokeStyle = isPrime ? '#00ffaa' : '#34d399'; cx.lineWidth = 3.0;
          cx.beginPath();
          cx.moveTo(-fw * 0.10, wy1 + wDir * 3);
          cx.lineTo(fw * 0.20, wy2 - wDir * 2);
          cx.stroke();
        }

        // 2. 4 Colossal Bio-Turbine Engine Nacelles
        const nacelles = [
          { x: fw * 0.08, y: -fh * 0.38, w: fw * 0.26, h: fh * 0.20 },
          { x: fw * 0.08, y: fh * 0.38, w: fw * 0.26, h: fh * 0.20 },
          { x: fw * 0.28, y: -fh * 0.20, w: fw * 0.29, h: fh * 0.22 },
          { x: fw * 0.28, y: fh * 0.20, w: fw * 0.29, h: fh * 0.22 }
        ];

        for (const n of nacelles) {
          // Toxic Emerald Jet Exhaust Plume
          const flameLen = (40 + mutLevel * 6) + Math.sin(t * 28 + n.y) * 14;
          const fGrad = cx.createLinearGradient(n.x + n.w * 0.5, n.y, n.x + n.w * 0.5 + flameLen, n.y);
          fGrad.addColorStop(0, '#ffffff');
          fGrad.addColorStop(0.2, '#84cc16');
          fGrad.addColorStop(0.6, '#10b981');
          fGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
          cx.fillStyle = fGrad;
          cx.beginPath();
          cx.moveTo(n.x + n.w * 0.5, n.y - n.h * 0.38);
          cx.lineTo(n.x + n.w * 0.5 + flameLen, n.y);
          cx.lineTo(n.x + n.w * 0.5, n.y + n.h * 0.38);
          cx.closePath(); cx.fill();

          // Nacelle Cylindrical Body
          const nGrad = cx.createLinearGradient(0, n.y - n.h * 0.5, 0, n.y + n.h * 0.5);
          nGrad.addColorStop(0, '#064e3b');
          nGrad.addColorStop(0.3, '#047857');
          nGrad.addColorStop(0.7, '#065f46');
          nGrad.addColorStop(1, '#022c22');
          cx.fillStyle = nGrad;
          cx.beginPath();
          cx.roundRect(n.x - n.w * 0.5, n.y - n.h * 0.5, n.w, n.h, 6);
          cx.fill();
          cx.strokeStyle = '#34d399'; cx.lineWidth = 1.8; cx.stroke();

          // Mutagenic Cooling Band
          cx.fillStyle = '#022c22';
          cx.fillRect(n.x - n.w * 0.15, n.y - n.h * 0.52, n.w * 0.30, n.h * 1.04);
          cx.strokeStyle = '#84cc16'; cx.lineWidth = 2.0;
          cx.strokeRect(n.x - n.w * 0.15, n.y - n.h * 0.52, n.w * 0.30, n.h * 1.04);

          // Forward Intake Cowling
          cx.fillStyle = '#022c22';
          cx.beginPath();
          cx.ellipse(n.x - n.w * 0.5, n.y, 4, n.h * 0.44, 0, 0, Math.PI * 2);
          cx.fill();
          cx.strokeStyle = '#10b981'; cx.lineWidth = 1.6; cx.stroke();

          // Glowing Core Turbine Center
          cx.fillStyle = '#00ffaa';
          cx.beginPath();
          cx.ellipse(n.x - n.w * 0.5, n.y, 2, n.h * 0.25, 0, 0, Math.PI * 2);
          cx.fill();
        }

        // 3. Main Armored Emerald Frigate Hull Fuselage
        const hGrad = cx.createLinearGradient(fw * 0.5, 0, -fw * 0.5, 0);
        hGrad.addColorStop(0, '#022c22');
        hGrad.addColorStop(0.25, '#064e3b');
        hGrad.addColorStop(0.60, '#047857');
        hGrad.addColorStop(0.85, '#059669');
        hGrad.addColorStop(1, '#10b981');
        cx.fillStyle = hGrad;
        cx.beginPath();
        cx.moveTo(-fw * 0.50, 0);                 // Forward prow tip
        cx.lineTo(-fw * 0.30, -fh * 0.28);    // Forward port bevel
        cx.lineTo(fw * 0.24, -fh * 0.26);     // Mid port flank
        cx.lineTo(fw * 0.44, -fh * 0.16);     // Aft port engine shoulder
        cx.lineTo(fw * 0.38, 0);                  // Aft center spine
        cx.lineTo(fw * 0.44, fh * 0.16);      // Aft starboard engine shoulder
        cx.lineTo(fw * 0.24, fh * 0.26);      // Mid starboard flank
        cx.lineTo(-fw * 0.30, fh * 0.28);     // Forward starboard bevel
        cx.closePath(); cx.fill();
        cx.strokeStyle = isPrime ? '#00ffaa' : '#34d399'; cx.lineWidth = 3.2; cx.stroke();

        // Armor Panel Seams & Reinforcement Ribs
        cx.strokeStyle = '#6ee7b7'; cx.lineWidth = 1.6;
        cx.beginPath();
        cx.moveTo(-fw * 0.28, -fh * 0.20); cx.lineTo(fw * 0.15, -fh * 0.18);
        cx.moveTo(-fw * 0.28, fh * 0.20); cx.lineTo(fw * 0.15, fh * 0.18);
        cx.stroke();

        // 4. Central Translucent Mutagenic Bio-Vial & Bubbling Spore Fluid
        cx.fillStyle = '#022c22';
        cx.beginPath();
        cx.roundRect(-fw * 0.12, -fh * 0.14, fw * 0.32, fh * 0.28, 6);
        cx.fill();
        cx.strokeStyle = '#10b981'; cx.lineWidth = 2.0; cx.stroke();

        // Glowing Green Liquid Canister
        const bioGrad = cx.createLinearGradient(0, -fh * 0.12, 0, fh * 0.12);
        bioGrad.addColorStop(0, 'rgba(52, 211, 153, 0.85)');
        bioGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.95)');
        bioGrad.addColorStop(1, 'rgba(4, 120, 87, 0.85)');
        cx.fillStyle = bioGrad;
        cx.beginPath();
        cx.roundRect(-fw * 0.10, -fh * 0.11, fw * 0.28, fh * 0.22, 4);
        cx.fill();

        // Animated Mutagen Bubbles
        cx.fillStyle = '#ffffff';
        for (let bIdx = 0; bIdx < 6; bIdx++) {
          const bubX = -fw * 0.08 + (bIdx * (fw * 0.24) / 5);
          const bubY = Math.sin(t * 6 + bIdx * 1.5) * (fh * 0.06);
          cx.beginPath(); cx.arc(bubX, bubY, 2.5 + Math.sin(t * 8 + bIdx) * 1.2, 0, Math.PI * 2); cx.fill();
        }

        // Spore Fluid Conduit Pipes to Engines & Cannons
        cx.strokeStyle = '#84cc16'; cx.lineWidth = 2.2;
        cx.beginPath();
        cx.moveTo(-fw * 0.10, 0); cx.lineTo(-fw * 0.36, 0);
        cx.moveTo(fw * 0.18, -fh * 0.06); cx.lineTo(fw * 0.32, -fh * 0.14);
        cx.moveTo(fw * 0.18, fh * 0.06); cx.lineTo(fw * 0.32, fh * 0.14);
        cx.stroke();

        // 5. Elevated Command Bridge & Toxic Visor
        const brGrad = cx.createLinearGradient(0, -fh * 0.10, 0, fh * 0.10);
        brGrad.addColorStop(0, '#047857');
        brGrad.addColorStop(0.5, '#065f46');
        brGrad.addColorStop(1, '#022c22');
        cx.fillStyle = brGrad;
        cx.beginPath();
        cx.moveTo(-fw * 0.18, 0);
        cx.lineTo(-fw * 0.02, -fh * 0.12);
        cx.lineTo(fw * 0.12, -fh * 0.09);
        cx.lineTo(fw * 0.14, 0);
        cx.lineTo(fw * 0.12, fh * 0.09);
        cx.lineTo(-fw * 0.02, fh * 0.12);
        cx.closePath(); cx.fill();
        cx.strokeStyle = '#34d399'; cx.lineWidth = 1.8; cx.stroke();

        // Command Bridge Viewport Slit (Luminescent Toxic Green)
        cx.fillStyle = isPrime ? '#00ffaa' : '#34d399';
        cx.fillRect(-fw * 0.12, -4, 22, 8);
        cx.fillStyle = '#ffffff';
        cx.fillRect(-fw * 0.10, -2.5, 18, 2.5);
        cx.strokeStyle = '#a7f3d0'; cx.lineWidth = 1.0;
        cx.strokeRect(-fw * 0.12, -4, 22, 8);

        // 6. Dual Heavy Chin-Mounted Blaster Turrets (Tracking player ship)
        cx.save();
        cx.translate(-fw * 0.42, 0);
        cx.rotate(ang * 0.5); // Smooth swivel tracking

        // Chin Turret Base Pod
        cx.fillStyle = '#022c22';
        cx.beginPath(); cx.arc(0, 0, 9, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#10b981'; cx.lineWidth = 1.6; cx.stroke();

        // Dual Heavy Cannon Barrels
        for (const cy of [-5, 5]) {
          cx.fillStyle = '#064e3b';
          cx.fillRect(-22, cy - 2.5, 22, 5);
          cx.strokeStyle = '#34d399'; cx.lineWidth = 1.2;
          cx.strokeRect(-22, cy - 2.5, 22, 5);

          // Glowing Muzzle Tip
          cx.fillStyle = '#84cc16';
          cx.fillRect(-26, cy - 2, 4, 4);
        }
        cx.restore();

        // Forward Spore Catapult Tube Blister
        cx.fillStyle = '#022c22';
        cx.beginPath(); cx.arc(-fw * 0.46, 0, 7, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#00ffaa'; cx.lineWidth = 1.8; cx.stroke();
        cx.fillStyle = '#10b981';
        cx.beginPath(); cx.arc(-fw * 0.46, 0, 3.5, 0, Math.PI * 2); cx.fill();

        // Overhead Health Bar
        const barW = fw * 0.75;
        const barY = -fh * 0.5 - 18;
        const hpRatio = Math.max(0, fObj.hp / fObj.maxhp);

        cx.font = 'bold 10px "Space Grotesk", sans-serif';
        cx.textAlign = 'center';
        cx.fillStyle = isPrime ? '#00ffaa' : '#34d399';
        cx.fillText(isPrime ? `👑 ORIGINAL ALPHA PRIME [MUTANT TIER 5] [${Math.ceil(fObj.hp)}/${fObj.maxhp} HP]` : `BIO-CLONE REPLICA #${fObj.id} [MUTANT TIER ${mutLevel}] [${Math.ceil(fObj.hp)}/${fObj.maxhp} HP]`, 0, barY - 4);

        cx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        cx.fillRect(-barW * 0.5, barY, barW, 6);
        cx.fillStyle = isPrime ? '#00ffaa' : hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#eab308' : '#ef4444';
        cx.fillRect(-barW * 0.5, barY, barW * hpRatio, 6);
        cx.strokeStyle = '#064e3b'; cx.lineWidth = 1.0;
        cx.strokeRect(-barW * 0.5, barY, barW, 6);
      };

      // If in Clones Phase, draw all 5 identical full-sized clones!
      if (!boss.isOriginalActive && boss.clones && boss.clones.length > 0) {
        for (const c of boss.clones) {
          cx.save();
          cx.translate(c.x - boss.x, c.y - boss.y);
          drawFullPathogenFrigate(cx, c, t, false, boss.mutationLevel, c.aimAng);
          cx.restore();
        }
      } else if (boss.isOriginalActive) {
        // Draw the Original Alpha Prime Overlord Pathogen
        drawFullPathogenFrigate(cx, boss, t, true, boss.mutationLevel);
      }

    } else {
      // BOSS 7: GENERAL VEERS: IMPERIAL AT-AT SIEGE COLOSSUS (ALL TERRAIN ARMORED TRANSPORT)
      const bg = cx.createRadialGradient(0, 0, 30, 0, 0, boss.w * 0.60);
      bg.addColorStop(0, 'rgba(239, 68, 68, 0.45)'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = bg; cx.beginPath(); cx.ellipse(0, 0, boss.w * 0.58, boss.h * 0.54, 0, 0, Math.PI * 2); cx.fill();

      // Animated Mechanical Stomping Cycle for 4 Giant Hydraulic Walker Legs
      const stompPhase = t * 6;
      const legs = [
        { bx: boss.w * 0.28, phaseOff: 0, isFront: false, isPort: false },
        { bx: boss.w * 0.18, phaseOff: Math.PI, isFront: false, isPort: true },
        { bx: -boss.w * 0.12, phaseOff: Math.PI * 0.5, isFront: true, isPort: false },
        { bx: -boss.w * 0.24, phaseOff: Math.PI * 1.5, isFront: true, isPort: true }
      ];

      for (const leg of legs) {
        const footLift = Math.max(0, Math.sin(stompPhase + leg.phaseOff)) * 14;
        const kneeBend = Math.sin(stompPhase + leg.phaseOff) * 8;
        const hipY = -boss.h * 0.05;
        const kneeX = leg.bx + kneeBend;
        const kneeY = boss.h * 0.24 - footLift * 0.5;
        const footX = leg.bx + (leg.isFront ? -6 : 6);
        const footY = boss.h * 0.48 - footLift;

        // Upper Thigh Strut
        cx.strokeStyle = leg.isPort ? '#334155' : '#1e293b';
        cx.lineWidth = leg.isPort ? 9 : 11;
        cx.beginPath(); cx.moveTo(leg.bx, hipY); cx.lineTo(kneeX, kneeY); cx.stroke();

        // Knee Drive Gear Joint
        cx.fillStyle = '#0f172a';
        cx.beginPath(); cx.arc(kneeX, kneeY, leg.isPort ? 6 : 7.5, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = '#ef4444'; cx.lineWidth = 1.6; cx.stroke();

        // Lower Calf Strut & Hydraulic Piston
        cx.strokeStyle = leg.isPort ? '#475569' : '#334155';
        cx.lineWidth = leg.isPort ? 7 : 9;
        cx.beginPath(); cx.moveTo(kneeX, kneeY); cx.lineTo(footX, footY); cx.stroke();

        // Heavy Round Armored Footpad with Terrain Grips
        cx.fillStyle = '#0f172a';
        cx.beginPath(); cx.roundRect(footX - 16, footY, 32, 10, 3); cx.fill();
        cx.strokeStyle = '#94a3b8'; cx.lineWidth = 2; cx.strokeRect(footX - 16, footY, 32, 10);
      }

      // Main Heavy Armored Troop Transport Chassis Hull
      const tg = cx.createLinearGradient(boss.w * 0.5, 0, -boss.w * 0.5, 0);
      tg.addColorStop(0, '#0f172a'); tg.addColorStop(0.35, '#334155'); tg.addColorStop(0.7, '#64748b'); tg.addColorStop(1, '#cbd5e1');
      cx.fillStyle = tg;
      cx.beginPath();
      cx.moveTo(-boss.w * 0.32, -boss.h * 0.36); // Forward upper slope
      cx.lineTo(boss.w * 0.44, -boss.h * 0.38);  // Aft upper spine
      cx.lineTo(boss.w * 0.48, -boss.h * 0.15);  // Aft engine notch
      cx.lineTo(boss.w * 0.42, boss.h * 0.12);   // Aft lower slope
      cx.lineTo(-boss.w * 0.28, boss.h * 0.14);  // Forward belly
      cx.lineTo(-boss.w * 0.36, -boss.h * 0.12); // Forward neck mount
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ef4444'; cx.lineWidth = 3.8; cx.stroke();

      // Side Armor Blast Hatches & Vent Grilles
      cx.fillStyle = '#1e293b';
      cx.fillRect(-boss.w * 0.18, -boss.h * 0.26, boss.w * 0.26, boss.h * 0.28);
      cx.fillRect(boss.w * 0.14, -boss.h * 0.26, boss.w * 0.26, boss.h * 0.28);
      cx.strokeStyle = '#94a3b8'; cx.lineWidth = 1.8;
      cx.strokeRect(-boss.w * 0.18, -boss.h * 0.26, boss.w * 0.26, boss.h * 0.28);
      cx.strokeRect(boss.w * 0.14, -boss.h * 0.26, boss.w * 0.26, boss.h * 0.28);

      // Imperial Thermal Reactor Vent Grilles (Orange Glow)
      for (const vy of [-boss.h * 0.20, -boss.h * 0.12, -boss.h * 0.04]) {
        cx.fillStyle = '#ff4400';
        cx.fillRect(boss.w * 0.18, vy, boss.w * 0.18, 4);
      }

      // Flexible Hydraulic Neck Collar Joint
      cx.fillStyle = '#0f172a';
      cx.beginPath(); cx.roundRect(-boss.w * 0.42, -boss.h * 0.22, boss.w * 0.12, boss.h * 0.26, 4); cx.fill();
      cx.strokeStyle = '#ef4444'; cx.lineWidth = 2.2; cx.stroke();

      // Armored Cockpit Command Head
      const aimAng = Math.atan2(ship.y - boss.y, ship.x - boss.x);
      cx.save();
      cx.translate(-boss.w * 0.40, -boss.h * 0.12);
      cx.rotate(aimAng * 0.4); // Head smoothly swivels to track player!

      const hg = cx.createLinearGradient(16, 0, -32, 0);
      hg.addColorStop(0, '#334155'); hg.addColorStop(0.5, '#64748b'); hg.addColorStop(1, '#e2e8f0');
      cx.fillStyle = hg;
      cx.beginPath();
      cx.moveTo(-34, -18);
      cx.lineTo(12, -18);
      cx.lineTo(16, 16);
      cx.lineTo(-28, 20);
      cx.lineTo(-38, 4);
      cx.closePath(); cx.fill();
      cx.strokeStyle = '#ef4444'; cx.lineWidth = 2.4; cx.stroke();

      // Command Viewport Horizontal Slit Visor (Glowing Red Imperial Visor)
      cx.fillStyle = '#ff0033';
      cx.fillRect(-34, -8, 28, 5);
      cx.fillStyle = '#ffffff'; cx.fillRect(-32, -6.5, 24, 2);

      // DUAL HEAVY CHIN-MOUNTED MS-1 TURBOLASER CANNONS
      for (const cy of [12, 22]) {
        cx.fillStyle = '#0f172a'; cx.fillRect(-44, cy - 3, 26, 6);
        cx.strokeStyle = '#ef4444'; cx.lineWidth = 1.4; cx.strokeRect(-44, cy - 3, 26, 6);
        cx.fillStyle = '#ff0033'; cx.fillRect(-52, cy - 2, 8, 4);
      }

      // Temple Repeating Blaster Pod
      cx.fillStyle = '#0f172a'; cx.beginPath(); cx.arc(-8, -18, 6, 0, Math.PI * 2); cx.fill();
      cx.strokeStyle = '#ffd23c'; cx.lineWidth = 1.4; cx.stroke();
      cx.fillStyle = '#ffd23c'; cx.fillRect(-22, -20, 14, 4);

      cx.restore();

      // Rear Heavy Exhaust Thruster Bell
      cx.fillStyle = '#ff4400';
      cx.beginPath(); cx.arc(boss.w * 0.48, -boss.h * 0.10, 9 + Math.sin(t * 18) * 2, 0, Math.PI * 2); cx.fill();
    }

    // Boss Giant Health Bar & Glowing Title Badge
    cx.globalAlpha = 1.0;
    const barW = boss.w * 0.85;
    const barY = -boss.h * 0.5 - 28;
    
    // Boss Title
    cx.font = 'bold 12px "Cinzel", "Space Grotesk", sans-serif';
    cx.textAlign = 'center';
    cx.fillStyle = boss.enraged ? '#ff3344' : (boss.col || '#00ffaa');
    cx.shadowColor = boss.col || '#00ffaa';
    cx.shadowBlur = 8;
    cx.fillText(`${boss.name.toUpperCase()} ${boss.enraged ? '⚡ [OVERLOAD ENRAGED]' : ''} [${Math.ceil(boss.hp)}/${boss.maxhp} HP]`, 0, barY - 8);
    cx.shadowBlur = 0;

    // Health Bar Frame
    cx.fillStyle = 'rgba(2, 6, 23, 0.9)'; cx.fillRect(-barW * 0.5, barY, barW, 12);
    const hpGrad = cx.createLinearGradient(-barW * 0.5, 0, barW * 0.5, 0);
    hpGrad.addColorStop(0, boss.enraged ? '#ff0033' : '#00e5ff');
    hpGrad.addColorStop(1, boss.enraged ? '#ff7700' : (boss.col || '#00ffaa'));
    cx.fillStyle = hpGrad;
    cx.fillRect(-barW * 0.5 + 2, barY + 2, (barW - 4) * Math.max(0, boss.hp / boss.maxhp), 8);
    cx.strokeStyle = boss.enraged ? '#ff3344' : '#ffffff'; cx.lineWidth = 1.8;
    cx.strokeRect(-barW * 0.5, barY, barW, 12);

    cx.restore();
  }

  