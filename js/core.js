const Core = {
    init() {
        GameState.load();
        
        // Executa o loading antes de mostrar qualquer coisa
        UI.runLoading(() => {
            document.getElementById("loadingScreen").classList.add("hidden");
            document.getElementById("startScreen").classList.remove("hidden");
            UI.init();
        });

        // Evento de clique
        document.getElementById("beeContainer").addEventListener("click", () => {
            const val = Economy.getClickValue();
            GameState.honey += val;
            GameState.xp += 2;
            this.checkLevelUp();
            UI.updateStats();
            UI.renderShop();
        });

        // Loop de Produção
        setInterval(() => {
            if (document.getElementById("gameUI").classList.contains("hidden")) return;
            const gain = Economy.getMPS();
            if (gain > 0) {
                GameState.honey += gain;
                GameState.xp += gain * 0.1;
                this.checkLevelUp();
                UI.updateStats();
                UI.renderShop();
            }
        }, 1000);
    },

    checkLevelUp() {
        if (GameState.xp >= GameState.nextLvlXp) {
            GameState.xp -= GameState.nextLvlXp;
            GameState.level++;
            GameState.talentPoints++;
            GameState.nextLvlXp *= 1.5;
        }
    }
};

window.onload = () => Core.init();
