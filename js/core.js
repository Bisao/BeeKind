const Core = {
    init() {
        GameState.load();
        
        const bee = document.getElementById("beeContainer");
        if (bee) {
            bee.onclick = () => {
                GameState.honey += Economy.getClickValue();
                GameState.xp += 2;
                this.checkLevel();
                UI.updateStats();
                UI.renderShop();
            };
        }

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
