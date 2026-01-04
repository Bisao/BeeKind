function syncPwaUI(state) {
    pwaState = state;
    const mainBtn = document.getElementById('pwaMainActionBtn');
    const configBtn = document.getElementById('btnPwaAction');
    const icon = document.getElementById('pwaIcon');

    if (state === 'install') {
        if(mainBtn) {
            mainBtn.style.display = 'flex';
            mainBtn.classList.remove('aura-pulse');
            icon.textContent = '📥';
        }
        if(configBtn) {
            configBtn.style.display = 'block';
            configBtn.innerHTML = 'BAIXAR APP (OFFLINE)';
        }
    } else if (state === 'update') {
        if(mainBtn) {
            mainBtn.style.display = 'flex';
            mainBtn.classList.add('aura-pulse');
            icon.textContent = '🔄';
        }
        if(configBtn) {
            configBtn.style.display = 'block';
            configBtn.innerHTML = 'ATUALIZAR JOGO AGORA';
        }
    }
}

function updateVersionDisplay() {
    const configDisplay = document.getElementById("configVersionDisplay");
    if(updateHistory.length > 0) {
        if(configDisplay) configDisplay.textContent = `BEEKIND v.${updateHistory[0].version}`;
    }
}

function renderChangelog() {
    const container = document.getElementById("changelogContent");
    if(!container) return;
    container.innerHTML = "";
    const recentUpdates = updateHistory.slice(0, 5);
    recentUpdates.forEach(update => {
        let blockHtml = `<div class="changelog-block"><div class="changelog-section-title">v${update.version} - ${update.title}</div><div class="changelog-list">`;
        update.changes.forEach(change => {
            let icon = "🔹";
            if(change.type === "add") icon = "🟢";
            if(change.type === "fix") icon = "🔵";
            if(change.type === "mod") icon = "🟡";
            blockHtml += `<div class="changelog-item"><span class="changelog-icon">${icon}</span><span>${change.text}</span></div>`;
        });
        blockHtml += `</div></div>`;
        container.innerHTML += blockHtml;
    });
}

function startMinigameActual(type) {
    activeMG = type;
    const overlay = document.getElementById("minigameOverlay");
    if(overlay) overlay.style.display = "flex";
    
    document.querySelectorAll('#mgResultScreen, #snakeCanvas, #flightCanvas, #rainCanvas, #defenderCanvas, #snakeControls, #flightControls, #defenderControls, #rainHearts, #defenderHearts, #flightHint').forEach(el => {
        if(el) el.style.display = "none";
    });

    const countdownEl = document.getElementById("mgCountdown");
    if(countdownEl) {
        countdownEl.style.display = "block";
        let count = 3; countdownEl.textContent = count;
        const countTimer = setInterval(() => {
            count--;
            if(count > 0) countdownEl.textContent = count;
            else if(count === 0) countdownEl.textContent = "GO!";
            else { clearInterval(countTimer); countdownEl.style.display = "none"; startMG(); }
        }, 800);
    }
}

function startMG() {
    mgScore = 0; 
    const scoreVal = document.getElementById("mgCurrentScore");
    if(scoreVal) scoreVal.textContent = "0"; 
    mgRunning = true;

    if(activeMG === 'snake') {
        const canv = document.getElementById("snakeCanvas");
        const cont = document.getElementById("snakeControls");
        if(canv) canv.style.display = "block";
        if(cont) cont.style.display = "grid";
        mgSpeed = 320; 
        initSnake();
    } else if(activeMG === 'flight') {
        const canv = document.getElementById("flightCanvas");
        const cont = document.getElementById("flightControls");
        const hint = document.getElementById("flightHint");
        if(canv) canv.style.display = "block";
        if(cont) cont.style.display = "block";
        if(hint) hint.style.display = "block";
        initFlight();
    } else if(activeMG === 'rain') {
        const canv = document.getElementById("rainCanvas");
        const hearts = document.getElementById("rainHearts");
        if(canv) canv.style.display = "block";
        if(hearts) hearts.style.display = "block";
        initRain();
    } else if(activeMG === 'defender') {
        const canv = document.getElementById("defenderCanvas");
        const cont = document.getElementById("defenderControls");
        const hearts = document.getElementById("defenderHearts");
        if(canv) canv.style.display = "block";
        if(cont) cont.style.display = "flex";
        if(hearts) hearts.style.display = "block";
        initDefender();
    }
}

function updateRecordsUI() {
    const rainR = document.getElementById("rainRecordDisplay");
    const snakeR = document.getElementById("snakeRecordDisplay");
    const flightR = document.getElementById("flightRecordDisplay");
    const defL = document.getElementById("defenderLevelDisplay");
    if(rainR) rainR.textContent = records.rain || 0;
    if(snakeR) snakeR.textContent = records.snake || 0;
    if(flightR) flightR.textContent = records.flight || 0;
    if(defL) defL.textContent = defenderProgress.level || 1;
}

function exitMinigame() { 
    clearInterval(mgInterval); mgRunning = false; 
    if(dGameTimer) clearInterval(dGameTimer);
    const overlay = document.getElementById("minigameOverlay");
    if(overlay) overlay.style.display = "none"; 
}

function notify(a) {
    notificationQueue.push({
        n: a.n,
        d: a.d ? a.d : ""
    });
    if (!isProcessingNotifs) {
        processNextNotification();
    }
}

