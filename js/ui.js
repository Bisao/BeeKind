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
        document.getElementById("xpFill").style.width = perc + "%";
    },

    renderShop() {
        const container = document.getElementById("shopList");
        container.innerHTML = "";
        
        for (let item in Economy.costs) {
            const cost = Math.floor(Economy.costs[item] * Math.pow(1.15, GameState.upgrades[item]));
            const btn = document.createElement("button");
            btn.className = "shop-item";
            btn.innerHTML = `${item.toUpperCase()} <br> Custo: ${cost} 🍯 (Possui: ${GameState.upgrades[item]})`;
            btn.onclick = () => {
                Economy.buyUpgrade(item);
                this.renderShop();
                this.updateStats();
            };
            container.appendChild(btn);
        }
    },

    notify(title, msg) {
        console.log(`${title}: ${msg}`);
    },

    openTab(id) {
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        document.getElementById(id).style.display = 'block';
    }
};