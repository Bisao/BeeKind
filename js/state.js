
document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  let now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

document.addEventListener('gesturestart', function (event) {
  event.preventDefault();
});

let deferredPrompt;
let newWorker;
let pwaState = 'install';

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          syncPwaUI('update');
        }
      });
    });
  }).catch(e => console.warn("Modo Local: SW não registrado."));
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  syncPwaUI('install');
});

if (!window.matchMedia('(display-mode: standalone)').matches) {
    window.addEventListener('load', () => {
        const btn = document.getElementById('pwaMainActionBtn');
        if(btn) btn.style.display = 'flex';
    });
} else {
    window.addEventListener('load', () => {
        const btn = document.getElementById('pwaMainActionBtn');
        const msg = document.getElementById('pwaInstalledMsg');
        if(btn) btn.style.display = 'none';
        if(msg) msg.style.display = 'block';
    });
}



async 

let updateHistory = [
    {
        version: "12.1.0",
        title: "👴 O VELHO DUDU CHEGOU!",
        changes: [
            { type: "add", text: "Novo Mercado: Agora você pode vender seu mel para o Velho Dudu na aba Loja." },
            { type: "mod", text: "Favor Real: Vender mel agora concede bônus permanente de produção (MPS e Click)." },
            { type: "fix", text: "Economia: Ajustada a curva de valorização do mel histórico para trocas justas." }
        ]
    },
    {
        version: "11.9.0",
        title: "👑 NUTRIÇÃO REAL",
        changes: [
            { type: "add", text: "Fisiologia Real: A Rainha agora pode ter sua produção aumentada até o limite de 2200 abelhas." },
            { type: "mod", text: "Imersão: Upgrade de fertilidade disponível na aba Colmeia." }
        ]
    },
    {
        version: "11.8.1",
        title: "🏠 ALINHAMENTO DA COLMEIA",
        changes: [
            { type: "fix", text: "Engenharia Civil: Corrigido o empilhamento das peças da colmeia para encaixe perfeito." }
        ]
    },
    {
        version: "11.8.0",
        title: "🛡️ PERSISTÊNCIA DE DADOS",
        changes: [
            { type: "fix", text: "Estabilidade: Restaurado o sistema de chaves originais para evitar perda de progresso." }
        ]
    },
    {
        version: "11.7.0",
        title: "🏠 ARQUITETURA MODULAR",
        changes: [
            { type: "add", text: "Novo Sistema: A colmeia agora é dividida em partes independentes." }
        ]
    }
];









const SAVE_KEY = "BeeRoyal_Balance_V2";
const AUDIO_KEY = "BeeRoyal_Audio_V1";
const MISSION_KEY = "BeeRoyal_Missions_V2";
const THEME_KEY = "BeeRoyal_Theme_V1";
const RECORDS_KEY = "BeeRoyal_Records_V1";
const DAILY_REWARD_KEY = "BeeRoyal_Daily_V2";



let honey = 0, totalHoneyEver = 0, hPerClick = 0.2, level = 1;
let currentXP = 0, nextLevelXP = 1000, autoUnlocked = true;
let favorReal = 0; // Favor Real do Velho Dudu

// TALENTOS
let talentPoints = 0;
let talents = {
    operario_forca: 0, 
    operario_critico: 0, 
    arquiteto_mps: 0, 
    arquiteto_offline: 0, 
    alquimista_sorte: 0, 
    alquimista_boost: 0 
};

// COLMEIA & PRODUÇÃO
let hiveOwned = { base: true, middle: false, top: false };
const HIVE_COSTS = { middle: 500000, top: 2500000 };
let queenProductionLevel = 0;

let hangarsCount = 1;
let expeditions = [
    { id: 0, active: false, startTime: 0, duration: 300000, reductionPerc: 0, biome: 'clover', eventChance: 0, finished: false, pendingRewards: null, uses: 0, selectedPerc: 50 },
    { id: 1, active: false, startTime: 0, duration: 300000, reductionPerc: 0, biome: 'clover', eventChance: 0, finished: false, pendingRewards: null, uses: 0, selectedPerc: 50 },
    { id: 2, active: false, startTime: 0, duration: 300000, reductionPerc: 0, biome: 'clover', eventChance: 0, finished: false, pendingRewards: null, uses: 0, selectedPerc: 50 },
    { id: 3, active: false, startTime: 0, duration: 300000, reductionPerc: 0, biome: 'clover', eventChance: 0, finished: false, pendingRewards: null, uses: 0, selectedPerc: 50 }
];
const HANGAR_COSTS = [0, 50000, 250000, 1000000];

let ownedCosmetics = ["Bee", "NoelBee", "SkullBee", "FairyBee"], equippedCosmetic = "NoelBee", equippedBackground = "BgPadrao", pendingOfflineHoney = 0, pendingOfflineXP = 0;
let activeBoosts = { pepper: 0, energy: 0, flower: 0, luck: 0, crown: 0, jelly: 0, magnet: 0 }; 
let clickBuffer = [], gameLoaded = false;
let currentAchFilter = 'all', autoProduceInterval = null, gameTickInterval = null;
let dailyMissions = [];
let lastMissionReset = 0;
let audioSettings = { music: 50, click: 80, lvlUp: 100 };
let themeSettings = { mainColor: "#071B87", opacity: 0.85 };
let records = { snake: 0, flight: 0, rain: 0, defender: 0 };
let defenderProgress = { level: 1, lastPlayed: 0 };
let pendingRerollId = null;

let dailyState = { streak: 0, lastClaim: 0, claimedToday: false };
const dailyCycle = [
    { type: 'honey', val: 5000, icon: '🍯' },
    { type: 'xp', val: 2000, icon: '✨' },
    { type: 'honey', val: 15000, icon: '🍯' },
    { type: 'boost', boost: 'pepper', ticks: 1800, icon: '🌶️', label: '3m' },
    { type: 'honey', val: 50000, icon: '🍯' },
    { type: 'xp', val: 10000, icon: '✨' },
    { type: 'super', val: 200000, boost: 'crown', ticks: 1800, icon: '👑', label: 'REI' }
];

const soundMusic = new Audio('Music.mp3');
const soundClick = new Audio('Click.mp3');
const soundLvlUp = new Audio('LvlUp.mp3');
soundMusic.loop = true;

let activeMG = null;
let mgInterval = null;
let mgRunning = false;
let mgScore = 0;
let mgSpeed = 150;

let snake = [];
let snakeFood = {x: 0, y: 0};
let sdx = 20, sdy = 0, snextDx = 20, snextDy = 0;
let snakeBoost = null; 
let snakeBoostTimer = 0; 
let snakeBoostLife = 0; 
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas ? snakeCanvas.getContext("2d") : null;

let fBeeY = 150, fVelocity = 0, fGravity = 0.5, fJump = -7;
let fPipes = [];
let fBoosts = []; 
let fCollectedBoosts = []; 
const flightCanvas = document.getElementById("flightCanvas");
const flightCtx = flightCanvas ? flightCanvas.getContext("2d") : null;
const beeSprite = new Image();
beeSprite.src = 'Bee.png';

