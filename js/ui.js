const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    // Ordem: 1. Chamado pela Tela Inicial
    requestStart() {
        const start = document.getElementById("startScreen");
        const loading = document.getElementById("loadingScreen");
        
        if (start && loading) {
            start.classList.add("hidden");
            loading.classList.remove("hidden");
            this.runLoading();
        }
    },

    // Ordem: 2. Gerencia a barra de progresso (Mel)
    runLoading() {
        let p = 0;
        const bar = document.getElementById("loadingBar");
        const bee = document.querySelector(".loading-bee-wrapper");
        
        const interval = setInterval(() => {
            p += Math.random() * 5; // Simula velocidade de carregamento
            
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(() => this.finalizeLoading(), 500);
            }
            
            if (bar) bar.style.width = p + "%";
            if (bee) bee.style.left = p + "%";
        }, 80);
    },

    // Ordem: 3. Mostra a tela de jogo
    finalizeLoading() {
        const loading = document.getElementById("loadingScreen");
        const game = document.getElementById("gameUI");
        
        if (loading) loading.classList.add("hidden");
        if (game) {
            game.classList.remove("hidden");
            this.init();
        }
    },

    backToMenu() {
        document.getElementById("gameUI").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
        const bar = document.getElementById("loadingBar");
        if (bar) bar.style.width = "0%";
    },

    toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.toggle("hidden");
    },

    resetGame() {
        if (confirm("Deseja apagar permanentemente todo seu mel e progresso?")) {
            localStorage.clear();
            location.reload();
        }
    },

    updateStats() {
        const h = document.getElementById("honey");
        const m = document.getElementById("mps");
        const l = document.getElementById("lvlDisplay");
        const t = document.getElementById("talentPoints");
        const f = document.getElementById("xpFill");

        if (h) h.textContent = Math.floor(GameState.honey).toLocaleString();
        if (m) m.textContent = Economy.getMPS().toFixed(1);
        if (l) l.textContent = GameState.level;
        if (t) t.textContent = GameState.talentPoints;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        if (f) f.style.width = Math.min(perc, 100) + "%";
    },

    renderShop() {
        const cont = document.getElementById("shopList");
        if (!cont) return;
        
        cont.innerHTML = "";
        for (let item in Economy.costs) {
            const cost = Economy.getCost(item);
            const level = GameState.upgrades[item];
            
            const div = document.createElement("div");
            div.className = "shop-item";
            div.innerHTML = `
                <div class="shop-info">
                    <b style="text-transform: capitalize;">${item}</b><br>
                    <small>Nível: ${level}</small>
                </div>
                <button onclick="UI.buyUpgrade('${item}')" 
                    ${GameState.honey < cost ? 'disabled' : ''}
                    class="buy-btn">
                    ${cost.toLocaleString()} 🍯
                </button>
            `;
            cont.appendChild(div);
        }
    },

    buyUpgrade(item) {
        if (Economy.buyUpgrade(item)) {
            this.updateStats();
            this.renderShop();
        }
    },

    openTab(id) {
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(c => c.classList.add("hidden"));
        const target = document.getElementById(id);
        if (target) target.classList.remove("hidden");
    }
};
