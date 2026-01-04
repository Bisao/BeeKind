const UI = {
    init() {
        this.updateStats();
        this.renderShop();
        this.checkLogNotification();
    },

    requestStart() {
        const start = document.getElementById("startScreen");
        if (start) {
            start.style.opacity = "0";
            setTimeout(() => {
                start.classList.add("hidden");
                document.getElementById("loadingScreen").classList.remove("hidden");
                this.runLoading();
            }, 500);
        }
    },

    runLoading() {
        let p = 0;
        const bar = document.getElementById("loadingBar");
        const interval = setInterval(() => {
            p += Math.random() * 10;
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

    // Notificação do Botão Cromático
    checkLogNotification() {
        const logBtn = document.getElementById("logBtn");
        if (logBtn && !GameState.hasSeenLogs) {
            logBtn.classList.add("pulsing-chromatic");
        }
    },

    // Painel de Logs Dinâmico
    openLogs() {
        GameState.hasSeenLogs = true;
        const logBtn = document.getElementById("logBtn");
        if (logBtn) logBtn.classList.remove("pulsing-chromatic");

        const logContent = document.getElementById("logContent");
        if (logContent) {
            logContent.innerHTML = "";
            // Mostra as últimas 5 atualizações
            GameState.updateLogs.slice(0, 5).forEach(text => {
                const div = document.createElement("div");
                div.className = "log-item";
                div.textContent = text;
                logContent.appendChild(div);
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
                    ${GameState.honey < cost ? 'style="opacity:0.4; pointer-events:none;"' : ''}>
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
        // Lógica para ativar o botão visualmente
        const btns = document.querySelectorAll('.tab-btn');
        btns.forEach(btn => {
            if(btn.innerText.toLowerCase().includes(id.substring(0,3))) btn.classList.add('active-tab');
        });
    },

    handleCraft() { if (Economy.craftJar()) this.updateStats(); },
    handleSell() { if (Economy.sellJar()) this.updateStats(); },
    buyUpgrade(item) { if (Economy.buyUpgrade(item)) { this.updateStats(); this.renderShop(); } },
    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },
    resetGame() { if (confirm("Resetar TUDO?")) { localStorage.clear(); location.reload(); } }
};