const rainCanvas = document.getElementById("rainCanvas");
const rainCtx = rainCanvas ? rainCanvas.getContext("2d") : null;
const rainBeeSprite = new Image();
rainBeeSprite.src = 'Bee.png';

let rBeeX = 135;
let rBeeTargetX = 135;
let rBeeDirChangeTimer = 0;
let rDrops = [];
let rHearts = 3;
let rBeeSpeed = 2;
let rDropSpeed = 1.5;
let rSpawnTimer = 0;
let rBeeYOffset = 0; 

const defenderCanvas = document.getElementById("defenderCanvas");
const defenderCtx = defenderCanvas ? defenderCanvas.getContext("2d") : null;
const defenderBeeSprite = new Image();
defenderBeeSprite.src = 'BeeUp.png';

let dPlayerX = 135;
let dBullets = [];
let dEnemies = [];
let dEnemyBullets = [];
let dModDrops = [];
let dEnemyDir = 1;
let dEnemyTimer = 40; 
let dMoving = 0; 
let dGameTimer = null;
let dHearts = 3;
let dFireCooldown = 0; 
let dHasDoubleShot = false;

window.addEventListener('keydown', (e) => {
    if(!mgRunning) return;
    const key = e.key.toLowerCase();
    if(activeMG === 'snake') {
        if ((key === 'arrowup' || key === 'w')) changeSnakeDir('UP');
        if ((key === 'arrowdown' || key === 's')) changeSnakeDir('DOWN');
        if ((key === 'arrowleft' || key === 'a')) changeSnakeDir('LEFT');
        if ((key === 'arrowright' || key === 'd')) changeSnakeDir('RIGHT');
    } else if(activeMG === 'flight') {
        if(e.code === 'Space' || key === 'w' || key === 'arrowup') flightJump();
    } else if(activeMG === 'defender') {
        if (key === 'arrowleft' || key === 'a') dMoving = -1;
        if (key === 'arrowright' || key === 'd') dMoving = 1;
        if (e.code === 'Space' || key === 'w' || key === 'arrowup') defenderFire();
    }
});

window.addEventListener('keyup', (e) => {
    if(!mgRunning || activeMG !== 'defender') return;
    const key = e.key.toLowerCase();
    if (key === 'arrowleft' || key === 'a' || key === 'arrowright' || key === 'd') dMoving = 0;
});

















































let activeMGData = null;













window.addEventListener('click', tryPlayMusic); window.addEventListener('touchstart', tryPlayMusic);







document.addEventListener('fullscreenchange', handleFSChange);
document.addEventListener('webkitfullscreenchange', handleFSChange);
document.addEventListener('mozfullscreenchange', handleFSChange);
document.addEventListener('MSFullscreenChange', handleFSChange);





const beeFacts = ["Abelhas polinizam 70% das culturas agrícolas do mundo.", "Uma abelha produz 1/12 de colher de chá de mel na vida.", "Uma colmeia pode ter até 60.000 abelhas no verão."];
const gameTips = ["💡 DICA: O bônus da Skin NoelBee (+10%) é aplicado no final!", "💡 DICA: Escolha o caminho Alquimista se gosta de Boosts longos!"];
let lastNotifType = "fact"; 

let notificationQueue = [];
let isProcessingNotifs = false;







const durations = [{label:"30s",t:300,m:1},{label:"1m",t:600,m:1.8},{label:"5m",t:3000,m:8},{label:"1h",t:36000,m:70},{label:"24h",t:864000,m:1200}];
const specialDurations = [{label:"2m",t:1200,m:10}]; 

const boostBases = { pepper: 500, energy: 300, flower: 1000, luck: 1500, jelly: 15000, magnet: 4000 }; 
const achievements = [];
const achThemes = [{n:"Aprendiz de Pólen",r:"common",i:"🌱"},{n:"Batedor de Asas",r:"common",i:"🪽"},{n:"Zumbido Melódico",r:"common",i:"🎵"},{n:"Pequeno Apicultor",r:"common",i:"👨‍🌾"},{n:"Barão do Açúcar",r:"rare",i:"💎"},{n:"Arquiduque da Colmeia",r:"rare",i:"🏰"},{n:"Imperador da Geleia Real",r:"epic",i:"👑"}];

const missionTemplates = [
    { id: 'm_click', type: 'clicks', title: "Ginástica de Asas", desc: "Coletas manuais {target} vezes", baseGoal: 100, rewardMult: 2.2 },
    { id: 'm_honey', type: 'honey_gain', title: "Reserva de Inverno", desc: "Colete {target} de Mel total", baseGoal: 500, rewardMult: 2.5 },
    { id: 'm_target', type: 'target_clicks', title: "Foco Absoluto", desc: "Acerte os alvos 🎯 {target} vezes", baseGoal: 30, rewardMult: 3.5 },
    { id: 'm_time', type: 'play_time', title: "Voo de Reconhecimento", desc: "Fique no jogo por {target} segundos", baseGoal: 300, rewardMult: 3.0 },
    { id: 'm_upg', type: 'buy_upgrade', title: "Evolução Necessária", desc: "Aplique talentos {target} vezes", baseGoal: 3, rewardMult: 4.0 },
    { id: 'm_mg_item', type: 'mg_item_collect', title: "Explorador de Games", desc: "Colete {target} itens em minigames", baseGoal: 15, rewardMult: 3.8 },
    { id: 'm_mg_boost', type: 'mg_boost_collect', title: "Caçador de Boosts", desc: "Pegue {target} itens de Boost em minigames", baseGoal: 2, rewardMult: 5.0 },
    { id: 'm_mg_kill', type: 'mg_kills', title: "Exterminador de Insetos", desc: "Abata {target} invasores no Hive Defender", baseGoal: 20, rewardMult: 4.5 },
    { id: 'm_mg_play', type: 'mg_session_finished', title: "Fã de Entretenimento", desc: "Termine {target} partidas de minijogos", baseGoal: 2, rewardMult: 3.2 },
    { id: 'm_xp', type: 'xp_gain', title: "Pólen Intelectual", desc: "Acumule {target} de XP total", baseGoal: 1000, rewardMult: 2.8 }
];
























































































function renderAchs() { const l = document.getElementById("achList"); if(!l) return; l.innerHTML = ""; achievements.filter(a => currentAchFilter === 'all' || a.r === currentAchFilter).forEach(a => { l.innerHTML += `<div class="ach-card ${a.u ? 'unlocked ' + a.r : 'locked'}"><div style="font-size:24px;">${a.u ? a.i : '🔒'}</div><div style="flex:1"><div style="font-weight:900; color:inherit; font-size:13px;">${a.n}</div><div style="font-size:11px; color:inherit; opacity: 0.7;">${a.d}</div></div>${a.u ? '<div style="color:var(--xp-bar)">✔</div>' : ''}</div>`; }); }

