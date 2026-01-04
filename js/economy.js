const Economy = {
    costs: {
        colhedora: 15,
        jardim: 150
    },

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
    }
};
