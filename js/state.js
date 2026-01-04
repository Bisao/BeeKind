const GameState = {
    SAVE_KEY: "BeeKind_FullSave_v1",
    honey: 0,
    totalHoney: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    upgrades: { colhedora: 0, jardim: 0 },

    save() {
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(this));
    },

    load() {
        const saved = localStorage.getItem(this.SAVE_KEY);
        if (saved) Object.assign(this, JSON.parse(saved));
    }
};
