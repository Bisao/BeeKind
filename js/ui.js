const UI = {
    init() {
        this.updateStats();
        this.renderShop();
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
                    <b style="font-size: 1.1rem">${item.toUpperCase()}</b><br>
                    <small>Nível: ${GameState.upgrades[item]}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 20px">
                    <span style="font-weight: bold; color: var(--text-brown)">${cost} 🍯</span>
                    <button ${GameState.honey < cost ? 'disabled' : ''} onclick="UI.buy('${item}')">Comprar</button>
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
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(t => t.style.display = 'none');
        document.getElementById(id).style.display = 'block';
    }
};