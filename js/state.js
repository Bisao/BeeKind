const GameState = {
    honey: 0,
    totalHoney: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    
    // Upgrades comprados (quantidades)
    upgrades: {
        worker: 0, // Produção passiva
        factory: 0 // Produção massiva
    },

    save() {
        const data = JSON.stringify({
            honey: this.honey,
            level: this.level,
            upgrades: this.upgrades,
            xp: this.xp
        });
        localStorage.setItem("CyberBees_Save", data);
    },

    load() {
        const data = localStorage.getItem("CyberBees_Save");
        if (data) {
            const parsed = JSON.parse(data);
            Object.assign(this, parsed);
        }
    }
};