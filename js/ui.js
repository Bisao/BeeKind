const UI = {
    init() {
        this.updateStats();
        this.renderShop();
        this.checkLogNotification();
    },

    requestStart() {
        document.getElementById("startScreen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("startScreen").classList.add("hidden");
            document.getElementById("loadingScreen").classList.remove("hidden");
            this.runLoading();
        }, 600);
    },

    runLoading() {
        let p = 0;
        const bar = document.getElementById("loadingBar");
        const interval = setInterval(() => {
            p += Math.random() * 8;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(() => this.finalizeLoading(), 500);
            }
            if (bar) bar.style.width = p + "%";
        }, 100);
    },

    finalizeLoading() {
        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("gameUI").classList.remove("hidden");
        this.init();
    },

    // Notificação do Botão de Log
    checkLogNotification() {
        const logBtn = document.getElementById("logBtn");
        if (logBtn && !GameState.hasSeenLogs) {
            logBtn.classList.add("pulsing-effect");
        }
    },

    // Abrir Logs e Gerenciar Atualizações
    openLogs() {
        GameState.hasSeenLogs = true;
        const logBtn = document.getElementById("logBtn");
        if (logBtn) logBtn.classList.remove("pulsing-effect");
        
        const logContainer = document.getElementById("logContent");
        if (logContainer) {
            logContainer.innerHTML = "";
            GameState.updateLogs.slice(0, 5).forEach(log => {
                const item = document.createElement("div");
                item.className = "log-item";
                item.textContent = log;
                logContainer.appendChild(item);
            });
        }
        this.toggleModal('logModal');
        GameState.save();
    },

    updateStats() {
        document.getElementById("honey").textContent = Math.floor(GameState.honey).toLocaleString();
        document.getElementById("jars").textContent = GameState.honeyJars;
        document.getElementById("coins").textContent = GameState.coins.toLocaleString();
        document.getElementById("lvlDisplay").textContent = GameState.level;
        document.getElementById("talentPoints").textContent = GameState.talentPoints;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        const fill = document.getElementById("xpFill");
        if (fill) fill.style.width = Math.min(perc, 100) + "%";
    },

    renderShop() {
        const cont = document.getElementById("shopList");
        if (!cont) return;
        cont.innerHTML = "";
        for (let item in Economy.costs) {
            const cost = Economy.getUpgradeCost(item);
            const div = document.createElement("div");
            div.className = "shop-item";
            div.innerHTML = `
                <div><b>${item.toUpperCase()}</b><br><small>Nível: ${GameState.upgrades[item]}</small></div>
                <button class="buy-btn" onclick="UI.buyUpgrade('${item}')" 
                    ${GameState.honey < cost ? 'style="opacity:0.4;"' : ''}>
                    ${cost.toLocaleString()} 🍯
                </button>
            `;
            cont.appendChild(div);
        }
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add("hidden"));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove("active-tab"));
        document.getElementById(id).classList.remove("hidden");
        const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.textContent.toLowerCase().includes(id.substring(0,3)));
        if (btn) btn.classList.add("active-tab");
    },

    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },
    handleCraft() { if (Economy.craftJar()) this.updateStats(); },
    handleSell() { if (Economy.sellJar()) this.updateStats(); },
    buyUpgrade(item) { if (Economy.buyUpgrade(item)) { this.updateStats(); this.renderShop(); } },
    resetGame() { if (confirm("Resetar TUDO?")) { localStorage.clear(); location.reload(); } }
};
