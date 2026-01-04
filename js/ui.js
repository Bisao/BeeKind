const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    // Inicia o jogo removendo a splash screen
    startGame() {
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("gameUI").style.display = "grid";
    },

    backToMenu() {
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("gameUI").style.display = "none";
    },

    toggleModal(id) {
        document.getElementById(id).classList.toggle("hidden");
    },

    resetGame() {
        if(confirm("Tem certeza? Isso apagará todo o seu mel e progresso!")) {
            localStorage.clear();
            location.reload();
        }
    },

    updateStats() {
        document.getElementById("honey").textContent = Math.floor(GameState.honey).toLocaleString();
        document.getElementById("mps").textContent = Economy.getMPS().toFixed(1);
        document.getElementById("lvlDisplay").textContent = GameState.level;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        document.getElementById("xpFill").style.width = Math.min(100, perc) + "%";
    },

    renderShop() {
        const container = document.getElementById("shopList");
        if (!container) return;
        container.innerHTML = "";
        
        for (let item in Economy.baseCosts) {
            const cost = Economy.getUpgradeCost(item);
            const div = document.createElement("div");
            div.className = "shop-item";
            div.innerHTML = `
                <div>
                    <b>${item.toUpperCase()}</b><br>
                    <small>Nível: ${GameState.upgrades[item]}</small>
                </div>
                <div>
                    <span style="margin-right: 15px">${cost} 🍯</span>
                    <button onclick="UI.buy('${item}')" ${GameState.honey < cost ? 'disabled' : ''}>Comprar</button>
                </div>
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
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        document.getElementById(id).style.display = 'block';
    }
};