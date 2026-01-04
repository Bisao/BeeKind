const Economy = {
    costs: { colhedora: 15, jardim: 150 },
    
    CRAFT_COST: 700,
    JAR_SELL_PRICE: 50,

    getMPS() {
        return (GameState.upgrades.colhedora * 1) + (GameState.upgrades.jardim * 8);
    },

    getClickValue() {
        return 1 + (GameState.level * 0.5);
    },

    getUpgradeCost(type) {
        return Math.floor(this.costs[type] * Math.pow(1.15, GameState.upgrades[type]));
    },

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (GameState.honey >= cost) {
            GameState.honey -= cost;
            GameState.upgrades[type]++;
            GameState.save();
            return true;
        }
        return false;
    },

    // Processamento Industrial
    craftJar() {
        if (GameState.honey >= this.CRAFT_COST) {
            GameState.honey -= this.CRAFT_COST;
            GameState.honeyJars += 1;
            GameState.save();
            return true;
        }
        return false;
    },

    sellJar() {
        if (GameState.honeyJars >= 1) {
            GameState.honeyJars -= 1;
            GameState.coins += this.JAR_SELL_PRICE;
            GameState.save();
            return true;
        }
        return false;
    }
};
