const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    runLoading(onComplete) {
        let p = 0;
        const bar = document.getElementById("loadingBar");
        const bee = document.querySelector(".loading-bee-wrapper");
        
        const interval = setInterval(() => {
            p += Math.random() * 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(onComplete, 500);
            }
            if (bar) bar.style.width = p + "%";
            if (bee) bee.style.left = p + "%";
        }, 100);
    },

    startGame() {
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("gameUI").classList.remove("hidden");
        this.updateStats();
    },

    backToMenu() {
        document.getElementById("startScreen").classList.remove("hidden");
        document.getElementById("gameUI").classList.add("hidden");
    },

    toggleModal(id) {
        document.getElementById(id).classList.toggle("hidden");
    },

    resetGame() {
        if (confirm("Isso apagará todo seu mel e progresso! Deseja continuar?")) {
            localStorage.clear();
            location.reload();
        }
    },

    updateStats() {
        const honeyEl = document.getElementById("honey");
        const mpsEl = document.getElementById("mps");
        const lvlEl = document.getElementById("lvlDisplay");
        const fillEl = document.getElementById("xpFill");

        if (honeyEl) honeyEl.textContent = Math.floor(GameState.honey).toLocaleString();
        if (mpsEl) mpsEl.textContent = Economy.getMPS().toFixed(1);
        if (lvlEl) lvlEl.textContent = GameState.level;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        if (fillEl) fillEl.style.width = Math.min(100, perc) + "%";
    },

    renderShop() {
        const container = document.getElementById("shopList");
        if (!container) return;
        container.innerHTML = "";
        
        for (let item in Economy.costs) {
            const cost = Economy.getUpgradeCost(item);
            const div = document.createElement("div");
            div.className = "shop-item";
            div.style = "background: #fff; border: 2px solid #FFB300; padding: 15px; margin-bottom: 10px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 0 #FFECB3;";
            div.innerHTML = `
                <div>
                    <b style="color: #5D4037">${item.toUpperCase()}</b><br>
                    <small>Possui: ${GameState.upgrades[item]}</small>
                </div>
                <button onclick="UI.buy('${item}')" style="background:#FFB300; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; font-weight:bold; color:#5D4037;" ${GameState.honey < cost ? 'disabled' : ''}>
                    ${cost} 🍯
                </button>
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
