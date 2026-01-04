const GameState = {
    SAVE_KEY: "BeeKind_Ind_v1.8",
    
    honey: 0,
    honeyJars: 0,
    coins: 0,
    totalHoney: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    upgrades: { colhedora: 0, jardim: 0 },

    save() {
        const data = {
            honey: this.honey,
            honeyJars: this.honeyJars,
            coins: this.coins,
            totalHoney: this.totalHoney,
            level: this.level,
            xp: this.xp,
            nextLvlXp: this.nextLvlXp,
            upgrades: this.upgrades,
            talentPoints: this.talentPoints
        };
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    },

    load() {
        const saved = localStorage.getItem(this.SAVE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(this, parsed);
        }
    }
};
