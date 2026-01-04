function createRainParticles(x, y, color, count) {
    for(let i=0; i<count; i++) {
        const p = document.createElement("div");
        p.className = "honey-particle";
        p.style.background = color;
        p.style.left = `calc(50vw - 150px + ${x}px)`;
        p.style.top = `calc(50vh - 150px + ${y}px)`;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 50 + 20;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 500);
    }
}

function createSingleMission(tmp, scaleFactor) {
    let target = 0;
    switch(tmp.type) {
        case 'clicks': target = Math.floor(Math.random() * (11000 - 8000 + 1)) + 8000; break;
        case 'target_clicks': target = 40 + (level * 2); break;
        case 'honey_gain': target = Math.floor(Math.random() * (40000 - 30000 + 1)) + 30000; break;
        case 'xp_gain': target = Math.ceil(tmp.baseGoal * scaleFactor * 3); break;
        case 'buy_upgrade': target = 3; break;
        case 'play_time': target = Math.ceil(tmp.baseGoal * (1 + level * 0.1)); break;
        case 'mg_item_collect': target = Math.ceil(tmp.baseGoal * (1 + level * 0.05)); break;
        case 'mg_kills': target = Math.ceil(tmp.baseGoal * (1 + level * 0.15)); break;
        case 'mg_boost_collect': target = Math.ceil(tmp.baseGoal); break;
        case 'mg_session_finished': target = Math.ceil(tmp.baseGoal); break;
    }
    const logBase = Math.max(1, Math.log10(hPerClick * 100));
    const rewardHoney = Math.max(target * (hPerClick * 2.5), 600) * tmp.rewardMult * logBase;
    const rewardXP = (nextLevelXP * 0.12) * tmp.rewardMult;
    
    return { 
        id: tmp.id + Date.now() + Math.random(), 
        type: tmp.type, 
        title: tmp.title, 
        desc: tmp.desc.replace("{target}", formatNum(target)), 
        target: target, 
        progress: 0, 
        completed: false, 
        collected: false, 
        rewardHoney: rewardHoney, 
        rewardXP: rewardXP, 
        rewardLabel: `${formatNum(rewardHoney)} 🍯 | ${formatNum(rewardXP)} XP` 
    };
}

function triggerCrownBonus() { activeBoosts.crown = 36000; notify({n: "MESTRE DA COLMEIA! 👑", d: "Bônus de 8x ATIVO por 1h!"}); }

function getMissionIcon(type) {
    switch(type) {
        case 'clicks': return '🐝'; case 'honey_gain': return '🍯'; case 'target_clicks': return '🎯'; case 'buy_upgrade': return '🚀'; case 'xp_gain': return '✨'; case 'play_time': return '⏳'; case 'mg_item_collect': return '🍎'; case 'mg_boost_collect': return '🥤'; case 'mg_kills': return '🔫'; case 'mg_session_finished': return '🎮'; default: return '📝';
    }
}

function formatTime(t) { let s = Math.ceil(t/10); if(s < 60) return s + "s"; let m = Math.floor(s/60); if(m < 60) return m + "m"; return Math.floor(m/60) + "h"; }

function getMPSBase() { 
    if(!autoUnlocked) return 0; 
    let base = (talents.arquiteto_mps * 2.5) + (level * 1.5);
    if(hiveOwned.middle) base *= 1.5;
    if(hiveOwned.top) base *= 2.0;
    if(activeBoosts.jelly > 0) base *= 2; 
    return base; 
}

