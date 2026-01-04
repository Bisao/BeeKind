const Economy = {
    costs: {
        worker: 15,
        factory: 100
    },

    getMPS() {
        return (GameState.upgrades.worker * 1) + (GameState.upgrades.factory * 8);
    },

    getClickValue() {
        return 1 + (GameState.level * 0.5);
    },

    buyUpgrade(type) {
        const cost = Math.floor(this.costs[type] * Math.pow(1.15, GameState.upgrades[type]));
        if (GameState.honey >= cost) {
            GameState.honey -= cost;
            GameState.upgrades[type]++;
            UI.notify("Sucesso!", "Upgrade adquirido.");
            GameState.save();
        }
    }
};