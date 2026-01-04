const Core = {
    init() {
        // Tenta carregar o progresso salvo antes de qualquer coisa
        GameState.load();
        
        // Configura o evento de clique na abelha principal
        // O elemento só existirá no DOM após o carregamento das telas
        const bee = document.getElementById("beeContainer");
        if (bee) {
            bee.onclick = () => {
                const clickVal = Economy.getClickValue();
                GameState.honey += clickVal;
                GameState.xp += 2;
                this.checkLevel();
                UI.updateStats();
                UI.renderShop();
            };
        }

        // Ciclo de produção passiva (roda a cada 1 segundo)
        setInterval(() => {
            // Só processa mel se a tela de jogo estiver visível
            const gameVisible = !document.getElementById("gameUI").classList.contains("hidden");
            if (gameVisible) {
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

        // Sistema de salvamento automático (a cada 10 segundos)
        setInterval(() => {
            GameState.save();
        }, 10000);
    },

    checkLevel() {
        if (GameState.xp >= GameState.nextLvlXp) {
            GameState.xp -= GameState.nextLvlXp;
            GameState.level++;
            GameState.talentPoints++;
            // Aumenta a dificuldade do próximo nível em 50%
            GameState.nextLvlXp = Math.floor(GameState.nextLvlXp * 1.5);
            GameState.save();
        }
    }
};

// Ponto de entrada único do sistema
window.onload = () => {
    Core.init();
};