const beeCont = document.getElementById("beeContainer"); 
if(beeCont) { beeCont.addEventListener("mousedown", (e) => { e.preventDefault(); doClick(e, false); }); beeCont.addEventListener("touchstart", (e) => { e.preventDefault(); doClick(e, false); }, {passive: false}); }
const leftT = document.getElementById("leftTarget"); if(leftT) { leftT.addEventListener("mousedown", (e) => { e.preventDefault(); doClick(e, true); }); leftT.addEventListener("touchstart", (e) => { e.preventDefault(); doClick(e, true); }, {passive: false}); }
const rightT = document.getElementById("rightTarget"); if(rightT) { rightT.addEventListener("mousedown", (e) => { e.preventDefault(); doClick(e, true); }); rightT.addEventListener("touchstart", (e) => { e.preventDefault(); doClick(e, true); }, {passive: false}); }

function spawnFlake(containerId) { const container = document.getElementById(containerId); if(!container) return; const flake = document.createElement('div'); flake.className = 'snowflake'; flake.innerHTML = '❄'; flake.style.left = (Math.random() * 95) + 'vw'; flake.style.opacity = Math.random(); flake.style.animationDuration = (Math.random() * 3 + 3) + 's'; container.appendChild(flake); setTimeout(() => flake.remove(), 6000); }
setInterval(() => spawnFlake('snowContainer'), 300);
setInterval(() => { const gameUI = document.getElementById('gameUI'); if(gameLoaded && gameUI && gameUI.style.opacity == '1') spawnFlake('gameSnowContainer'); }, 400);

function initAchievements() { achievements.length = 0; for(let i=1; i<=200; i++) { let val = Math.pow(1.65, i) * 150, theme = achThemes[i % achThemes.length]; achievements.push({id:i,n:`${theme.n} ${Math.ceil(i/achThemes.length)}`,d:`Produziu ${formatNum(val)} de mel`,target:val,u:false,r:i < 80 ? "common" : (i < 160 ? "rare" : "epic"),i:theme.i}); } }
load();

function handlePwaClick() {
    if (pwaState === 'install') {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                const btn = document.getElementById('pwaMainActionBtn');
                if(btn) btn.style.display = 'none';
            }
            deferredPrompt = null;
        } else {
            const overlay = document.getElementById('downloadOverlay');
            if(overlay) overlay.style.display = 'flex';
        }
    } else if (pwaState === 'update') {
        if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
        window.location.reload();
    }
}

function checkUpdateStatus() {
    const currentVersion = updateHistory[0].version;
    const lastSeen = localStorage.getItem("BeeKind_LastVersionSeen_V121"); 
    const btn = document.getElementById("btnChangelog");
    if(!btn) return;

    if(!lastSeen || lastSeen !== currentVersion) {
        btn.classList.add("btn-chromatic-pulse");
    } else {
        btn.classList.remove("btn-chromatic-pulse");
    }
}

function openChangelog() { 
    const currentVersion = updateHistory[0].version;
    localStorage.setItem("BeeKind_LastVersionSeen_V121", currentVersion);
    checkUpdateStatus();
    renderChangelog(); 
    openModal('changelogModal'); 
}

function updateTheme() {
    const colorEl = document.getElementById('uiMainColor');
    const opacityEl = document.getElementById('uiOpacity');
    if(!colorEl || !opacityEl) return;

    const color = colorEl.value;
    const opacity = opacityEl.value;
    themeSettings.mainColor = color;
    themeSettings.opacity = parseFloat(opacity) / 100;
    const label = document.getElementById('uiOpacityLabel');
    if(label) label.textContent = opacity + '%';
    applyTheme();
    localStorage.setItem(THEME_KEY, JSON.stringify(themeSettings));
}

function prepareMinigame(type) {
    if(type === 'flight') {
        openModal('flightPreGameModal');
    } else if(type === 'snake') {
        openModal('snakePreGameModal');
    } else if(type === 'rain') {
        openModal('rainPreGameModal');
    } else if(type === 'defender') {
        const now = Date.now();
        if(defenderProgress.lastPlayed > 0 && now - defenderProgress.lastPlayed > 86400000) {
            defenderProgress.level = 1;
            executeSave();
            updateRecordsUI();
        }
        openModal('defenderPreGameModal');
    } else {
        startMinigameActual(type);
    }
}

