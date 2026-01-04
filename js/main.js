document.addEventListener("DOMContentLoaded", () => {
    // Inicialização do sistema
    load(); // Carrega o localStorage para o GameState
    
    // Loop de Produção Automática (1s)
    setInterval(() => {
        if (GameState.gameLoaded) {
            let gain = Economy.getMPSBase() * Economy.getGlobalBonus();
            GameState.honey = validateNum(GameState.honey + gain);
            GameState.totalHoneyEver = validateNum(GameState.totalHoneyEver + gain);
            Economy.addXP(gain);
            updateMissionProgress('honey_gain', gain);
            UI.refresh();
        }
    }, 1000);

    // Loop de Ticks de Jogo (100ms)
    setInterval(() => {
        if (!GameState.gameLoaded) return;
        
        // Redução de Boosts
        for (let b in GameState.activeBoosts) {
            if (GameState.activeBoosts[b] > 0) GameState.activeBoosts[b]--;
        }

        // Ticks de expedição e UI secundária
        tickExpedition();
        checkMissionReset();
    }, 100);
});

// Função disparada pelo botão JOGAR AGORA
function enterGame() {
    // Lógica original de loading screen e transição
}