function updateUI() {
    honey = validateNum(honey); 
    const honeyEl = document.getElementById("honey"); const mpsEl = document.getElementById("mps"); const lvlEl = document.getElementById("lvlDisplay"); const xpEl = document.getElementById("xpDisplay"); const xpFill = document.getElementById("xpFill");
    if(honeyEl) honeyEl.textContent = formatNum(honey); if(mpsEl) mpsEl.textContent = formatNum(getMPSBase() * getGlobalBonus()); if(lvlEl) lvlEl.textContent = level; if(xpEl) xpEl.textContent = `${formatNum(currentXP)} / ${formatNum(nextLevelXP)}`; if(xpFill) xpFill.style.width = `${Math.min(100, (currentXP / nextLevelXP) * 100)}%`;
    
    hPerClick = 0.2 + (talents.operario_forca * 0.5) + (level * 0.05);

    buildShop(); renderActiveBoosts(); updateRecordsUI(); renderTalentTree();
    updateDuduUI();

    ['Bee', 'NoelBee', 'SkullBee', 'FairyBee'].forEach(id => {
        const btn = document.getElementById(`btn_cos_${id}`); if(!btn) return;
        if(equippedCosmetic === id) { btn.innerHTML = `<img src="${id}.png" class="skin-preview"><b>EQUIPADO</b>`; btn.style.background = "var(--xp-bar)"; btn.style.color = "white"; const mainBee = document.getElementById("mainBeeSprite"); const headerBee = document.getElementById("miniBeeHeader"); if(mainBee) mainBee.src = `${id}.png`; if(headerBee) headerBee.src = `${id}.png`; }
        else { 
            let label = "Comum";
            if(id === "NoelBee") label = "Noel (+10%)";
            else if(id === "SkullBee") label = "Skull (+5% Crit)";
            else if(id === "FairyBee") label = "Fairy (+6% Luck)";
            btn.innerHTML = `<img src="${id}.png" class="skin-preview"><b>${label}</b>`; 
            btn.style.background = "rgba(255,255,255,0.05)"; btn.style.color = "inherit"; 
        }
    });
    const clickZone = document.getElementById("clickZone");
    ['BgPadrao', 'BgCristmas', 'BgRaining', 'BgNight', 'BgLake'].forEach(id => {
        const btn = document.getElementById(`btn_bg_${id}`); if(!btn) return;
        if(equippedBackground === id) { btn.style.background = "var(--accent)"; btn.style.color = "var(--main-blue)"; if(clickZone) clickZone.style.backgroundImage = `url('${id}.gif')`; }
        else { btn.style.background = "rgba(255,255,255,0.05)"; btn.style.color = "inherit"; }
    });
    checkUpdateStatus(); updateVersionDisplay(); renderHangars();
    const hivePane = document.getElementById("hive-stats");
    if(hivePane && hivePane.classList.contains("active")) renderHiveStats();
}

function updateDuduUI() {
    const favorEl = document.getElementById("favorRealDisplay");
    const estimateEl = document.getElementById("duduEstimate");
    const speechEl = document.getElementById("duduSpeech");
    const btnSell = document.getElementById("btnSellDudu");

    if(favorEl) favorEl.textContent = (favorReal * 100).toFixed(2) + "%";
    
    // O Favor Real cresce baseado no mel vendido em relação ao mel histórico
    // Logística: Vender 100% do mel histórico dobra o favor atual.
    let estimate = (honey / (Math.max(1000, totalHoneyEver) * 1.5)) * 0.20; // Estimativa de ganho de favor
    if(estimateEl) estimateEl.textContent = `Estimativa: +${(estimate * 100).toFixed(2)}% de Favor`;
    
    if(btnSell) btnSell.disabled = honey < 500;

    if(speechEl) {
        if(honey < 500) speechEl.textContent = "Volte quando tiver pelo menos 500 potes de mel!";
        else if (honey > totalHoneyEver * 0.1) speechEl.textContent = "Uau! Isso é muito mel. O rei vai adorar!";
        else speechEl.textContent = "Olá jovenzinho! Quer trocar esse mel por influência real?";
    }
}

function renderTalentTree() {
    const ptsDisplay = document.getElementById("talentPointsDisplay");
    if(ptsDisplay) ptsDisplay.textContent = `PONTOS DISPONÍVEIS: ${talentPoints}`;

    const treeData = [
        { tree: 'tree_clicks', key: 'operario_forca', name: 'Força Operária', icon: '💪', desc: '+0.5 Mel por Click' },
        { tree: 'tree_clicks', key: 'operario_critico', name: 'Foco Aguçado', icon: '🎯', desc: '+2% Chance Alvo Crítico' },
        { tree: 'tree_auto', key: 'arquiteto_mps', name: 'Engenharia de Mel', icon: '⚙️', desc: '+2.5 MPS Passivo Base' },
        { tree: 'tree_auto', key: 'arquiteto_offline', name: 'Estoques Noturnos', icon: '🌙', desc: '+5% Ganho Offline' },
        { tree: 'tree_luck', key: 'alquimista_sorte', name: 'Destino Real', icon: '🍀', desc: '+1% Sorte Real' },
        { tree: 'tree_luck', key: 'alquimista_boost', name: 'Essência Duradoura', icon: '🧪', desc: '+10% Duração Boosts' }
    ];

    treeData.forEach(t => {
        const cont = document.getElementById(t.tree);
        if(!cont) return;
        if(!document.getElementById(`talent_${t.key}`)) {
            cont.innerHTML += `
                <div class="talent-card" id="talent_${t.key}">
                    <div class="talent-icon">${t.icon}</div>
                    <div class="talent-info">
                        <div class="talent-name">${t.name}</div>
                        <div class="talent-desc">${t.desc}</div>
                    </div>
                    <div class="talent-points" id="val_${t.key}">0/20</div>
                    <button class="talent-btn" onclick="upgradeTalent('${t.key}')">+</button>
                </div>
            `;
        }
        const valEl = document.getElementById(`val_${t.key}`);
        if(valEl) valEl.textContent = `${talents[t.key]}/20`;
        const btn = document.querySelector(`#talent_${t.key} .talent-btn`);
        if(btn) btn.disabled = (talentPoints <= 0 || talents[t.key] >= 20);
    });
}