function processNextNotification() {
    if (notificationQueue.length === 0) {
        isProcessingNotifs = false;
        return;
    }
    isProcessingNotifs = true;
    const currentNotif = notificationQueue.shift();
    const container = document.getElementById("notifContainer");
    if(!container) return;
    container.innerHTML = "";
    const div = document.createElement("div");
    div.className = "popup";
    div.textContent = `${currentNotif.n} ${currentNotif.d ? '(' + currentNotif.d + ')' : ''}`;
    container.appendChild(div);
    div.style.animation = "slideInNotif 8s ease-in-out forwards";
    setTimeout(() => {
        if(div) div.remove();
        processNextNotification();
    }, 8000);
}

function renderMissions() {
    const list = document.getElementById("missionsList"); if(!list) return; list.innerHTML = "";
    const sortedMissions = [...dailyMissions].sort((a, b) => { const scoreA = (a.completed && !a.collected) ? 0 : (!a.completed ? 1 : 2); const scoreB = (b.completed && !b.collected) ? 0 : (!a.completed ? 1 : 2); return scoreA - scoreB; });
    sortedMissions.forEach(m => {
        const perc = Math.min(100, (m.progress / m.target) * 100); const icon = m.collected ? '🎁' : (m.completed ? '✅' : getMissionIcon(m.type));
        let actionButton = '';
        if (m.completed && !m.collected) { actionButton = `<button onclick="collectMissionReward('${m.id}')" style="margin-top:8px; padding:8px; background:var(--xp-bar); font-size:12px; height:auto; box-shadow:0 3px 0 #2e7d32;">COLETAR RECOMPENSA</button>`; }
        else if (!m.completed) { actionButton = `<div class="mission-reroll-btn" onclick="openRerollConfirmation('${m.id}')" title="Trocar Missão">🔄</div>`; }
        list.innerHTML += `<div class="mission-card ${m.completed ? 'completed' : ''} ${m.collected ? 'collected' : ''}"><div style="font-size: 24px">${icon}</div><div style="flex: 1"><div style="font-weight: 900; font-size: 14px; color: inherit">${m.title}</div><div style="font-size: 11px; color: inherit; opacity: 0.6;">${m.desc}</div><div class="mission-reward-tag">Prêmio: ${m.rewardLabel}</div><div class="mission-progress-bar"><div class="mission-progress-fill" style="width: ${perc}%"></div></div>${actionButton}</div><div style="font-size: 10px; font-weight: 800; min-width: 50px; text-align: right; padding-right: 5px;">${formatNum(m.progress)}/${formatNum(m.target)}</div></div>`;
    });
}

function selectBiome(hangarId, biomeId) { 
    if(expeditions[hangarId].active || expeditions[hangarId].finished) return; 
    expeditions[hangarId].biome = biomeId;
    renderHangars();
}

function handleExpEvent(hangarId) {
    const exp = expeditions[hangarId];
    if(!exp.active || exp.eventChance === 0) return;
    if(exp.eventChance === 1) { notify({n: "VESPAS AFASTADAS! 🛡️", d: "A missão continua segura!"}); exp.eventChance = 0; }
    else if(exp.eventChance === 2) { exp.startTime -= 30000; notify({n: "VENTO FAVORÁVEL! 🌬️", d: "Redução de 30s aplicada"}); exp.eventChance = 0; }
    renderHangars();
}

function renderActiveBoosts() { 
    const container = document.getElementById("active-boosts"); 
    if(!container) return; 
    container.innerHTML = ""; 
    const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀', crown: '👑', jelly: '🧪', magnet: '🧲' }; 
    
    if(equippedCosmetic === "NoelBee") {
        const div = document.createElement("div");
        div.className = "active-boost-timer active-boost-passive";
        div.innerHTML = `<span>🎄</span> <span>10%</span>`;
        container.appendChild(div);
    }
    if(equippedCosmetic === "SkullBee") {
        const div = document.createElement("div");
        div.className = "active-boost-timer active-boost-passive";
        div.innerHTML = `<span>💀</span> <span>5%</span>`;
        container.appendChild(div);
    }
    if(equippedCosmetic === "FairyBee") {
        const div = document.createElement("div");
        div.className = "active-boost-timer active-boost-passive";
        div.innerHTML = `<span>✨</span> <span>6%</span>`;
        container.appendChild(div);
    }

    for(let key in activeBoosts) if(activeBoosts[key] > 0) { 
        const div = document.createElement("div"); 
        div.className = "active-boost-timer"; 
        div.innerHTML = `<span>${icons[key]}</span> <span>${formatTime(activeBoosts[key])}</span>`; 
        container.appendChild(div); 
    } 
}

function openModal(id) { const modal = document.getElementById(id); if(!modal) return; modal.style.display = 'flex'; if(id === 'missionsModal') renderMissions(); if(id === 'dailyRewardModal') renderDailyGrid(); }
function closeModal(id) { const modal = document.getElementById(id); if(modal) modal.style.display = 'none'; }
function openTab(id, btn) { 
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active')); document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
    const pane = document.getElementById(id); if(pane) pane.classList.add('active'); if(btn) btn.classList.add('active'); 
    if(id === 'achievements') renderAchs(); if(id === 'hive-stats') renderHiveStats(); if(id === 'talents') renderTalentTree();
}