function drawDefender() {
    if(!defenderCtx) return;
    defenderCtx.fillStyle = "#000"; defenderCtx.fillRect(0, 0, 300, 300);
    
    if(dFireCooldown > 0) dFireCooldown--;

    dPlayerX += dMoving * 4;
    if(dPlayerX < 0) dPlayerX = 0;
    if(dPlayerX > 270) dPlayerX = 270;
    
    if(defenderBeeSprite.complete) {
        defenderCtx.save();
        defenderCtx.translate(dPlayerX + 15, 260 + 15);
        defenderCtx.rotate(Math.PI / 2); 
        defenderCtx.scale(1, -1); 
        defenderCtx.drawImage(defenderBeeSprite, -15, -15, 30, 30);
        defenderCtx.restore();
    }

    dBullets.forEach((b, i) => {
        b.y -= 5;
        defenderCtx.fillStyle = dHasDoubleShot ? "#00ffff" : varProp('--accent');
        defenderCtx.fillRect(b.x - 1, b.y, 2, 8); 
        if(b.y < 0) dBullets.splice(i, 1);
    });

    dEnemyBullets.forEach((eb, i) => {
        eb.y += 3;
        defenderCtx.fillStyle = "#ff4757";
        defenderCtx.fillRect(eb.x - 1, eb.y, 2, 8);
        
        if(eb.x > dPlayerX && eb.x < dPlayerX + 30 && eb.y > 260 && eb.y < 290) {
            dHearts--;
            updateDefenderHearts();
            dEnemyBullets.splice(i, 1);
            if(dHearts <= 0) finishMG();
        }
        if(eb.y > 300) dEnemyBullets.splice(i, 1);
    });

    dModDrops.forEach((m, i) => {
        m.y += 2;
        defenderCtx.font = "20px Arial";
        defenderCtx.fillText("🔫", m.x, m.y);
        
        if(m.x > dPlayerX && m.x < dPlayerX + 30 && m.y > 250 && m.y < 290) {
            dHasDoubleShot = true;
            updateMgLiveBoostsVisual();
            dModDrops.splice(i, 1);
            notify({n: "TIRO DUPLO ATIVADO!"});
        } else if(m.y > 300) {
            dModDrops.splice(i, 1);
        }
    });

    let hitSide = false;
    let aliveEnemies = dEnemies.filter(e => e.alive);

    if(Math.random() < (0.015 + (defenderProgress.level * 0.005)) && aliveEnemies.length > 0) {
        let shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        if(!shooter.diving) {
            if(Math.random() > 0.4) {
                dEnemyBullets.push({x: shooter.x + 12, y: shooter.y + 20});
            } else {
                shooter.diving = true;
                shooter.diveDir = 1; 
            }
        }
    }

    dEnemies.forEach(e => {
        if(!e.alive) return;

        if(!e.diving) {
            e.x += dEnemyDir * (0.4 + defenderProgress.level * 0.1);
            if(e.x > 270 || e.x < 0) hitSide = true;
        } else {
            e.y += e.diveSpeed * e.diveDir;
            if(e.y > 270) e.diveDir = -1;
            if(e.y <= e.baseY && e.diveDir === -1) {
                e.y = e.baseY;
                e.diving = false;
            }

            if(e.x > dPlayerX - 20 && e.x < dPlayerX + 30 && e.y > 250 && e.y < 290) {
                dHearts--;
                updateDefenderHearts();
                e.alive = false; 
                if(dHearts <= 0) finishMG();
            }
        }
        
        defenderCtx.save();
        defenderCtx.font = "24px Arial";
        defenderCtx.translate(e.x + 12, e.y - 10);
        defenderCtx.rotate(Math.PI); 
        
        let emoji = (e.type === 'elite') ? "🪲" : "🪰";
        
        if(e.type === 'elite') {
            defenderCtx.fillStyle = "#fffa65"; 
            defenderCtx.fillText(emoji, -12, 10);
            defenderCtx.strokeStyle = "#ff4757";
            defenderCtx.lineWidth = 1;
            defenderCtx.strokeText(emoji, -12, 10);
        } else {
            defenderCtx.fillStyle = "#fff";
            defenderCtx.fillText(emoji, -12, 10);
        }
        defenderCtx.restore();
        
        dBullets.forEach((b, bi) => {
            if(b.x > e.x && b.x < e.x + 25 && b.y > e.y - 20 && b.y < e.y) {
                e.hp--;
                dBullets.splice(bi, 1);
                
                if(e.hp <= 0) {
                    e.alive = false;
                    mgScore++;
                    updateMissionProgress('mg_kills', 1);
                    if(Math.random() < 0.08) dModDrops.push({x: e.x + 10, y: e.y});

                    if(Math.random() < 0.005) {
                        const types = ['pepper', 'energy', 'flower', 'luck'];
                        const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀' };
                        const t = types[Math.floor(Math.random()*4)];
                        fCollectedBoosts.push({type: t, icon: icons[t]});
                        updateMgLiveBoostsVisual();
                    }
                }
            }
        });
    });

    if(hitSide) dEnemyDir *= -1;
    if(dEnemies.every(e => !e.alive)) {
        mgScore += 50; 
        if(defenderProgress.level < 7) defenderProgress.level++;
        defenderProgress.lastPlayed = Date.now();
        finishMG();
    }
}

function drawRain() {
    if(!rainCtx) return;
    rainCtx.fillStyle = "#000"; rainCtx.fillRect(0, 0, 300, 300);
    rBeeDirChangeTimer--;
    if(rBeeDirChangeTimer <= 0) {
        rBeeTargetX = Math.random() * 260;
        rBeeDirChangeTimer = Math.random() * 60 + 20;
        rBeeSpeed = (2 + (mgScore * 0.05)) * (Math.random() * 1.5 + 0.5);
    }
    let movingRight = rBeeTargetX > rBeeX;
    if(Math.abs(rBeeX - rBeeTargetX) > 2) {
        rBeeX += (movingRight ? 1 : -1) * rBeeSpeed;
    }
    rBeeYOffset = Math.sin(Date.now() / 150) * 8;
    if(rainBeeSprite.complete) {
        rainCtx.save();
        if(!movingRight) {
            rainCtx.translate(rBeeX + 40, 0); 
            rainCtx.scale(-1, 1);
            rainCtx.drawImage(rainBeeSprite, 0, 10 + rBeeYOffset, 40, 40);
        } else {
            rainCtx.drawImage(rainBeeSprite, rBeeX, 10 + rBeeYOffset, 40, 40);
        }
        rainCtx.restore();
    }
    rSpawnTimer++;
    const spawnThreshold = Math.max(10, 45 - Math.floor(mgScore/4));
    if(rSpawnTimer > spawnThreshold) {
        const rng = Math.random();
        let isBomb = rng < 0.35;
        let isBoost = !isBomb && rng < 0.005; 
        
        let drop = { x: rBeeX + 20, y: 45 + rBeeYOffset, isBomb: isBomb, isBoost: isBoost };
        
        if(isBoost) {
            const types = ['pepper', 'energy', 'flower', 'luck'];
            const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀' };
            drop.boostType = types[Math.floor(Math.random() * types.length)];
            drop.boostIcon = icons[drop.boostType];
        }
        
        rDrops.push(drop);
        rSpawnTimer = 0;
    }
    rDrops.forEach((d, i) => {
        d.y += rDropSpeed;
        rainCtx.font = "24px Arial";
        rainCtx.textAlign = "center";
        
        let icon = d.isBomb ? "💣" : (d.isBoost ? d.boostIcon : "🍯");
        rainCtx.fillText(icon, d.x, d.y);
        
        if(d.y > 295) {
            rDrops.splice(i, 1);
            if(!d.isBomb && !d.isBoost) { 
                rHearts--;
                updateRainHearts();
                if(rHearts <= 0) finishMG();
            }
        }
    });
    rDropSpeed = 1.5 + (mgScore * 0.04);
}

function finishMG() {
    mgRunning = false; clearInterval(mgInterval);
    if(dGameTimer) clearInterval(dGameTimer);

    if(mgScore > (records[activeMG] || 0)) { 
        records[activeMG] = mgScore; 
        localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); 
        updateRecordsUI(); 
    }
    
    if(activeMG === 'defender') {
        defenderProgress.lastPlayed = Date.now();
        executeSave();
    }
    
    updateMissionProgress('mg_session_finished', 1);
    
    let multiplier = 50; 
    if(activeMG === 'flight') multiplier = 120; 
    if(activeMG === 'rain') multiplier = 180; 
    if(activeMG === 'defender') multiplier = 150; 
    
    let hGain = mgScore * multiplier * (1 + level * 0.1);
    let xGain = hGain * 0.20; 
    
    const scoreVal = document.getElementById("mgResultScore");
    if(scoreVal) scoreVal.textContent = mgScore;
    const rewardVal = document.getElementById("mgResultReward");
    if(rewardVal) rewardVal.innerHTML = `+${formatNum(hGain)} 🍯 | +${formatNum(xGain)} XP`;
    
    const boostDisplay = document.getElementById("mgResultBoosts");
    if(boostDisplay) {
        if(fCollectedBoosts.length > 0) {
            let icons = fCollectedBoosts.map(b => b.icon).join(' ');
            boostDisplay.innerHTML = `BOOSTS COLETADOS: ${icons} (30s cada)`;
        } else {
            boostDisplay.innerHTML = "";
        }
    }

    const resScreen = document.getElementById("mgResultScreen");
    if(resScreen) resScreen.style.display = "flex";
    activeMGData = { hGain, xGain, boosts: [...fCollectedBoosts] };
}

