"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ===== TYPES =====
type GState = "title" | "playing" | "gameover";
interface Bomb { x: number; y: number; vx: number; vy: number }
interface Enemy { x: number; y: number; type: string; hp: number; maxHp: number; w: number; h: number; lastFire: number; flash: number; patrolDir?: number }
interface Explosion { x: number; y: number; r: number; mr: number; a: number }
interface Bullet { x: number; y: number; vx: number; vy: number; src: "soldier" | "turret" | "tank"; dmg: number }
interface Spark { x: number; y: number; vx: number; vy: number; a: number; r: number; c: string }
interface FloatText { x: number; y: number; text: string; color: string; a: number; vy: number }

// ===== CONSTANTS =====
const SPD = 4.5, CLIMB = 0.16, DIVE = 0.12, GRAV = 0.02;
const BOMB_G = 0.18, BOMB_CD = 350, BLAST = 50;
const MAX_HP = 100, INVULN = 300, CHUNK = 500;
const SOLDIER_CD = 3000, TURRET_CD = 2000, TANK_CD = 4000;
const SOLDIER_BSPD = 4, TURRET_BSPD = 5.5, TANK_BSPD = 3.2;
const SOLDIER_DMG = 5, TURRET_DMG = 10, TANK_DMG = 25;
const GROUND_Y = 500;
const REGEN_DELAY = 5000, REGEN_RATE = 0.001; // 1 HP per second

// ===== TERRAIN =====
function tY(x: number): number {
    return GROUND_Y + Math.sin(x * 0.0018) * 70 + Math.sin(x * 0.0047 + 1.3) * 35
        + Math.sin(x * 0.011 + 2.7) * 18 + Math.sin(x * 0.024 + 4.1) * 8;
}

