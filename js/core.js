const Core = {
    init() {
        GameState.load();
        
        // Evento de Clique na Abelha Principal
        document.getElementById("beeContainer").onclick = () => {
            GameState.honey += Economy.getClickValue();
            GameState.xp += 2;
            this.checkLevel();
            UI.updateStats();
            UI.renderShop();
        };

        // Ciclo de Produção Passiva
        setInterval(() => {
            // Só produz se a tela de jogo estiver visível
            if (!document.getElementById("gameUI").classList.contains("hidden")) {
                const gain = Economy.getMPS();
                GameState.honey += gain;
                GameState.xp += gain * 0.1;
                this.checkLevel();
                UI.updateStats();
                UI.renderShop();
            }
        }, 1000);

        // Auto-save a cada 10 segundos
        setInterval(() => GameState.save(), 10000);
    },

    checkLevel() {
        if (GameState.xp >= GameState.nextLvlXp) {
            GameState.xp -= GameState.nextLvlXp;
            GameState.level++;
            GameState.talentPoints++;
            GameState.nextLvlXp = Math.floor(GameState.nextLvlXp * 1.5);
            GameState.save();
        }
    }
};

// Inicia o motor mas mantém a tela inicial travada
window.onload = () => Core.init();