function closeMgResult() { 
    if(activeMGData) {
        honey = validateNum(honey + activeMGData.hGain); 
        addXP(activeMGData.xGain);
        activeMGData.boosts.forEach(b => {
            activeBoosts[b.type] += 300; 
        });
        updateUI(); 
        executeSave();
        activeMGData = null;
    }
    const overlay = document.getElementById("minigameOverlay");
    if(overlay) overlay.style.display = "none"; 
}

function updateVolume(type) {
    tryPlayMusic();
    if(type === 'music') { 
        const musicIn = document.getElementById('musicVol');
        if(musicIn) {
            audioSettings.music = musicIn.value; 
            const label = document.getElementById('musicVolLabel');
            if(label) label.textContent = audioSettings.music + '%'; 
            soundMusic.volume = audioSettings.music / 100; 
        }
    } else if(type === 'click') { 
        const clickIn = document.getElementById('clickVol');
        if(clickIn) {
            audioSettings.click = clickIn.value; 
            const label = document.getElementById('clickVolLabel');
            if(label) label.textContent = audioSettings.click + '%'; 
            soundClick.volume = audioSettings.click / 100; 
        }
    } else if(type === 'lvlUp') {
        const lvlIn = document.getElementById('lvlUpVol');
        if(lvlIn) {
            audioSettings.lvlUp = lvlIn.value;
            const label = document.getElementById('lvlUpVolLabel');
            if(label) label.textContent = audioSettings.lvlUp + '%';
            soundLvlUp.volume = audioSettings.lvlUp / 100;
        }
    }
    localStorage.setItem(AUDIO_KEY, JSON.stringify(audioSettings));
}

function handleFSChange() {
    if(!checkFullscreenState() && gameLoaded) {
        console.log("Saiu do modo imersivo.");
    }
}

function returnToMain() {
    closeModal('settingsModal'); 
    if(autoProduceInterval) clearInterval(autoProduceInterval); 
    if(gameTickInterval) clearInterval(gameTickInterval);
    executeSave(); 
    const loadingScreen = document.getElementById("loadingScreen");
    const bar = document.getElementById("loadingBarFill");
    const bee = document.getElementById("loadingBeeImg");
    if(loadingScreen) loadingScreen.style.display = "flex";
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if(progress > 100) progress = 100;
        if(bar) bar.style.width = progress + "%";
        if(bee) bee.style.left = progress + "%";
        if(progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if(loadingScreen) loadingScreen.style.display = "none";
                const gameUI = document.getElementById('gameUI');
                const startScreen = document.getElementById('startScreen');
                if(gameUI) gameUI.style.opacity = '0';
                setTimeout(() => { 
                    if(gameUI) gameUI.style.display = 'none'; 
                    if(startScreen) {
                        startScreen.style.display = 'flex'; 
                        startScreen.style.opacity = '1'; 
                    }
                    gameLoaded = false; 
                }, 500);
            }, 300);
        }
    }, 50);
}

function startDynamicNotifications() {
    setInterval(() => {
        const gameUI = document.getElementById('gameUI');
        if (!gameLoaded || !gameUI || gameUI.style.opacity !== '1') return;
        let msg = lastNotifType === "fact" ? gameTips[Math.floor(Math.random() * gameTips.length)] : "🐝 " + beeFacts[Math.floor(Math.random() * beeFacts.length)];
        lastNotifType = lastNotifType === "fact" ? "tip" : "fact";
        notify({n: msg});
    }, 45000); 
}

function checkMissionReset() {
    const now = new Date();
    const resetHour = 22; 
    let resetLimit = new Date();
    resetLimit.setHours(resetHour, 0, 0, 0);
    if (now.getHours() < resetHour) { resetLimit.setDate(resetLimit.getDate() - 1); }
    if (lastMissionReset < resetLimit.getTime()) {
        let forgottenHoney = 0; let forgottenXP = 0;
        dailyMissions.forEach(m => { if (m.completed && !m.collected) { forgottenHoney += m.rewardHoney; forgottenXP += m.rewardXP; } });
        if (forgottenHoney > 0) { pendingOfflineHoney += forgottenHoney; pendingOfflineXP += forgottenXP; }
        generateDailyMissions(); lastMissionReset = now.getTime(); executeSave(); 
    }
    else if (!dailyMissions || dailyMissions.length < 10) { generateDailyMissions(); lastMissionReset = now.getTime(); executeSave(); }
}

function updateMissionProgress(type, amt = 1) {
    if (!gameLoaded) return; 
    let changed = false;
    dailyMissions.forEach(m => { 
        if (m.type === type && !m.completed) { 
            m.progress = validateNum(m.progress + amt); 
            if (m.progress >= m.target) { 
                m.progress = m.target; 
                m.completed = true; 
                notify({n: "Missão Realizada!", d: m.title}); 
            } 
            changed = true; 
        } 
    });
    if (changed) { 
        const modal = document.getElementById('missionsModal'); 
        if (modal && modal.style.display === 'flex') renderMissions(); 
        updateMissionAlertStatus(); 
    }
}

function openRerollConfirmation(id) { pendingRerollId = id; openModal('rerollModal'); }

const confirmRerollBtn = document.getElementById('btnConfirmReroll');
if(confirmRerollBtn) {
    confirmRerollBtn.onclick = () => {
        if (pendingRerollId) {
            const index = dailyMissions.findIndex(m => m.id === pendingRerollId);
            if (index !== -1) {
                const randomTmp = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
                const scaleFactor = Math.pow(level, 1.2);
                dailyMissions[index] = createSingleMission(randomTmp, scaleFactor);
                renderMissions(); updateMissionAlertStatus(); executeSave(); closeModal('rerollModal'); pendingRerollId = null;
            }
        }
    };
}

function collectMissionReward(id) {
    const m = dailyMissions.find(x => x.id === id);
    if (m && m.completed && !m.collected) {
        m.collected = true; 
        honey = validateNum(honey + m.rewardHoney); 
        addXP(m.rewardXP);
        notify({n: "Recompensa Coletada!", d: m.rewardLabel});
        const allCollected = dailyMissions.every(x => x.collected); 
        if(allCollected && dailyMissions.length >= 10) triggerCrownBonus();
        renderMissions(); 
        updateMissionAlertStatus(); 
        updateUI(); 
        executeSave();
    }
}

function sellToDudu() {
    if(honey < 500) return;
    
    let gain = (honey / (Math.max(1000, totalHoneyEver) * 1.5)) * 0.20;
    favorReal += gain;
    
    notify({n: "VENDA CONCLUÍDA! 👴", d: `+${(gain*100).toFixed(2)}% de Favor Real`});
    
    honey = 0; // O Dudu leva tudo
    playClickSound();
    updateUI();
    executeSave();
}

