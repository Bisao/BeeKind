const Core = {
    init() {
        // Carrega os dados do salvamento
        GameState.load();
        
        // Configura o clique na abelha principal
        const bee = document.getElementById("beeContainer");
        if (bee) {
            bee.onclick = (e) => {
                const clickVal = Economy.getClickValue();
                GameState.honey += clickVal;
                GameState.xp += 2;
                
                this.checkLevel();
                UI.updateStats();
                UI.renderShop();
                
                // Feedback visual simples no console ou UI
                console.log("Néctar coletado!");
            };
        }

        // Loop de Produção Passiva (1 segundo)
        setInterval(() => {
            const gameUI = document.getElementById("gameUI");
            // Só processa se a tela de jogo estiver ativa (não oculta)
            if (gameUI && !gameUI.classList.contains("hidden")) {
                const gain = Economy.getMPS();
                if (gain > 0) {
                    GameState.honey += gain;
                    GameState.xp += gain * 0.1;
                    this.checkLevel();
                    UI.updateStats();
                    UI.renderShop();
                }
            }
        }, 1000);

        // Auto-save a cada 10 segundos
        setInterval(() => {
            GameState.save();
        }, 10000);
    },

    checkLevel() {
        if (GameState.xp >= GameState.nextLvlXp) {
            GameState.xp -= GameState.nextLvlXp;
            GameState.level++;
            GameState.talentPoints++;
            // Aumenta a dificuldade do próximo nível
            GameState.nextLvlXp = Math.floor(GameState.nextLvlXp * 1.5);
            GameState.save();
            console.log("Level Up! Novo Nível: " + GameState.level);
        }
    }
};

// Ponto de entrada: Garante que o DOM está pronto
window.onload = () => {
    Core.init();
};