function onSliderChange(hangarId, newVal) {
    expeditions[hangarId].selectedPerc = parseInt(newVal);
    const label = document.getElementById(`expPercLabel_${hangarId}`);
    if(label) label.textContent = newVal + '%';
    recalculateHangarConstraints();
}

function recalculateHangarConstraints() {
    let currentOccupiedTotal = expeditions.reduce((acc, curr) => acc + (curr.active ? curr.reductionPerc : 0), 0);
    const PERCENT_LIMIT = 95;

    for(let i=0; i<4; i++) {
        const exp = expeditions[i];
        if(!exp.active && !exp.finished && i < hangarsCount) {
            const slider = document.getElementById(`expSlider_${i}`);
            if(slider) {
                let availableForThis = Math.max(0, PERCENT_LIMIT - currentOccupiedTotal);
                slider.max = availableForThis;
                if(parseInt(slider.value) > availableForThis) {
                    slider.value = availableForThis;
                    exp.selectedPerc = availableForThis;
                    const label = document.getElementById(`expPercLabel_${i}`);
                    if(label) label.textContent = availableForThis + '%';
                }
            }
        }
    }
}

function renderHangars() {
    const container = document.getElementById("hangarList");
    const synergyContainer = document.getElementById("synergyDisplay");
    if(!container) return;
    container.innerHTML = "";

    let biomesActive = new Set();
    expeditions.forEach(exp => { if(exp.active) biomesActive.add(exp.biome); });
    if(synergyContainer) {
        if(biomesActive.size >= 2) synergyContainer.innerHTML = `<div class="exp-synergy-tag">✨ SINERGIA DE BIOMAS: +${(biomesActive.size * 5)}% MEL GLOBAL ATIVO</div>`;
        else synergyContainer.innerHTML = "";
    }

    for(let i=0; i<4; i++) {
        const exp = expeditions[i];
        const isLocked = i >= hangarsCount;
        const hangarBox = document.createElement("div");
        hangarBox.className = "hangar-box";
        
        const profLevel = Math.floor((exp.uses || 0) / 10);
        let content = `<div class="hangar-title">HANGAR #${i+1} [Nív. ${profLevel}] ${isLocked ? '🔒' : ''}</div>`;
        
        if(isLocked) {
            const cost = HANGAR_COSTS[i];
            content += `<div class="hangar-lock">
                <button onclick="buyHangar(${i})" ${honey < cost ? 'disabled' : ''} style="font-size:12px; height:auto; padding:10px;">LIBERAR: ${formatNum(cost)} 🍯</button>
            </div>`;
        } else if(exp.finished) {
            content += `<div class="exp-result-inline" style="display:block;">
                <div style="font-size: 11px; text-align: center; margin-bottom: 8px;">${exp.pendingRewards.msg}</div>
                <button onclick="collectExpeditionRewards(${i})" style="background: var(--xp-bar); color: white; margin-top:0; height:auto; padding:8px;">COLETAR</button>
            </div>`;
        } else if(exp.active) {
            content += `<div style="text-align:center;">
                <span class="expedition-timer" id="expTimer_${i}">--:--</span>
                <div class="exp-event-area" id="expEventArea_${i}">
                    <button class="exp-event-btn" onclick="handleExpEvent(${i})" id="expEventBtn_${i}"></button>
                </div>
            </div>`;
        } else {
            let currentOccupiedTotal = expeditions.reduce((acc, curr) => acc + (curr.active ? curr.reductionPerc : 0), 0);
            let availableForThis = Math.max(0, 95 - currentOccupiedTotal);
            let safeSelectedPerc = Math.min(exp.selectedPerc || 50, availableForThis);

            content += `
                <div class="biome-selector">
                    <div class="biome-btn ${exp.biome==='clover'?'selected':''}" onclick="selectBiome(${i}, 'clover')"><span class="biome-icon">🍀</span><small>Trevo</small></div>
                    <div class="biome-btn ${exp.biome==='pepper'?'selected':''}" onclick="selectBiome(${i}, 'pepper')"><span class="biome-icon">🌶️</span><small>Pimenta</small></div>
                    <div class="biome-btn ${exp.biome==='orchard'?'selected':''}" onclick="selectBiome(${i}, 'orchard')"><span class="biome-icon">🍎</span><small>Pomar</small></div>
                </div>
                <select id="expDuration_${i}" style="width:100%; margin-top:8px; padding:8px; border-radius:10px; background:rgba(0,0,0,0.2); color:white; border:none; font-size:11px;">
                    <option value="300000">5 Minutos</option>
                    <option value="1800000">30 Minutos</option>
                    <option value="3600000">1 Hora</option>
                </select>
                <input type="range" id="expSlider_${i}" min="10" max="${availableForThis}" value="${safeSelectedPerc}" step="10" 
                    oninput="onSliderChange(${i}, this.value)">
                <div style="display:flex; justify-content:space-between; font-size:10px; margin-top:5px;">
                    <span>Enxame:</span> <b id="expPercLabel_${i}">${safeSelectedPerc}%</b>
                </div>
                <button onclick="startExpedition(${i})" style="background:var(--xp-bar); color:white; padding:10px; font-size:12px;">INICIAR 🚀</button>
            `;
        }
        
        hangarBox.innerHTML = content;
        container.appendChild(hangarBox);
    }
}