function upgradeTalent(key) {
    if(talentPoints > 0 && talents[key] < 20) {
        talentPoints--;
        talents[key]++;
        playClickSound();
        updateMissionProgress('buy_upgrade', 1);
        updateUI();
        executeSave();
    }
}

function resetTalents() {
    const cost = honey * 0.1;
    if(confirm(`Deseja resetar todos os talentos? Custo: ${formatNum(cost)} 🍯`)) {
        honey -= cost;
        talentPoints = level; 
        for(let k in talents) talents[k] = 0;
        document.getElementById("tree_clicks").innerHTML = "";
        document.getElementById("tree_auto").innerHTML = "";
        document.getElementById("tree_luck").innerHTML = "";
        updateUI();
        executeSave();
        notify({n: "Árvore Resetada!", d: "Distribua seus pontos novamente."});
    }
}

function buyHangar(id) {
    const cost = HANGAR_COSTS[id];
    if(honey >= cost) {
        honey -= cost;
        hangarsCount = id + 1;
        notify({n: "HANGAR ADQUIRIDO! 🛸", d: `Espaço #${id+1} liberado.`});
        updateUI();
        executeSave();
    }
}

function startExpedition(hangarId) {
    const exp = expeditions[hangarId];
    if(exp.active || exp.finished) return;
    
    const slider = document.getElementById(`expSlider_${hangarId}`);
    const durSelect = document.getElementById(`expDuration_${hangarId}`);
    if(!slider || !durSelect) return;

    const perc = parseInt(slider.value);
    
    let currentOccupiedTotal = expeditions.reduce((acc, curr) => acc + (curr.active ? curr.reductionPerc : 0), 0);
    if(currentOccupiedTotal + perc > 95) {
        notify({n: "LIMITE DE ABELHAS! ⚠️", d: "O enxame não suporta mais voos."});
        return;
    }

    const baseDuration = parseInt(durSelect.value);
    const proficiencyBonus = Math.min(0.20, (exp.uses || 0) * 0.005); 
    exp.duration = baseDuration * (1 - proficiencyBonus);
    
    exp.active = true;
    exp.reductionPerc = perc;
    exp.startTime = Date.now();
    exp.eventChance = 0;
    exp.uses = (exp.uses || 0) + 1;

    notify({n: "DECOLAGEM REAL!", d: `Hangar #${hangarId+1} em missão.`});
    updateUI();
    executeSave();
}

function buyHiveModule(module) {
    const cost = HIVE_COSTS[module];
    if(honey >= cost) {
        honey -= cost;
        hiveOwned[module] = true;
        notify({n: "ESTRUTURA EXPANDIDA! 🏠", d: `Módulo ${module} instalado.`});
        updateUI();
        executeSave();
    }
}

function upgradeQueenFertility() {
    const cost = (queenProductionLevel + 1) * 750000;
    if(queenProductionLevel >= 7) return;
    if(honey >= cost) {
        honey -= cost;
        queenProductionLevel++;
        notify({n: "RAINHA NUTRIDA! 👑", d: `Limite de abelhas: ${800 + (queenProductionLevel * 200)}`});
        updateUI();
        executeSave();
    }
}

function finishExpedition(hangarId) {
    const exp = expeditions[hangarId];
    exp.active = false;
    exp.finished = true;
    
    const maxHive = 800 + (hiveOwned.middle?800:0) + (hiveOwned.top?800:0);
    const prodLimit = 800 + (queenProductionLevel * 200);
    const effectivePop = Math.min(maxHive, prodLimit);
    
    const power = (hPerClick * exp.reductionPerc * (effectivePop / 2));
    let hGain = power;
    let xGain = hGain * 0.15;
    let msg = "";

    if(Math.random() < 0.05) {
        const type = Math.random() < 0.5 ? 'jelly' : 'magnet';
        activeBoosts[type] += 1200;
        msg += "🎁 ENCONTROU UM BAÚ REAL!<br>";
    }

    if(exp.biome === 'clover') hGain *= 0.8;
    else if(exp.biome === 'pepper') hGain *= 1.5;
    else if(exp.biome === 'orchard') xGain *= 2;

    msg += `<b>RECOMPENSAS:</b><br>🍯 ${formatNum(hGain)} | ✨ ${formatNum(xGain)}`;
    exp.pendingRewards = {h: hGain, x: xGain, msg: msg};
    updateUI();
    executeSave();
}

function collectExpeditionRewards(hangarId) {
    const exp = expeditions[hangarId];
    if(exp.pendingRewards) {
        honey += exp.pendingRewards.h;
        addXP(exp.pendingRewards.x);
        notify({n: "Carga Coletada!", d: `Hangar livre.`});
    }
    exp.finished = false;
    exp.pendingRewards = null;
    updateUI();
    executeSave();
}

function spawnFloatingNumber(amount, isTarget, isSuperCritical) { const bee = document.getElementById("mainBeeSprite"); if(!bee) return; const rect = bee.getBoundingClientRect(); const centerX = rect.left + (rect.width / 2), centerY = rect.top + (rect.height / 2); const container = document.createElement("div"); container.className = "floating-num-container"; const numEl = document.createElement("div"); numEl.className = "floating-num"; numEl.textContent = `+${formatNum(amount)}`; if(isSuperCritical) { numEl.style.color = "#ff4757"; numEl.style.fontSize = "38px"; const label = document.createElement("div"); label.className = "super-critical-label"; label.textContent = "SORTE REAL! (5x)"; container.appendChild(numEl); container.appendChild(label); } else if(isTarget) { numEl.style.color = "#ffcc00"; numEl.style.fontSize = "32px"; container.appendChild(numEl); } else container.appendChild(numEl); container.style.left = `${centerX}px`; container.style.top = `${centerY}px`; document.body.appendChild(container); setTimeout(() => container.remove(), 800); }

function spawnHoneyParticles(isSuperCritical) { const bee = document.getElementById("mainBeeSprite"); if(!bee) return; const rect = bee.getBoundingClientRect(); const centerX = rect.left + (rect.width / 2), centerY = rect.top + (rect.height / 2); const count = isSuperCritical ? 20 : 8; for(let i=0; i<count; i++) { const p = document.createElement("div"); p.className = "honey-particle"; if(isSuperCritical) p.style.background = "#ff4757"; p.style.left = `${centerX}px`; p.style.top = `${centerY}px`; const tx = (Math.random() - 0.5) * (isSuperCritical ? 300 : 180), ty = (Math.random() - 0.5) * (isSuperCritical ? 300 : 180); p.style.setProperty('--tx', `${tx}px`); p.style.setProperty('--ty', `${ty}px`); document.body.appendChild(p); setTimeout(() => p.remove(), 500); } }

