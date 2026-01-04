function validateNum(n) {
    if (isNaN(n) || n === undefined || n === null || n < 0) return 0;
    return parseFloat(n);
}

function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function applyTheme() {
    const root = document.querySelector(':root');
    const color = themeSettings.mainColor;
    const opacity = themeSettings.opacity;
    const luminance = getLuminance(color);
    const textColor = luminance > 0.5 ? "#030d45" : "#ffffff";
    const accentColor = luminance > 0.8 ? "#e67e22" : "#ffcc00"; 
    const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
    const darken = 0.6;
    const rD = Math.floor(r * darken), gD = Math.floor(g * darken), bD = Math.floor(b * darken);
    root.style.setProperty('--main-blue', color);
    root.style.setProperty('--card-opacity', opacity);
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--accent', accentColor);
    root.style.setProperty('--card', `linear-gradient(145deg, rgba(${r}, ${g}, ${b}, ${opacity}), rgba(${rD}, ${gD}, ${bD}, 0.9))`);
    root.style.setProperty('--bg-gradient', `linear-gradient(180deg, ${color}, rgb(${rD}, ${gD}, ${bD}))`);
    const startScreen = document.getElementById('startScreen');
    if(startScreen) startScreen.style.background = `linear-gradient(180deg, ${color}, rgb(${rD}, ${gD}, ${bD}))`;
}

function initFlight() {
    if(!flightCanvas) return;
    flightCanvas.width = 300; flightCanvas.height = 300;
    fBeeY = 150; fVelocity = 0; fPipes = []; fBoosts = []; fCollectedBoosts = [];
    if(mgInterval) clearInterval(mgInterval); mgInterval = setInterval(drawFlight, 30);
}

function flightJump() { if(mgRunning && activeMG === 'flight') fVelocity = fJump; }

function spawnFlightBoost(x, gapY, gapH) {
    if(Math.random() > 0.7) return;
    const types = ['pepper', 'energy', 'flower', 'luck'];
    const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀' };
    const type = types[Math.floor(Math.random() * types.length)];
    fBoosts.push({
        x: x + 10,
        y: gapY + (gapH / 2) - 10,
        type: type,
        icon: icons[type]
    });
}

function drawFlight() {
    if(!flightCtx) return;
    fVelocity += fGravity; fBeeY += fVelocity;
    if(fBeeY < 0 || fBeeY > 285) { finishMG(); return; }
    if(fPipes.length === 0 || fPipes[fPipes.length-1].x < 150) {
        let gap = 110; let topH = Math.random() * (180 - gap) + 20;
        let newX = 350;
        fPipes.push({x: newX, topH: topH, gap: gap, passed: false, boostSpawned: false});
        if(mgScore > 0 && mgScore % 50 === 0 && !fPipes[fPipes.length-1].boostSpawned) {
             spawnFlightBoost(newX, topH, gap);
             fPipes[fPipes.length-1].boostSpawned = true;
        }
    }
    flightCtx.fillStyle = "#000"; flightCtx.fillRect(0, 0, 300, 300);
    if(beeSprite.complete) {
        flightCtx.drawImage(beeSprite, 40, fBeeY, 25, 25);
    }
    fPipes.forEach((p, i) => {
        p.x -= 3; flightCtx.fillStyle = "rgba(255,255,255,0.2)";
        flightCtx.fillRect(p.x, 0, 40, p.topH); flightCtx.fillRect(p.x, p.topH + p.gap, 40, 300);
        if(p.x < 65 && p.x + 40 > 40) if(fBeeY < p.topH || fBeeY + 20 > p.topH + p.gap) { finishMG(); return; }
        if(!p.passed && p.x < 40) { 
            p.passed = true; mgScore++; 
            updateMissionProgress('mg_item_collect', 1); 
            const scoreVal = document.getElementById("mgCurrentScore");
            if(scoreVal) scoreVal.textContent = mgScore; 
        }
    });
    fBoosts.forEach((b, i) => {
        b.x -= 3;
        flightCtx.font = "20px Arial";
        flightCtx.fillText(b.icon, b.x, b.y + 15);
        if(b.x < 65 && b.x + 20 > 40 && fBeeY < b.y + 20 && fBeeY + 20 > b.y) {
            fCollectedBoosts.push(b); 
            updateMgLiveBoostsVisual(); 
            updateMissionProgress('mg_boost_collect', 1);
            playClickSound();
            fBoosts.splice(i, 1);
        }
    });
    fPipes = fPipes.filter(p => p.x > -50);
    fBoosts = fBoosts.filter(b => b.x > -50);
}

