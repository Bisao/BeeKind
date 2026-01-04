const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    requestStart() {
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("loadingScreen").classList.remove("hidden");
        this.runLoading();
    },

    runLoading() {
        let p = 0;
        const bar = document.getElementById("loadingBar");
        const bee = document.querySelector(".loading-bee-wrapper");
        const interval = setInterval(() => {
            p += Math.random() * 4;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(() => this.finalizeLoading(), 500);
            }
            if (bar) bar.style.width = p + "%";
            if (bee) bee.style.left = p + "%";
        }, 80);
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
                <div class="shop-info"><b>${item.toUpperCase()}</b><br><small>Lvl: ${GameState.upgrades[item]}</small></div>
                <button onclick="UI.buyUpgrade('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>${cost} 🍯</button>
            `;
            cont.appendChild(div);
        }
    },

    // Handlers Industriais
    handleCraft() {
        if (Economy.craftJar()) this.updateStats();
    },

    handleSell() {
        if (Economy.sellJar()) this.updateStats();
    },

    buyUpgrade(item) {
        if (Economy.buyUpgrade(item)) {
            this.updateStats();
            this.renderShop();
        }
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add("hidden"));
        document.getElementById(id).classList.remove("hidden");
    },

    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },

    backToMenu() {
        document.getElementById("gameUI").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
    }
};
