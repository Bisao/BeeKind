const GameState = {
    SAVE_KEY: "BeeKind_Final_v2.1",
    
    honey: 0,
    honeyJars: 0,
    coins: 0,
    level: 1,
    xp: 0,
    nextLvlXp: 100,
    talentPoints: 0,
    upgrades: { colhedora: 0, jardim: 0 },
    
    // Controle de Logs e Notificação
    hasSeenLogs: false, 
    updateLogs: [
        "v2.1: Correção de sobreposição de elementos e layout responsivo.",
        "v2.0: Interface Soft-UI Honeycomb implementada.",
        "v1.9: Adicionado sistema de Laboratório e Refinaria.",
        "v1.8: Mercado da Vila agora aceita venda de potes.",
        "v1.7: Melhoria na performance e salvamento automático."
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
