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
            p += Math.random() * 5;
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
                <div class="shop-info">
                    <b style="font-size: 1.2rem; color: var(--brown);">${item.toUpperCase()}</b><br>
                    <small>Nível: ${GameState.upgrades[item]}</small>
                </div>
                <button class="btn-play" style="width: auto; font-size: 1rem; padding: 10px 20px;" 
                    onclick="UI.buyUpgrade('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>
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
        // Encontra o botão correspondente pela lógica de string simples ou ID
        const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.id.includes(id));
        if(activeBtn) activeBtn.classList.add("active-tab");
    },

    handleCraft() { if (Economy.craftJar()) this.updateStats(); },
    handleSell() { if (Economy.sellJar()) this.updateStats(); },
    buyUpgrade(item) { if (Economy.buyUpgrade(item)) { this.updateStats(); this.renderShop(); } },
    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },
    backToMenu() { location.reload(); }
};
