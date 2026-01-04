const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    updateStats() {
        document.getElementById("honey").textContent = Math.floor(GameState.honey);
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
            const btn = document.createElement("button");
            btn.className = "shop-item";
            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <b>${item.toUpperCase()}</b>
                    <span>Nív. ${GameState.upgrades[item]}</span>
                </div>
                <div style="color: #f3f315; margin-top: 5px;">Custo: ${cost} 🍯</div>
            `;
            btn.disabled = GameState.honey < cost;
            btn.onclick = () => {
                if (Economy.buyUpgrade(item)) {
                    this.renderShop();
                    this.updateStats();
                }
            };
            container.appendChild(btn);
        }
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};
