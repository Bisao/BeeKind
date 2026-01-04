function updateMgLiveBoostsVisual() {
    const container = document.getElementById("mgLiveBoosts");
    if(!container) return;
    container.innerHTML = "";
    fCollectedBoosts.forEach(b => {
        const span = document.createElement("span");
        span.className = "mg-live-boost-icon";
        span.textContent = b.icon;
        container.appendChild(span);
    });
    if(activeMG === 'defender' && dHasDoubleShot) {
        const span = document.createElement("span");
        span.className = "mg-live-boost-icon";
        span.textContent = "🔫";
        container.appendChild(span);
    }
}

function initDefender() {
    if(!defenderCanvas) return;
    defenderCanvas.width = 300; defenderCanvas.height = 300;
    dPlayerX = 135; dBullets = []; dEnemies = []; dEnemyBullets = []; dModDrops = []; dEnemyDir = 1; dEnemyTimer = 40; dMoving = 0; fCollectedBoosts = [];
    dHearts = 3; dFireCooldown = 0; dHasDoubleShot = false;
    updateDefenderHearts();
    
    const currentLevel = defenderProgress.level;
    for(let row=0; row<3; row++) {
        for(let col=0; col<6; col++) {
            let hp = 1;
            let type = 'common';
            if(currentLevel >= 4 && row === 0) {
                hp = 2;
                type = 'elite';
            }
            
            dEnemies.push({
                x: 30 + col*40, 
                y: 30 + row*35, 
                alive: true, 
                hp: hp,
                type: type,
                diving: false, 
                diveDir: 1, 
                diveSpeed: 2.5 + (currentLevel * 0.2), 
                baseY: 30 + row*35
            });
        }
    }
    
    if(mgInterval) clearInterval(mgInterval);
    mgInterval = setInterval(drawDefender, 20);

    if(dGameTimer) clearInterval(dGameTimer);
    dGameTimer = setInterval(() => {
        if(mgRunning && activeMG === 'defender') {
            dEnemyTimer--;
            const scoreVal = document.getElementById("mgCurrentScore");
            if(scoreVal) scoreVal.textContent = dEnemyTimer + "s";
            if(dEnemyTimer <= 0) finishMG();
        }
    }, 1000);
}

function updateDefenderHearts() {
    const el = document.getElementById("defenderHearts");
    if(el) el.textContent = "🐝".repeat(Math.max(0, dHearts));
}

function moveDefender(dir) { dMoving = (dir === 'LEFT' ? -1 : 1); }
function stopDefender() { dMoving = 0; }
function defenderFire() {
    if(!mgRunning || activeMG !== 'defender' || dFireCooldown > 0) return;
    
    if(dHasDoubleShot) {
        dBullets.push({x: dPlayerX + 5, y: 260});
        dBullets.push({x: dPlayerX + 25, y: 260});
    } else {
        dBullets.push({x: dPlayerX + 15, y: 260});
    }
    
    dFireCooldown = 25; 
    playClickSound();
}