function triggerImpact(isTarget, isSuperCritical) { const card = document.getElementById("clickCard"), stats = document.getElementById("statsCard"); if(!card || !stats) return; let scaleC = isSuperCritical ? 0.90 : (isTarget ? 0.96 : 0.98); card.style.transform = isTarget ? `scale(${scaleC}) rotate(2deg)` : `scale(${scaleC}) translateY(2px)`; stats.style.transform = `scale(${isSuperCritical ? 1.10 : 1.01})`; setTimeout(() => { card.style.transform = "scale(1) rotate(0deg)"; stats.style.transform = "scale(1)"; }, isSuperCritical ? 150 : 50); }

function doClick(event, isTarget = false) { 
    if (gameLoaded && !checkFullscreenState()) requestFullscreen();
    playClickSound(); 
    let baseChance = 0.001 + (talents.alquimista_sorte * 0.01); 
    if(equippedCosmetic === "SkullBee") baseChance += 0.05; 
    if(equippedCosmetic === "FairyBee") baseChance += 0.06;
    if(activeBoosts.luck > 0) baseChance *= 2; 

    const superCriticalChance = Math.random() < baseChance; 
    let multiplier = (isTarget ? (2 + talents.operario_critico*0.1) : 1) * (superCriticalChance ? 5 : 1); 
    
    let totalReduction = expeditions.reduce((acc, curr) => acc + (curr.active ? curr.reductionPerc : 0), 0);
    let expMult = (100 - Math.min(95, totalReduction)) / 100; 

    let clickVal = hPerClick;
    if(activeBoosts.jelly > 0) clickVal *= 2;

    const g = clickVal * getGlobalBonus() * multiplier * expMult; 
    honey = validateNum(honey + g); 
    totalHoneyEver = validateNum(totalHoneyEver + g); 
    addXP(g); 
    updateMissionProgress('honey_gain', g); 
    if(isTarget) updateMissionProgress('target_clicks', 1); 
    else updateMissionProgress('clicks', 1); 

    const bee = document.getElementById("beeContainer"); 
    if(bee) { 
        bee.style.transform = superCriticalChance ? "scale(0.60)" : "scale(0.80)"; 
        setTimeout(() => bee.style.transform = "scale(1)", 50); 
    } 
    spawnFloatingNumber(g, isTarget, superCriticalChance); 
    spawnHoneyParticles(superCriticalChance); 
    triggerImpact(isTarget, superCriticalChance); 
    clickBuffer.push(Date.now()); 
    spawnFlake('gameSnowContainer'); 
    updateUI(); 
}

function triggerLevelUpCelebration() { soundLvlUp.currentTime = 0; soundLvlUp.play().catch(() => {}); notify({n:`Nível Real ${level}!`, d:"+1 Ponto de Talento"}); const card = document.getElementById("statsCard"); if(card) { card.classList.add("lvl-up-flash"); setTimeout(() => card.classList.remove("lvl-up-flash"), 1000); } spawnLevelUpFireworks(); }

function spawnLevelUpFireworks() { const count = 30; const colors = ['#ffcc00', '#ffffff', '#fffa65', '#fff200']; for(let i=0; i<count; i++) { const p = document.createElement("div"); p.className = "honey-particle"; p.style.background = colors[Math.floor(Math.random() * colors.length)]; p.style.width = (Math.random() * 10 + 5) + "px"; p.style.height = p.style.width; p.style.left = "50vw"; p.style.top = "50vh"; p.style.boxShadow = "0 0 10px gold"; const angle = Math.random() * Math.PI * 2; const velocity = Math.random() * 400 + 200; const tx = Math.cos(angle) * velocity; const ty = Math.sin(angle) * velocity; p.style.setProperty('--tx', `${tx}px`); p.style.setProperty('--ty', `${ty}px`); document.body.appendChild(p); setTimeout(() => p.remove(), 1000); } }

function buyBoostManual(type, ticks, cost, label) { 
    cost = validateNum(cost); 
    if(honey >= cost) { 
        honey = validateNum(honey - cost); 
        let durationBonus = 1 + (talents.alquimista_boost * 0.1);
        activeBoosts[type] += (ticks * durationBonus); 
        notify({n: "Consumível Ativado!", d: `+${label}`}); 
        updateUI(); 
        executeSave(); 
    } 
}

function startAutoProducing() { if(autoProduceInterval) clearInterval(autoProduceInterval); autoProduceInterval = setInterval(() => { if(autoUnlocked){ let gain = getMPSBase() * getGlobalBonus(); honey = validateNum(honey + gain); totalHoneyEver = validateNum(totalHoneyEver + gain); addXP(gain); updateMissionProgress('honey_gain', gain); } }, 1000); }

function startGameTicks() { 
    if(gameTickInterval) clearInterval(gameTickInterval); 
    gameTickInterval = setInterval(() => { 
        if(!gameLoaded) return; 
        const now = Date.now(); 
        achievements.forEach(a => { if(!a.u && totalHoneyEver >= a.target){ a.u = true; notify(a); executeSave(); } }); 
        for(let b in activeBoosts) if(activeBoosts[b] > 0) activeBoosts[b]--; 
        for(let b in activeBoosts) { 
            const el = document.getElementById(`status_${b}`); 
            if(el) el.textContent = activeBoosts[b] > 0 ? `Ativo: ${formatTime(activeBoosts[b])}` : "Inativo"; 
        } 
        if(now % 1000 < 150) { 
            updateUI(); 
            checkMissionReset(); 
            updateMissionProgress('play_time', 1); 
            tickExpedition(); 
            handleMagnetEffect(); 
        } 
    }, 100); 
}

function executeSave(){ const data = {honey: validateNum(honey), favorReal: validateNum(favorReal), totalHoneyEver: validateNum(totalHoneyEver), level, currentXP, nextLevelXP, talents, talentPoints, activeBoosts, equippedCosmetic, equippedBackground, hiveOwned, queenProductionLevel, achs: achievements.map(a => a.u), timestamp: Date.now(), defenderProgress, pendingOfflineHoney, pendingOfflineXP, hangarsCount, expeditions, ownedCosmetics}; localStorage.setItem(SAVE_KEY, JSON.stringify(data)); const missionData = {dailyMissions, lastMissionReset}; localStorage.setItem(MISSION_KEY, JSON.stringify(missionData)); localStorage.setItem(THEME_KEY, JSON.stringify(themeSettings)); localStorage.setItem(DAILY_REWARD_KEY, JSON.stringify(dailyState)); const indicator = document.getElementById("saveIndicator"); if(indicator) { indicator.classList.add("visible"); setTimeout(() => indicator.classList.remove("visible"), 1000); } }

function checkOfflineGains(lastTimestamp) { 
    const now = Date.now(); const diffInSeconds = Math.floor((now - lastTimestamp) / 1000); 
    if (diffInSeconds < 60 && pendingOfflineHoney <= 0) return; 
    const offlineBoost = 0.7 + (talents.arquiteto_offline * 0.05);
    const mps = getMPSBase() * getGlobalBonus(); 
    const calculatedHoney = Math.floor(mps * diffInSeconds * offlineBoost); 
    const calculatedXP = Math.floor(calculatedHoney * 0.2); 
    pendingOfflineHoney += calculatedHoney; pendingOfflineXP += calculatedXP; 
}

