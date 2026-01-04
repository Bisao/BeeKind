function initRain() {
    if(!rainCanvas) return;
    rainCanvas.width = 300; rainCanvas.height = 300;
    rBeeX = 135; rBeeTargetX = 135; rDrops = []; rHearts = 3;
    rBeeSpeed = 2; rDropSpeed = 1.5; rSpawnTimer = 0; rBeeDirChangeTimer = 0; rBeeYOffset = 0;
    fCollectedBoosts = []; 
    updateRainHearts();
    rainCanvas.onclick = (e) => {
        if(!mgRunning) return;
        const rect = rainCanvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (300 / rect.width);
        const mouseY = (e.clientY - rect.top) * (300 / rect.height);
        rDrops.forEach((d, i) => {
            const dist = Math.sqrt((mouseX - d.x)**2 + (mouseY - d.y)**2);
            if(dist < 25) { 
                if(d.isBomb) {
                    rHearts--;
                    updateRainHearts();
                    createRainParticles(d.x, d.y, "#ff0000", 20); 
                    rDrops.splice(i, 1);
                    if(rHearts <= 0) finishMG();
                } else if(d.isBoost) { 
                    fCollectedBoosts.push({type: d.boostType, icon: d.boostIcon});
                    updateMgLiveBoostsVisual(); 
                    createRainParticles(d.x, d.y, "#ffffff", 15);
                    playClickSound();
                    rDrops.splice(i, 1);
                    updateMissionProgress('mg_boost_collect', 1);
                } else {
                    rDrops.splice(i, 1);
                    mgScore++;
                    updateMissionProgress('mg_item_collect', 1);
                    const scoreVal = document.getElementById("mgCurrentScore");
                    if(scoreVal) scoreVal.textContent = mgScore;
                    createRainParticles(d.x, d.y, "#ffcc00", 12); 
                    playClickSound();
                }
            }
        });
    };
    if(mgInterval) clearInterval(mgInterval);
    mgInterval = setInterval(drawRain, 20);
}

function updateRainHearts() {
    const el = document.getElementById("rainHearts");
    if(el) el.textContent = "❤️".repeat(Math.max(0, rHearts));
}