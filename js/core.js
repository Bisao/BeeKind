const Core = {
    mgRunning: false,

    init() {
        GameState.load();
        UI.init();
        this.setupEventListeners();
        this.startLoops();
    },

    setupEventListeners() {
        document.getElementById("beeContainer").addEventListener("click", () => {
            const val = Economy.getClickValue();
            GameState.honey += val;
            GameState.xp += 1;
            this.checkLevelUp();
            UI.updateStats();
        });
    },

    checkLevelUp() {
        if (GameState.xp >= GameState.nextLvlXp) {
            GameState.xp = 0;
            GameState.level++;
            GameState.nextLvlXp *= 1.5;
            UI.notify("LEVEL UP!", "Nível " + GameState.level);
        }
    },

    startLoops() {
        // Loop de Produção (1 segundo)
        setInterval(() => {
            const gain = Economy.getMPS();
            GameState.honey += gain;
            GameState.xp += gain * 0.1;
            this.checkLevelUp();
            UI.updateStats();
        }, 1000);

        // Loop de Auto-Save (30 segundos)
        setInterval(() => GameState.save(), 30000);
    },

    exitMinigame() {
        this.mgRunning = false;
        document.getElementById("gameOverlay").classList.add("hidden");
    }
};

window.onload = () => Core.init();