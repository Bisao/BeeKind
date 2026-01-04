const GameState = {
    SAVE_KEY: "BeeKind_Final_v2.0",
    
    honey: 0,
    honeyJars: 0,
    coins: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    upgrades: { colhedora: 0, jardim: 0 },
    
    // Controle de Logs e UI
    hasSeenLogs: false, 
    updateLogs: [
        "v2.0: Interface Honeycomb Responsiva e Adaptável.",
        "v1.9: Novo sistema de engarrafamento industrial.",
        "v1.8: Adicionado Mercado da Vila e Moedas de Ouro.",
        "v1.7: Melhoria nas animações da abelha e loading.",
        "v1.6: Correção no sistema de salvamento automático."
    ],

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
