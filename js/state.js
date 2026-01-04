const GameState = {
    SAVE_KEY: "BeeKind_Final_v1.9",
    honey: 0,
    honeyJars: 0,
    coins: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    upgrades: { colhedora: 0, jardim: 0 },

    save() {
        const data = JSON.stringify(this);
        localStorage.setItem(this.SAVE_KEY, data);
    },

    load() {
        const saved = localStorage.getItem(this.SAVE_KEY);
        if (saved) {
            Object.assign(this, JSON.parse(saved));
        }
    }
};