function renderHiveStats() {
    const container = document.getElementById("hiveStatsContent");
    if(!container) return;

    let maxQueen = 800 + (queenProductionLevel * 200);
    let maxHive = 800 + (hiveOwned.middle?800:0) + (hiveOwned.top?800:0);
    let effectiveMax = Math.min(maxQueen, maxHive);
    
    let nextProdCost = (queenProductionLevel + 1) * 750000;
    let totalOccupied = expeditions.reduce((acc, curr) => acc + (curr.active ? curr.reductionPerc : 0), 0);
    let rareAchs = achievements.filter(a => a.u && a.r === 'rare').length;
    let epicAchs = achievements.filter(a => a.u && a.r === 'epic').length;
    let skinBonus = Math.round((getSkinBonus() - 1) * 100);
    let totalGlobalMult = (getGlobalBonus()).toFixed(2);

    let boostsHtml = "";
    const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀', crown: '👑', jelly: '🧪', magnet: '🧲' };
    const names = { pepper: 'Mel 2x', energy: 'Vel 1.5x', flower: 'XP 3x', luck: 'Sorte 2x', crown: 'Rei 8x', jelly: 'Geleia 2x', magnet: 'Ímã Alvos' };
    
    for(let b in activeBoosts) {
        if(activeBoosts[b] > 0) {
            boostsHtml += `<div class="hive-stat-row"><div class="hive-stat-label">${icons[b]} ${names[b]}</div><div class="hive-stat-val" style="color:#fff;">${formatTime(activeBoosts[b])}</div></div>`;
        }
    }

    container.innerHTML = `
        <div class="modular-hive-container">
            <img src="HiveTop.png" class="hive-module ${!hiveOwned.top ? 'hive-module-hidden' : ''}">
            <img src="HiveMidle.png" class="hive-module ${!hiveOwned.middle ? 'hive-module-hidden' : ''}">
            <img src="HiveBase.png" class="hive-module">
        </div>

        <div id="hiveShopArea" style="margin-bottom: 20px;">
            ${!hiveOwned.middle ? `<button onclick="buyHiveModule('middle')" ${honey < HIVE_COSTS.middle ? 'disabled' : ''}>COMPRAR MEIO: ${formatNum(HIVE_COSTS.middle)} 🍯 (Cap. +800)</button>` : ''}
            ${hiveOwned.middle && !hiveOwned.top ? `<button onclick="buyHiveModule('top')" ${honey < HIVE_COSTS.top ? 'disabled' : ''}>COMPRAR TOPO: ${formatNum(HIVE_COSTS.top)} 🍯 (Cap. +800)</button>` : ''}
            
            <div class="section-title">NUTRIÇÃO DA RAINHA 🧪</div>
            <div class="card" style="margin-bottom: 10px; padding: 15px;">
                <div style="font-size: 12px; font-weight: 800; opacity: 0.7;">CAPACIDADE BIOLÓGICA</div>
                <div style="font-size: 24px; font-weight: 900; color: var(--accent);">${maxQueen} ABELHAS</div>
                ${queenProductionLevel < 7 ? 
                    `<button onclick="upgradeQueenFertility()" ${honey < nextProdCost ? 'disabled' : ''} style="font-size:12px; height:auto; padding:10px; background:var(--xp-bar); color:white;">
                        GELEIA REAL CONCENTRADA: ${formatNum(nextProdCost)} 🍯 (+200 abelhas)
                    </button>` : 
                    '<div style="font-size: 11px; color: gold; font-weight: 900; margin-top: 10px;">LIMITE REAL ALCANÇADO!</div>'}
            </div>
        </div>
        
        <div class="section-title">OCUPAÇÃO DO ENXAME 🐝</div>
        <div class="card" style="margin-bottom: 20px;">
            <div style="font-size: 32px; font-weight: 900; color: var(--accent);">${totalOccupied}%</div>
            <div style="font-size: 11px; opacity: 0.6; margin-top: 5px;">População ocupada em tarefas externas</div>
            <div class="xp-bg" style="margin-top: 15px;">
                <div class="xp-fill" style="width: ${(totalOccupied / 95) * 100}%; background: ${totalOccupied > 80 ? '#e74c3c' : 'var(--accent)'};"></div>
            </div>
        </div>

        <div class="section-title">EFICIÊNCIA REAL ✨</div>
        <div class="hive-stat-row"><div class="hive-stat-label">👴 Favor Real (Dudu)</div><div class="hive-stat-val" style="color: #4caf50;">+${(favorReal * 100).toFixed(2)}%</div></div>
        <div class="hive-stat-row"><div class="hive-stat-label">🛡️ Sorte Real Total</div><div class="hive-stat-val">${(0.1 + (talents.alquimista_sorte)*1.0).toFixed(2)}%</div></div>
        <div class="hive-stat-row"><div class="hive-stat-label">👔 Bônus de Visual</div><div class="hive-bonus-badge">+${skinBonus}%</div></div>

        <div class="section-title">RESERVAS TOTAIS 🍯</div>
        <div class="hive-stat-row"><div class="hive-stat-label">💰 Mel Histórico</div><div class="hive-stat-val">${formatNum(totalHoneyEver)}</div></div>
        <div class="hive-stat-row"><div class="hive-stat-label">📊 Multiplicador Global</div><div class="hive-stat-val" style="color: var(--xp-bar);">${totalGlobalMult}x</div></div>
        <div class="version-tag" style="margin-top: 30px;">DADOS SINCRONIZADOS COM A RAINHA ✅</div>
    `;
}

