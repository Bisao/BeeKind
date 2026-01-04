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
            p += Math.random() * 6;
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
        const lvl = document.getElementById("lvlDisplay");
        const tP = document.getElementById("talentPoints");
        const mps = document.getElementById("mps");

        if (h) h.textContent = Math.floor(GameState.honey).toLocaleString();
        if (jars) jars.textContent = GameState.honeyJars;
        if (coins) coins.textContent = GameState.coins.toLocaleString();
        if (lvl) lvl.textContent = GameState.level;
        if (tP) tP.textContent = GameState.talentPoints;
        if (mps) mps.textContent = Economy.getMPS().toFixed(1);
        
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
                <div class="shop-info"><b>${item.toUpperCase()}</b><br><small>Nív: ${GameState.upgrades[item]}</small></div>
                <button onclick="UI.buyUpgrade('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>${cost.toLocaleString()} 🍯</button>
            `;
            cont.appendChild(div);
        }
    },

    handleCraft() {
        if (Economy.craftJar()) {
            this.updateStats();
            // Adicione feedback visual aqui se desejar
        }
    },

    handleSell() {
        if (Economy.sellJar()) {
            this.updateStats();
        }
    },

    buyUpgrade(item) {
        if (Economy.buyUpgrade(item)) {
            this.updateStats();
            this.renderShop();
        }
    },

    // ESTA FUNÇÃO CONTROLA A VISIBILIDADE DAS ABAS
    openTab(id) {
        // Esconde todas as abas e remove estado ativo
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(c => {
            c.classList.add("hidden");
            c.classList.remove("active");
        });

        // Mostra a aba clicada
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove("hidden");
            target.classList.add("active");
        }
    },

    toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.toggle("hidden");
    },

    backToMenu() {
        document.getElementById("gameUI").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
    }
};
