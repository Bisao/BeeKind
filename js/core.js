const Core = {
    init() {
        GameState.load();
        
        // Inicia fluxo: Loading -> StartScreen
        UI.runLoading(() => {
            document.getElementById("loadingScreen").classList.add("hidden");
            document.getElementById("startScreen").classList.remove("hidden");
            UI.init();
        });

        // Evento de Clique
        document.getElementById("beeContainer").onclick = () => {
            GameState.honey += Economy.getClickValue();
            GameState.xp += 2;
            this.checkLevel();
            UI.updateStats();
            UI.renderShop();
        };

        // Ciclo de Produção (1 segundo)
        setInterval(() => {
            if (!document.getElementById("gameUI").classList.contains("hidden")) {
                const gain = Economy.getMPS();
                GameState.honey += gain;
                GameState.xp += gain * 0.1;
                this.checkLevel();
                UI.updateStats();
                UI.renderShop();
            }
        }, 1000);

        // Auto-save (10 segundos)
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

window.onload = () => Core.init();