function collectOfflineRewards() { honey = validateNum(honey + pendingOfflineHoney); totalHoneyEver = validateNum(totalHoneyEver + pendingOfflineHoney); addXP(pendingOfflineXP); pendingOfflineHoney = 0; pendingOfflineXP = 0; closeModal('offlineModal'); updateUI(); executeSave(); checkDailyLogic(); }

function checkDailyLogic() { const now = new Date(); const todayStr = now.toDateString(); const lastStr = new Date(dailyState.lastClaim).toDateString(); if (todayStr !== lastStr) { const diffTime = now.getTime() - dailyState.lastClaim; const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); if (diffDays > 1) dailyState.streak = 0; dailyState.claimedToday = false; renderDailyGrid(); openModal('dailyRewardModal'); } }

function renderDailyGrid() { const grid = document.getElementById('dailyGrid'); if(!grid) return; grid.innerHTML = ""; dailyCycle.forEach((item, i) => { let status = i < dailyState.streak ? 'claimed' : (i === dailyState.streak ? 'active' : ''); let valText = item.type === 'honey' ? formatNum(item.val) : (item.type === 'xp' ? formatNum(item.val) + 'xp' : item.label); grid.innerHTML += `<div class="day-card ${status}"><span class="day-num">DIA ${i+1}</span><span class="day-icon">${item.icon}</span><span class="day-reward-val">${valText}</span></div>`; }); const claimBtn = document.getElementById('btnClaimDaily'); if(claimBtn) { claimBtn.disabled = dailyState.claimedToday; claimBtn.textContent = dailyState.claimedToday ? "COLETADO HOJE" : "RESGATAR HOJE"; } }

function claimDailyReward() { if (dailyState.claimedToday) return; const reward = dailyCycle[dailyState.streak]; if (reward.type === 'honey') honey += reward.val; else if (reward.type === 'xp') addXP(reward.val); else if (reward.type === 'boost' || reward.type === 'super') { if (reward.val) honey += reward.val; activeBoosts[reward.boost] += reward.ticks; } dailyState.lastClaim = Date.now(); dailyState.streak = (dailyState.streak + 1) % 7; dailyState.claimedToday = true; notify({n: "Recompensa Diária!", d: "Prêmio resgatado"}); updateUI(); executeSave(); renderDailyGrid(); setTimeout(() => closeModal('dailyRewardModal'), 800); }

function handleCosmetic(id) {
    if(!ownedCosmetics.includes(id)) {
        let price = id === "FairyBee" ? 250000 : 100000;
        if(honey >= price) {
            honey -= price;
            ownedCosmetics.push(id);
            notify({n: "Visual Adquirido!", d: id});
        } else {
            notify({n: "Mel Insuficiente!", d: formatNum(price) + " 🍯 necessários"});
            return;
        }
    }
    equippedCosmetic = id;
    updateUI();
    executeSave();
}

function handleBackground(id) { equippedBackground = id; updateUI(); executeSave(); }

function load(){ 
    initAchievements(); 
    const savedAudio = localStorage.getItem(AUDIO_KEY); if(savedAudio) audioSettings = JSON.parse(savedAudio); applyAudioSettings(); 
    const savedTheme = localStorage.getItem(THEME_KEY); if(savedTheme) { themeSettings = JSON.parse(savedTheme); applyTheme(); } 
    const savedRecords = localStorage.getItem(RECORDS_KEY); if(savedRecords) records = JSON.parse(savedRecords); 
    const savedDaily = localStorage.getItem(DAILY_REWARD_KEY); if(savedDaily) dailyState = JSON.parse(savedDaily); 
    const rawMissions = localStorage.getItem(MISSION_KEY); if(rawMissions) { const md = JSON.parse(rawMissions); dailyMissions = md.dailyMissions || []; lastMissionReset = md.lastMissionReset || 0; } 
    const raw = localStorage.getItem(SAVE_KEY); 
    if(raw){ 
        try { 
            const d = JSON.parse(raw); 
            honey = validateNum(d.honey); favorReal = validateNum(d.favorReal || 0); totalHoneyEver = validateNum(d.totalHoneyEver); level = d.level || 1; 
            currentXP = validateNum(d.currentXP); nextLevelXP = validateNum(d.nextLevelXP) || 1000; 
            if(d.talents) talents = d.talents; if(d.talentPoints !== undefined) talentPoints = d.talentPoints;
            if(d.queenProductionLevel !== undefined) queenProductionLevel = d.queenProductionLevel;
            if(d.hangarsCount) hangarsCount = d.hangarsCount; if(d.expeditions) expeditions = d.expeditions;
            if(d.ownedCosmetics) ownedCosmetics = d.ownedCosmetics; if(d.activeBoosts) activeBoosts = d.activeBoosts; 
            if(d.equippedCosmetic) equippedCosmetic = d.equippedCosmetic; if(d.equippedBackground) equippedBackground = d.equippedBackground; 
            if(d.hiveOwned) hiveOwned = d.hiveOwned;
            if(d.achs) d.achs.forEach((u, i) => { if(achievements[i]) achievements[i].u = u; }); 
            if(d.defenderProgress) defenderProgress = d.defenderProgress; 
            if(d.timestamp) checkOfflineGains(d.timestamp); 
        } catch(e) { console.error(e); } 
    } else { talentPoints = level; }
    checkMissionReset(); updateUI(); updateVersionDisplay(); checkUpdateStatus(); 
}

function enterGame() { 
    load(); tryPlayMusic(); requestFullscreen(); 
    const loadingScreen = document.getElementById("loadingScreen"); 
    const bar = document.getElementById("loadingBarFill"); 
    const bee = document.getElementById("loadingBeeImg"); 
    if(loadingScreen) loadingScreen.style.display = "flex"; 
    let progress = 0; 
    const interval = setInterval(() => { 
        progress += Math.random() * 5; if(progress > 100) progress = 100; 
        if(bar) bar.style.width = progress + "%"; if(bee) bee.style.left = progress + "%"; 
        if(progress === 100) { 
            clearInterval(interval); 
            setTimeout(() => { 
                if(loadingScreen) loadingScreen.style.display = "none"; 
                const startScreen = document.getElementById('startScreen'); const gameUI = document.getElementById('gameUI'); 
                if(startScreen) startScreen.style.display = 'none'; 
                if(gameUI) { gameUI.style.display = 'flex'; gameUI.style.opacity = '1'; } 
                gameLoaded = true; if(pendingOfflineHoney > 1000) openModal('offlineModal'); else checkDailyLogic(); 
                startGameTicks(); startAutoProducing(); updateUI(); startDynamicNotifications(); 
            }, 300); 
        } 
    }, 50); 
}