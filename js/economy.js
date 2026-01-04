const Economy = {
    costs: { colhedora: 15, jardim: 150 },
    CRAFT_COST: 700,
    SELL_PRICE: 50,

    getMPS() {
        return (GameState.upgrades.colhedora * 1.5) + (GameState.upgrades.jardim * 10);
    },

    getClickValue() {
        return 1 + (GameState.level * 0.5);
    },

    getUpgradeCost(type) {
        return Math.floor(this.costs[type] * Math.pow(1.18, GameState.upgrades[type]));
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

    craftJar() {
        if (GameState.honey >= this.CRAFT_COST) {
            GameState.honey -= this.CRAFT_COST;
            GameState.honeyJars++;
            GameState.save();
            return true;
        }
        return false;
    },

    sellJar() {
        if (GameState.honeyJars >= 1) {
            GameState.honeyJars--;
            GameState.coins += this.SELL_PRICE;
            GameState.save();
            return true;
        }
        return false;
    }
};
