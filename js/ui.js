const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    requestStart() {
        const start = document.getElementById("startScreen");
        const loading = document.getElementById("loadingScreen");
        if (start && loading) {
            start.classList.add("hidden");
            loading.classList.remove("hidden");
            this.runLoading();
        }
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
        const h = document.getElementById("honey");
        const jars = document.getElementById("jars");
        const coins = document.getElementById("coins");
        const m = document.getElementById("mps");
        const l = document.getElementById("lvlDisplay");
        const f = document.getElementById("xpFill");

        if (h) h.textContent = Math.floor(GameState.honey).toLocaleString();
        if (jars) jars.textContent = GameState.honeyJars;
        if (coins) coins.textContent = GameState.coins.toLocaleString();
        if (m) m.textContent = Economy.getMPS().toFixed(1);
        if (l) l.textContent = GameState.level;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        if (f) f.style.width = Math.min(perc, 100) + "%";
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
                <div class="shop-info"><b>${item.toUpperCase()}</b><br><small>Nív: ${GameState.upgrades[item]}</small></div>
                <button onclick="UI.buyUpgrade('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>${cost} 🍯</button>
            `;
            cont.appendChild(div);
        }
    },

    // Funções de interação de Craft/Venda
    handleCraft() {
        if (Economy.craftJar()) {
            this.updateStats();
            console.log("Pote engarrafado!");
        }
    },

    handleSell() {
        if (Economy.sellJar()) {
            this.updateStats();
            console.log("Pote vendido!");
        }
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

    toggleModal(id) {
        document.getElementById(id).classList.toggle("hidden");
    }
};
