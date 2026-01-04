const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    // Passo 1: Clicou em Play na Tela Inicial
    requestStart() {
        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("loadingScreen").classList.remove("hidden");
        this.runLoading();
    },

    // Passo 2: Animação de Carregamento
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

    // Passo 3: Entra no Jogo
    finalizeLoading() {
        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("gameUI").classList.remove("hidden");
        this.init();
    },

    backToMenu() {
        document.getElementById("gameUI").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
        // Reinicia a barra para um futuro loading
        document.getElementById("loadingBar").style.width = "0%";
    },

    toggleModal(id) { document.getElementById(id).classList.toggle("hidden"); },

    resetGame() {
        if (confirm("Apagar seu progresso permanentemente?")) {
            localStorage.clear();
            location.reload();
        }
    },

    updateStats() {
        document.getElementById("honey").textContent = Math.floor(GameState.honey).toLocaleString();
        document.getElementById("mps").textContent = Economy.getMPS().toFixed(1);
        document.getElementById("lvlDisplay").textContent = GameState.level;
        document.getElementById("talentPoints").textContent = GameState.talentPoints;
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        document.getElementById("xpFill").style.width = Math.min(perc, 100) + "%";
    },

    renderShop() {
        const cont = document.getElementById("shopList");
        cont.innerHTML = "";
        for (let item in Economy.costs) {
            const cost = Economy.getCost(item);
            const div = document.createElement("div");
            div.className = "shop-item";
            div.innerHTML = `
                <span><b>${item.toUpperCase()}</b> (Nív. ${GameState.upgrades[item]})</span>
                <button onclick="UI.buy('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>${cost} 🍯</button>
            `;
            cont.appendChild(div);
        }
    },

    buy(item) {
        if (Economy.buyUpgrade(item)) { this.init(); }
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add("hidden"));
        document.getElementById(id).classList.remove("hidden");
    }
};
