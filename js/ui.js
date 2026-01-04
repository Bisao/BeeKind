const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    // Função de Loading Animado
    runLoading(callback) {
        let progress = 0;
        const bar = document.getElementById("loadingBar");
        const beeWrapper = document.querySelector(".loading-bee-wrapper");
        
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => callback(), 500);
            }
            bar.style.width = progress + "%";
            beeWrapper.style.left = progress + "%";
        }, 100);
    },

    startGame() {
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("gameUI").classList.remove("hidden");
    },

    backToMenu() {
        document.getElementById("startScreen").classList.remove("hidden");
        document.getElementById("gameUI").classList.add("hidden");
    },

    toggleModal(id) {
        document.getElementById(id).classList.toggle("hidden");
    },

    updateStats() {
        document.getElementById("honey").textContent = Math.floor(GameState.honey).toLocaleString();
        document.getElementById("mps").textContent = Economy.getMPS().toFixed(1);
        document.getElementById("lvlDisplay").textContent = GameState.level;
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        const fill = document.getElementById("xpFill");
        if(fill) fill.style.width = Math.min(100, perc) + "%";
    },

    renderShop() {
        const container = document.getElementById("shopList");
        if (!container) return;
        container.innerHTML = "";
        for (let item in Economy.baseCosts) {
            const cost = Economy.getUpgradeCost(item);
            const div = document.createElement("div");
            div.style = "background: #fff; border: 2px solid #FFB300; padding: 15px; margin-bottom: 10px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center;";
            div.innerHTML = `
                <div><b>${item.toUpperCase()}</b> (Nív. ${GameState.upgrades[item]})</div>
                <button onclick="UI.buy('${item}')" style="background:#FFB300; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" ${GameState.honey < cost ? 'disabled' : ''}>${cost} 🍯</button>
            `;
            container.appendChild(div);
        }
    },

    buy(item) {
        if (Economy.buyUpgrade(item)) {
            this.renderShop();
            this.updateStats();
        }
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add("hidden"));
        document.getElementById(id).classList.remove("hidden");
    }
};
