const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    requestStart() {
        const start = document.getElementById("startScreen");
        const loading = document.getElementById("loadingScreen");
        start.style.transition = "0.8s cubic-bezier(0.1, 0, 0, 1)";
        start.style.opacity = "0";
        start.style.transform = "scale(1.2)";
        
        setTimeout(() => {
            start.classList.add("hidden");
            loading.classList.remove("hidden");
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
                setTimeout(() => this.finalizeLoading(), 400);
            }
            if (bar) bar.style.width = p + "%";
        }, 100);
    },

    finalizeLoading() {
        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("gameUI").classList.remove("hidden");
        this.init();
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
                <div>
                    <b style="font-size: 1.4rem;">${item.toUpperCase()}</b><br>
                    <small style="color: var(--h-dark)">Possui: ${GameState.upgrades[item]}</small>
                </div>
                <button class="buy-btn" onclick="UI.buyUpgrade('${item}')" 
                    ${GameState.honey < cost ? 'style="opacity:0.5; cursor:not-allowed"' : ''}>
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

    handleCraft() { if (Economy.craftJar()) this.updateStats(); },
    handleSell() { if (Economy.sellJar()) this.updateStats(); },
    buyUpgrade(item) { if (Economy.buyUpgrade(item)) { this.updateStats(); this.renderShop(); } },
    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },
    backToMenu() { location.reload(); }
};