// ===== AUDIO =====
let ac: AudioContext | null = null;
function getAC() {
    if (!ac) ac = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    return ac;
}
function sfxDrop() {
    try { const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(350, c.currentTime); o.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.12);
        g.gain.setValueAtTime(0.07, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.15);
    } catch { /* */ }
}
function sfxBoom(big = false) {
    try { const c = getAC(), len = c.sampleRate * (big ? 0.6 : 0.4), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.15));
        const s = c.createBufferSource(); s.buffer = buf;
        const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(big ? 250 : 500, c.currentTime);
        f.frequency.exponentialRampToValueAtTime(20, c.currentTime + (big ? 0.6 : 0.4));
        const g = c.createGain(); g.gain.setValueAtTime(big ? 0.35 : 0.2, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (big ? 0.6 : 0.4));
        s.connect(f); f.connect(g); g.connect(c.destination); s.start(); s.stop(c.currentTime + (big ? 0.6 : 0.4));
    } catch { /* */ }
}
function sfxHit() {
    try { const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.type = "square"; o.frequency.setValueAtTime(180, c.currentTime); o.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.12);
        g.gain.setValueAtTime(0.1, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.15);
    } catch { /* */ }
}
function sfxShoot(deep = false) {
    try { const c = getAC(), o = c.createOscillator(), g = c.createGain();
        o.type = deep ? "square" : "sawtooth";
        o.frequency.setValueAtTime(deep ? 120 : 350, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(deep ? 40 : 150, c.currentTime + 0.1);
        g.gain.setValueAtTime(deep ? 0.08 : 0.04, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
        o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.15);
    } catch { /* */ }
}

// ===== COMPONENT =====
export const CarpetBombingGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef(0);

    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d")!;
        const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
        resize(); window.addEventListener("resize", resize);

        // State
        let gs: GState = "title", score = 0, bestScore = 0, elapsed = 0;
        let shX = 0, shY = 0, shA = 0;
        let px = 0, py = GROUND_Y - 200, pvx = SPD, pvy = 0;
        let pdir = 1, pang = 0, php = MAX_HP, pinv = 0, plb = 0;
        let lastDamageTime = 0;
        let bombs: Bomb[] = [], enemies: Enemy[] = [], exps: Explosion[] = [];
        let bullets: Bullet[] = [], sparks: Spark[] = [], floats: FloatText[] = [];
        let trail: { x: number; y: number; a: number }[] = [];
        const chunks = new Set<number>();
        let lastRegenTick = 0;

        function reset() {
            px = 0; py = GROUND_Y - 200; pvx = SPD; pvy = 0;
            pdir = 1; pang = 0; php = MAX_HP; pinv = 0; plb = 0; lastDamageTime = 0;
            bombs = []; enemies = []; exps = []; bullets = []; sparks = []; floats = []; trail = [];
            chunks.clear(); score = 0; elapsed = 0; shX = 0; shY = 0; shA = 0; lastRegenTick = 0;
        }

        function spawnChunk(ci: number) {
            if (chunks.has(ci)) return;
            chunks.add(ci);
            const x0 = ci * CHUNK, diff = Math.min(1 + elapsed / 60000, 4);
            const n = Math.floor(2 + Math.random() * 2 * diff);
            for (let i = 0; i < n; i++) {
                const ex = x0 + 50 + Math.random() * (CHUNK - 100);
                const ty = tY(ex), r = Math.random();
                if (r < 0.3) enemies.push({ x: ex, y: ty - 14, type: "soldier", hp: 1, maxHp: 1, w: 10, h: 18, lastFire: 0, flash: 0, patrolDir: Math.random() > 0.5 ? 1 : -1 });
                else if (r < 0.55) enemies.push({ x: ex, y: ty - 16, type: "tank", hp: 4, maxHp: 4, w: 42, h: 22, lastFire: 0, flash: 0 });
                else if (r < 0.75) { const bh = 40 + Math.random() * 40; enemies.push({ x: ex, y: ty - bh, type: "building", hp: 5, maxHp: 5, w: 28 + Math.random() * 20, h: bh, lastFire: 0, flash: 0 }); }
                else enemies.push({ x: ex, y: ty - 20, type: "turret", hp: 2, maxHp: 2, w: 26, h: 26, lastFire: 0, flash: 0, patrolDir: Math.random() > 0.5 ? 1 : -1 });
            }
        }

        function addFloat(x: number, y: number, text: string, color: string) {
            floats.push({ x, y, text, color, a: 1, vy: -1.5 });
        }

        function boom(bx: number, by: number, br: number, depth = 0) {
            exps.push({ x: bx, y: by, r: 5, mr: br, a: 1 });
            const cols = ["#ff6b35", "#ffa726", "#ffcc02", "#ff4444", "#fff"];
            for (let i = 0; i < Math.floor(br / 2); i++) {
                const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 6;
                sparks.push({ x: bx, y: by, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, a: 1, r: 1 + Math.random() * 4, c: cols[Math.floor(Math.random() * cols.length)] });
            }
            shA = Math.max(shA, Math.min(15, br / 3));
            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i], dx = e.x - bx, dy = (e.y + e.h / 2) - by;
                if (Math.sqrt(dx * dx + dy * dy) < br + Math.max(e.w, e.h) / 2) {
                    e.hp--; e.flash = 8;
                    if (e.hp <= 0) {
                        score += e.type === "soldier" ? 10 : e.type === "tank" ? 25 : e.type === "building" ? 50 : 100;
                        addFloat(e.x, e.y - 10, `+${e.type === "soldier" ? 10 : e.type === "tank" ? 25 : e.type === "building" ? 50 : 100}`, "#fbbf24");
                        if (e.type === "building" && depth < 2) boom(e.x + e.w / 2, e.y + e.h / 2, 35, depth + 1);
                        enemies.splice(i, 1);
                    }
                }
            }
        }

        function die() {
            gs = "gameover"; php = 0;
            boom(px, py, 60); sfxBoom(true);
            if (score > bestScore) bestScore = score;
        }

        function hit(dmg = 10) {
            const now = performance.now();
            if (now < pinv) return;
            php = Math.max(0, php - dmg); pinv = now + INVULN; shA = Math.min(8, dmg / 2); lastDamageTime = now; sfxHit();
            addFloat(px, py - 20, `-${dmg}`, "#ef4444");
            if (php <= 0) die();
        }

        // Input
        const keys: Record<string, boolean> = {};
        const kd = (e: KeyboardEvent) => {
            keys[e.code] = true;
            if ((gs === "title" || gs === "gameover") && (e.code === "Enter" || e.code === "Space")) { e.preventDefault(); reset(); gs = "playing"; }
            if (e.code === "Space") e.preventDefault();
        };
        const ku = (e: KeyboardEvent) => { keys[e.code] = false; };
        const cl = () => { if (gs === "title") { reset(); gs = "playing"; } };
        window.addEventListener("keydown", kd);
        window.addEventListener("keyup", ku);
        cvs.addEventListener("click", cl);

        let lastT = performance.now();

        const loop = (t: number) => {
            const dt = Math.min(t - lastT, 33); lastT = t;
            const cw = cvs.width, ch = cvs.height;
            const camYOff = GROUND_Y - ch * 0.7;

            if (gs === "playing") {
                elapsed += dt;
                // Turn
                if ((keys["ArrowLeft"] || keys["KeyA"]) && pdir > 0) pdir = -1;
                if ((keys["ArrowRight"] || keys["KeyD"]) && pdir < 0) pdir = 1;
                const ta = pdir > 0 ? 0 : Math.PI;
                let da = ta - pang; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
                pang += da * 0.1;
                // Altitude
                if (keys["ArrowUp"] || keys["KeyW"]) pvy -= CLIMB;
                if (keys["ArrowDown"] || keys["KeyS"]) pvy += DIVE;
                pvy += GRAV; pvy *= 0.96; pvy = Math.max(-4, Math.min(3, pvy));
                pvx = Math.cos(pang) * SPD; px += pvx; py += pvy;
                // Ceiling
                if (py < camYOff + 30) { py = camYOff + 30; pvy = 0; }
                // GROUND = instant death
                const gnd = tY(px);
                if (py > gnd - 15) { die(); }
                // BUILDING collision = instant death
                if (gs === "playing") {
                    for (const e of enemies) {
                        if (e.type !== "building") continue;
                        const bL = e.x - e.w / 2, bR = e.x + e.w / 2;
                        if (px > bL - 15 && px < bR + 15 && py > e.y - 10 && py < e.y + e.h) { die(); break; }
                    }
                }
                // Bomb
                if (gs === "playing" && keys["Space"]) {
                    const now = performance.now();
                    if (now - plb > BOMB_CD) { plb = now; bombs.push({ x: px, y: py + 8, vx: pvx * 0.5, vy: 1 }); sfxDrop(); }
                }
                // Trail
                trail.push({ x: px - pdir * 18, y: py + 3, a: 0.5 });
                if (trail.length > 40) trail.shift();
                for (const c of trail) c.a *= 0.94;
                // Bombs
                for (let i = bombs.length - 1; i >= 0; i--) {
                    const b = bombs[i]; b.vy += BOMB_G; b.x += b.vx; b.y += b.vy;
                    if (b.y >= tY(b.x)) { boom(b.x, tY(b.x), BLAST); sfxBoom(); bombs.splice(i, 1); continue; }
                    if (b.y > GROUND_Y + 300) bombs.splice(i, 1);
                }
                // Spawn chunks
                const lc = Math.floor((px - cw) / CHUNK), rc = Math.floor((px + cw) / CHUNK);
                for (let c = lc; c <= rc; c++) spawnChunk(c);
                // Enemy AI
                const now2 = performance.now();
                const fr = Math.max(0.4, 1 - elapsed / 120000);
                for (const e of enemies) {
                    if (e.flash > 0) e.flash--;
                    const dx = px - e.x, dy = py - e.y, dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Predictive Aiming
                    const bSpd = e.type === "tank" ? TANK_BSPD : e.type === "turret" ? TURRET_BSPD : SOLDIER_BSPD;
                    const travelT = dist / bSpd;
                    const predX = px + pvx * travelT, predY = py + pvy * travelT;
                    const a = Math.atan2(predY - e.y, predX - e.x);

                    // Soldier: patrols + fires small bullets
                    if (e.type === "soldier") {
                        if (e.patrolDir) { e.x += e.patrolDir * 0.5; e.y = tY(e.x) - 14; if (Math.random() < 0.005) e.patrolDir *= -1; }
                        if (dist < 350 && now2 - e.lastFire > SOLDIER_CD * fr) {
                            e.lastFire = now2;
                            bullets.push({ x: e.x, y: e.y - 5, vx: Math.cos(a) * SOLDIER_BSPD, vy: Math.sin(a) * SOLDIER_BSPD, src: "soldier", dmg: SOLDIER_DMG });
                        }
                    }
                    // Turret: patrols + fires fast bullets
                    if (e.type === "turret") {
                        if (e.patrolDir) { e.x += e.patrolDir * 0.3; e.y = tY(e.x) - 20; if (Math.random() < 0.003) e.patrolDir *= -1; }
                        if (dist < 500 && now2 - e.lastFire > TURRET_CD * fr) {
                            e.lastFire = now2; sfxShoot(false);
                            bullets.push({ x: e.x, y: e.y - 5, vx: Math.cos(a) * TURRET_BSPD, vy: Math.sin(a) * TURRET_BSPD, src: "turret", dmg: TURRET_DMG });
                        }
                    }
                    // Tank: static, slow heavy shells, high damage
                    if (e.type === "tank" && dist < 450 && now2 - e.lastFire > TANK_CD * fr) {
                        e.lastFire = now2; sfxShoot(true);
                        bullets.push({ x: e.x, y: e.y - 2, vx: Math.cos(a) * TANK_BSPD, vy: Math.sin(a) * TANK_BSPD, src: "tank", dmg: TANK_DMG });
                    }
                }
                // HP regen
                if (php > 0 && php < MAX_HP && now2 - lastDamageTime > REGEN_DELAY) {
                    const oldHp = Math.floor(php);
                    php = Math.min(MAX_HP, php + REGEN_RATE * dt);
                    // Float +1 every second
                    if (now2 - lastRegenTick > 1000) { lastRegenTick = now2; addFloat(px, py - 30, "+1", "#22c55e"); }
                }
                // GC far enemies
                enemies = enemies.filter(e => Math.abs(e.x - px) < cw * 2);
                // Bullets
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const b = bullets[i]; b.x += b.vx; b.y += b.vy;
                    if (Math.sqrt((b.x - px) ** 2 + (b.y - py) ** 2) < 18) { hit(b.dmg); bullets.splice(i, 1); continue; }
                    // Despawn at ground level (friendly fire — no explosion) or off-screen
                    if (b.y >= tY(b.x) || Math.abs(b.x - px) > cw || Math.abs(b.y - py) > ch) { bullets.splice(i, 1); continue; }
                }
                // Explosions
                for (let i = exps.length - 1; i >= 0; i--) {
                    const e = exps[i]; e.r += (e.mr - e.r) * 0.15; e.a *= 0.93;
                    if (e.a < 0.02) exps.splice(i, 1);
                }
                // Sparks
                for (let i = sparks.length - 1; i >= 0; i--) {
                    const s = sparks[i]; s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.vx *= 0.98; s.a *= 0.95;
                    if (s.a < 0.02) sparks.splice(i, 1);
                }
                // Floating text
                for (let i = floats.length - 1; i >= 0; i--) {
                    const f = floats[i]; f.y += f.vy; f.a -= 0.015;
                    if (f.a <= 0) floats.splice(i, 1);
                }
                // Shake
                if (shA > 0) { shX = (Math.random() - 0.5) * shA; shY = (Math.random() - 0.5) * shA; shA *= 0.85; if (shA < 0.5) { shA = 0; shX = 0; shY = 0; } }
            }

            // ---- RENDER ----
            const skyG = ctx.createLinearGradient(0, 0, 0, ch);
            skyG.addColorStop(0, "#0a0a2e"); skyG.addColorStop(0.5, "#1a1a4e"); skyG.addColorStop(1, "#2d1b4e");
            ctx.fillStyle = skyG; ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            const camX = (gs !== "title") ? px - cw / 2 + shX : 0;
            for (let i = 0; i < 60; i++) {
                const sx = ((i * 137.5 + 50) % cw + cw - (camX * 0.02) % cw) % cw;
                const sy = (i * 97.3 + 30) % (ch * 0.5);
                ctx.beginPath(); ctx.arc(sx, sy, (i % 3) * 0.4 + 0.5, 0, Math.PI * 2); ctx.fill();
            }

            if (gs === "title") {
                ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 48px 'Inter', sans-serif"; ctx.textAlign = "center";
                ctx.fillText("CARPET BOMBING", cw / 2, ch * 0.35);
                ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "16px 'Inter', sans-serif";
                ctx.fillText("← → to turn  ·  ↑ ↓ to fly  ·  SPACE to bomb", cw / 2, ch * 0.45);
                const pulse = 0.5 + Math.sin(Date.now() * 0.004) * 0.3;
                ctx.globalAlpha = pulse; ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "18px 'Inter', sans-serif";
                ctx.fillText("Press ENTER or Click to Play", cw / 2, ch * 0.55);
                ctx.globalAlpha = 1;
                ctx.beginPath(); ctx.moveTo(0, ch);
                for (let x = 0; x <= cw; x += 4) ctx.lineTo(x, tY(x) - camYOff);
                ctx.lineTo(cw, ch); ctx.closePath(); ctx.fillStyle = "#111828"; ctx.fill();
            } else {
                ctx.save(); ctx.translate(-camX, -camYOff);
                // Terrain
                ctx.beginPath(); ctx.moveTo(camX - 10, GROUND_Y + 300);
                for (let sx = -10; sx <= cw + 10; sx += 3) { const wx = sx + camX; ctx.lineTo(wx, tY(wx)); }
                ctx.lineTo(camX + cw + 10, GROUND_Y + 300); ctx.closePath();
                const tGrad = ctx.createLinearGradient(0, GROUND_Y - 80, 0, GROUND_Y + 100);
                tGrad.addColorStop(0, "#1e293b"); tGrad.addColorStop(0.3, "#111828"); tGrad.addColorStop(1, "#0a0f1a");
                ctx.fillStyle = tGrad; ctx.fill();
                ctx.beginPath();
                for (let sx = -10; sx <= cw + 10; sx += 3) { const wx = sx + camX; if (sx === -10) ctx.moveTo(wx, tY(wx)); else ctx.lineTo(wx, tY(wx)); }
                ctx.strokeStyle = "rgba(100,200,100,0.15)"; ctx.lineWidth = 1; ctx.stroke();

                // Trail
                for (const c of trail) { ctx.beginPath(); ctx.arc(c.x, c.y, 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,200,255,${c.a})`; ctx.fill(); }

                // Enemies
                for (const e of enemies) {
                    const fl = e.flash > 0;
                    if (e.type === "soldier") {
                        ctx.fillStyle = fl ? "#fff" : "#94a3b8";
                        ctx.fillRect(e.x - 3, e.y, 6, 12);
                        ctx.beginPath(); ctx.arc(e.x, e.y, 4, 0, Math.PI * 2); ctx.fill();
                        // Gun
                        const ga = Math.atan2(py - e.y, px - e.x);
                        ctx.strokeStyle = fl ? "#fff" : "#cbd5e1"; ctx.lineWidth = 1.5;
                        ctx.beginPath(); ctx.moveTo(e.x, e.y + 4); ctx.lineTo(e.x + Math.cos(ga) * 10, e.y + 4 + Math.sin(ga) * 10); ctx.stroke();
                    } else if (e.type === "tank") {
                        ctx.fillStyle = fl ? "#fff" : "#475569";
                        ctx.fillRect(e.x - e.w / 2, e.y + 6, e.w, e.h - 6);
                        // Turret head + barrel pointing at plane predicatively
                        const dist = Math.sqrt((px - e.x) ** 2 + (py - e.y) ** 2);
                        const predX = px + pvx * (dist / TANK_BSPD), predY = py + pvy * (dist / TANK_BSPD);
                        const ba = Math.atan2(predY - (e.y + 2), predX - e.x);
                        ctx.fillStyle = fl ? "#fff" : "#64748b";
                        ctx.fillRect(e.x - 8, e.y, 16, 10);
                        ctx.save(); ctx.translate(e.x, e.y + 4); ctx.rotate(ba);
                        ctx.fillRect(0, -2.5, 20, 5); ctx.restore();
                        // Treads
                        ctx.fillStyle = fl ? "#fff" : "#334155";
                        ctx.fillRect(e.x - e.w / 2 + 2, e.y + e.h - 4, e.w - 4, 4);
                    } else if (e.type === "building") {
                        ctx.fillStyle = fl ? "#fff" : "#334155";
                        ctx.fillRect(e.x - e.w / 2, e.y, e.w, e.h);
                        ctx.fillStyle = fl ? "#fff" : "#fbbf24";
                        for (let wy = e.y + 8; wy < e.y + e.h - 8; wy += 14) {
                            for (let wx = e.x - e.w / 2 + 6; wx < e.x + e.w / 2 - 6; wx += 10) ctx.fillRect(wx, wy, 4, 5);
                        }
                    } else if (e.type === "turret") {
                        ctx.fillStyle = fl ? "#fff" : "#dc2626";
                        ctx.fillRect(e.x - 10, e.y + 6, 20, 14);
                        // Predictive aim visual for turret/tank
                        const dist = Math.sqrt((px - e.x) ** 2 + (py - e.y) ** 2);
                        const predX = px + pvx * (dist / TURRET_BSPD), predY = py + pvy * (dist / TURRET_BSPD);
                        const ga = Math.atan2(predY - e.y, predX - e.x);
                        ctx.save(); ctx.translate(e.x, e.y + 4); ctx.rotate(ga); ctx.fillRect(0, -2, 18, 4); ctx.restore();
                        ctx.beginPath(); ctx.arc(e.x, e.y + 6, 6, 0, Math.PI * 2);
                        ctx.fillStyle = fl ? "#fff" : "#ef4444"; ctx.fill();
                    }
                    // Enemy HP bar (only if damaged)
                    if (e.hp < e.maxHp && e.hp > 0) {
                        const bw = Math.max(e.w, 24), bh = 3, bx = e.x - bw / 2, by = e.y - 8;
                        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(bx, by, bw, bh);
                        ctx.fillStyle = e.hp / e.maxHp > 0.5 ? "#22c55e" : "#ef4444";
                        ctx.fillRect(bx, by, bw * (e.hp / e.maxHp), bh);
                    }
                }

                // Bombs
                ctx.fillStyle = "#94a3b8";
                for (const b of bombs) {
                    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx));
                    ctx.fillRect(-6, -3, 12, 6);
                    ctx.beginPath(); ctx.moveTo(6, -4); ctx.lineTo(10, -6); ctx.lineTo(10, 6); ctx.lineTo(6, 4); ctx.closePath(); ctx.fill();
                    ctx.restore();
                }

                // Bullets — different visuals per source
                for (const b of bullets) {
                    if (b.src === "soldier") {
                        // Small yellow dot
                        ctx.fillStyle = "#fbbf24";
                        ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx.fill();
                    } else if (b.src === "turret") {
                        // Medium red tracer
                        ctx.fillStyle = "#ff4444";
                        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "rgba(255,68,68,0.3)";
                        ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI * 2); ctx.fill();
                    } else if (b.src === "tank") {
                        // Large orange shell with trail
                        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx));
                        ctx.fillStyle = "#f97316"; ctx.fillRect(-5, -3, 10, 6);
                        ctx.fillStyle = "#fbbf24"; ctx.fillRect(-5, -1.5, 4, 3);
                        ctx.restore();
                        ctx.fillStyle = "rgba(249,115,22,0.2)";
                        ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, Math.PI * 2); ctx.fill();
                    }
                }

                // Explosions
                for (const e of exps) {
                    const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
                    grad.addColorStop(0, `rgba(255,255,200,${e.a})`);
                    grad.addColorStop(0.4, `rgba(255,150,50,${e.a * 0.8})`);
                    grad.addColorStop(1, `rgba(255,50,0,0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
                }
                // Sparks
                for (const s of sparks) {
                    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = s.c; ctx.globalAlpha = s.a; ctx.fill(); ctx.globalAlpha = 1;
                }

                // Floating text (world space)
                ctx.font = "bold 14px 'Inter', sans-serif"; ctx.textAlign = "center";
                for (const f of floats) {
                    ctx.globalAlpha = Math.max(0, f.a); ctx.fillStyle = f.color;
                    ctx.fillText(f.text, f.x, f.y);
                }
                ctx.globalAlpha = 1;

                // Plane
                if (gs === "playing" || (gs === "gameover" && php > 0)) {
                    const blink = performance.now() < pinv && Math.floor(Date.now() / 100) % 2 === 0;
                    if (!blink) {
                        ctx.save(); ctx.translate(px, py); ctx.scale(pdir, 1);
                        ctx.fillStyle = "#e2e8f0"; ctx.beginPath();
                        ctx.moveTo(22, 0); ctx.lineTo(-14, -7); ctx.lineTo(-18, -5);
                        ctx.lineTo(-14, 0); ctx.lineTo(-18, 5); ctx.lineTo(-14, 7); ctx.closePath(); ctx.fill();
                        ctx.fillStyle = "#94a3b8";
                        ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(-8, -14); ctx.lineTo(-12, -12); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill();
                        ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(-8, 14); ctx.lineTo(-12, 12); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill();
                        ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(12, -1, 3, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "rgba(251,191,36,0.6)"; ctx.beginPath(); ctx.arc(-17, 0, 3 + Math.random(), 0, Math.PI * 2); ctx.fill();
                        ctx.restore();
                    }
                }

                ctx.restore(); // end world transform
            }

            // HUD
            if (gs === "playing" || gs === "gameover") {
                // Score
                ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "bold 24px 'Inter', monospace"; ctx.textAlign = "right";
                ctx.fillText(`${score}`, cw - 20, 40);
                ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "12px 'Inter', sans-serif";
                ctx.fillText("SCORE", cw - 20, 56);
                // Centered HP bar
                const barW = 220, barH = 10, barX = (cw - barW) / 2, barY = ch - 40;
                const hpFrac = Math.max(0, php) / MAX_HP;
                ctx.fillStyle = "rgba(0,0,0,0.4)";
                ctx.beginPath(); ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 6); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.06)";
                ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 5); ctx.fill();
                const barColor = hpFrac > 0.6 ? "#22c55e" : hpFrac > 0.3 ? "#eab308" : "#ef4444";
                ctx.shadowColor = barColor; ctx.shadowBlur = 10;
                ctx.fillStyle = barColor;
                if (hpFrac > 0) { ctx.beginPath(); ctx.roundRect(barX, barY, barW * hpFrac, barH, 5); ctx.fill(); }
                ctx.shadowBlur = 0;
                // HP number
                ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "bold 11px 'Inter', monospace"; ctx.textAlign = "center";
                ctx.fillText(`${Math.ceil(php)} / ${MAX_HP}`, cw / 2, barY + 9);
                // Regen indicator
                const now3 = performance.now();
                if (php > 0 && php < MAX_HP && now3 - lastDamageTime > REGEN_DELAY) {
                    ctx.fillStyle = "rgba(34,197,94,0.6)"; ctx.font = "10px 'Inter', sans-serif";
                    ctx.fillText("♥ REGEN", cw / 2, barY - 8);
                }
                // Distance
                ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "12px 'Inter', monospace"; ctx.textAlign = "center";
                ctx.fillText(`${Math.floor(elapsed / 1000)}s  ·  ${Math.abs(Math.floor(px / 10))}m`, cw / 2, 24);
            }

            // Game Over
            if (gs === "gameover") {
                ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, cw, ch);
                ctx.fillStyle = "#ef4444"; ctx.font = "bold 42px 'Inter', sans-serif"; ctx.textAlign = "center";
                ctx.fillText("SHOT DOWN", cw / 2, ch * 0.35);
                ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "bold 64px 'Inter', monospace";
                ctx.fillText(`${score}`, cw / 2, ch * 0.48);
                ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "14px 'Inter', sans-serif";
                ctx.fillText(`BEST: ${bestScore}`, cw / 2, ch * 0.54);
                const pulse = 0.4 + Math.sin(Date.now() * 0.004) * 0.3;
                ctx.globalAlpha = pulse; ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "18px 'Inter', sans-serif";
                ctx.fillText("Press ENTER to Try Again", cw / 2, ch * 0.65);
                ctx.globalAlpha = 1;
            }

            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); cvs.removeEventListener("click", cl); };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#0a0a2e]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" style={{ cursor: "crosshair" }} />
            <div className="absolute top-5 left-5 z-50">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/10 bg-black/20 backdrop-blur-md">
                    <ArrowLeft size={15} /> Portfolio
                </Link>
            </div>
        </div>
    );
};