function applyAudioSettings() {
    soundMusic.volume = (audioSettings.music || 50) / 100; 
    soundClick.volume = (audioSettings.click || 80) / 100; 
    soundLvlUp.volume = (audioSettings.lvlUp || 100) / 100;
    
    const musicIn = document.getElementById('musicVol');
    const musicLab = document.getElementById('musicVolLabel');
    if(musicIn) musicIn.value = audioSettings.music; 
    if(musicLab) musicLab.textContent = audioSettings.music + '%'; 
    
    const clickIn = document.getElementById('clickVol');
    const clickLab = document.getElementById('clickVolLabel');
    if(clickIn) clickIn.value = audioSettings.click; 
    if(clickLab) clickLab.textContent = audioSettings.click + '%'; 
    
    const lvlIn = document.getElementById('lvlUpVol');
    const lvlLab = document.getElementById('lvlUpVolLabel');
    if(lvlIn) lvlIn.value = audioSettings.lvlUp || 100;
    if(lvlLab) lvlLab.textContent = (audioSettings.lvlUp || 100) + '%';
}

function tryPlayMusic() {
    if(soundMusic.paused) soundMusic.play().then(() => { 
        window.removeEventListener('click', tryPlayMusic); 
        window.removeEventListener('touchstart', tryPlayMusic); 
    }).catch(() => {});
}

function playClickSound() { 
    soundClick.currentTime = 0; 
    soundClick.play().catch(() => {}); 
}

function checkFullscreenState() {
    const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    return !!isFS;
}

function requestFullscreen() {
    const doc = window.document, docEl = doc.documentElement;
    const request = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    
    if (request && !checkFullscreenState()) {
        request.call(docEl).catch(err => { 
            console.warn("Fullscreen negado ou bloqueado:", err.message); 
        });
    }
}

function generateDailyMissions() {
    dailyMissions = []; 
    const scaleFactor = Math.pow(level, 1.2);
    const shuffled = [...missionTemplates].sort(() => 0.5 - Math.random());
    for(let i=0; i<10; i++) { 
        const tmp = shuffled[i % shuffled.length]; 
        dailyMissions.push(createSingleMission(tmp, scaleFactor)); 
    }
}

function updateMissionAlertStatus() { 
    const hasRewardsToClaim = dailyMissions.some(m => m.completed && !m.collected); 
    const alertBtn = document.getElementById("btnMissionAlert"); 
    if(!alertBtn) return; 
    if (hasRewardsToClaim) alertBtn.classList.add("mission-alert"); 
    else alertBtn.classList.remove("mission-alert"); 
}

function formatNum(n) {
    n = validateNum(n); if (n >= 1e12) return (n/1e12).toFixed(2) + "T"; if (n >= 1e9) return (n/1e9).toFixed(2) + "B"; if (n >= 1e6) return (n/1e6).toFixed(1) + "M"; if (n >= 1000) return (n/1000).toFixed(1) + "K"; return parseFloat(n.toFixed(2)).toString();
}

function getSkinBonus() { 
    let bonus = 1.0;
    if(equippedCosmetic === "NoelBee") bonus = 1.10;
    return bonus;
}

function getGlobalBonus() {
    let r = achievements.filter(a => a.u && a.r === 'rare').length, e = achievements.filter(a => a.u && a.r === 'epic').length;
    let b = (1 + (r * 0.01) + (e * 0.05)) * getSkinBonus(); 
    if(activeBoosts.pepper > 0) b += 1; 
    if(activeBoosts.energy > 0) b += 0.5; 
    if(activeBoosts.crown > 0) b *= 8; 
    let biomesActive = new Set();
    expeditions.forEach(exp => { if(exp.active) biomesActive.add(exp.biome); });
    if(biomesActive.size >= 2) b += (biomesActive.size * 0.05); 
    
    // Adiciona o bônus do Favor Real do Velho Dudu
    b *= (1 + favorReal);

    return b;
}

function tickExpedition() {
    expeditions.forEach((exp, i) => {
        if(!exp.active) return;
        const now = Date.now();
        const elapsed = now - exp.startTime;
        const remaining = exp.duration - elapsed;
        
        if(remaining <= 0) finishExpedition(i);
        else {
            const timerEl = document.getElementById(`expTimer_${i}`);
            if(timerEl) {
                const m = Math.floor(remaining / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                timerEl.textContent = m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
            }
        }
    });
}

function addXP(amt) { 
    let m = ((activeBoosts.flower > 0) ? 3 : 1) * getSkinBonus(); 
    let xpGain = validateNum(amt * 0.15 * m); 
    currentXP = validateNum(currentXP + xpGain); 
    updateMissionProgress('xp_gain', xpGain); 
    while(currentXP >= nextLevelXP){ 
        currentXP = validateNum(currentXP - nextLevelXP); 
        level++; 
        talentPoints++; 
        nextLevelXP = Math.floor(nextLevelXP * 1.35); 
        triggerLevelUpCelebration(); 
    } 
}

function handleMagnetEffect() {
    if(activeBoosts.magnet <= 0) return;
    const lTarget = document.getElementById("leftTarget");
    const rTarget = document.getElementById("rightTarget");
    if(lTarget && rTarget) {
        lTarget.style.transform = "translateX(25px)";
        rTarget.style.transform = "translateX(-25px)";
    }
}