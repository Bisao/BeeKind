const Core = {
    init() {
        GameState.load();
        UI.init();
        
        document.getElementById("beeContainer").addEventListener("click", () => {
            const val = Economy.getClickValue();
            GameState.honey += val;
            GameState.xp += 2;
            this.checkLevelUp();
            UI.updateStats();
            UI.renderShop();
        });

        setInterval(() => {
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
    },

    exitMinigame() {
        document.getElementById("gameOverlay").classList.add("hidden");
    }
};
window.onload = () => Core.init();