function openSubShop(id, btn) { document.querySelectorAll('.sub-shop-pane').forEach(p => p.style.display = 'none'); document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active')); const pane = document.getElementById('shop_'+id); if(pane) pane.style.display = 'block'; if(btn) btn.classList.add('active'); }
function setAchFilter(rarity, btn) { currentAchFilter = rarity; document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); if(btn) btn.classList.add('active'); renderAchs(); }

function buildShop() { 
    const inflationFactor = Math.max(1, Math.pow(hPerClick, 1.1) / 8); 
    ['pepper', 'energy', 'flower', 'luck'].forEach(type => { 
        const grid = document.getElementById(`grid_${type}`); if(!grid) return; grid.innerHTML = ""; 
        durations.forEach(d => { 
            const cost = validateNum(Math.floor(boostBases[type] * (1 + (level * 0.15)) * d.m * inflationFactor)); 
            const btn = document.createElement("button"); btn.className = "buy-btn-small"; btn.disabled = honey < cost; btn.innerHTML = `<b>${d.label}</b><br>${formatNum(cost)} 🍯`; btn.onclick = () => buyBoostManual(type, d.t, cost, d.label); grid.appendChild(btn); 
        }); 
    }); 
    ['jelly', 'magnet'].forEach(type => {
        const grid = document.getElementById(`grid_${type}`); if(!grid) return; grid.innerHTML = "";
        specialDurations.forEach(sd => {
            const cost = validateNum(Math.floor(boostBases[type] * (1 + (level * 0.2)) * sd.m * inflationFactor));
            const btn = document.createElement("button"); btn.className = "buy-btn-small"; btn.disabled = honey < cost; btn.innerHTML = `<b>${sd.label}</b><br>${formatNum(cost)} 🍯`; btn.onclick = () => buyBoostManual(type, sd.t, cost, sd.label); grid.appendChild(btn);
        });
    });
}