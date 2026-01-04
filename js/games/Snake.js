const SnakeGame = {
    score: 0,
    ctx: null,
    
    start() {
        document.getElementById("gameOverlay").classList.remove("hidden");
        const canvas = document.getElementById("gameCanvas");
        this.ctx = canvas.getContext("2d");
        this.score = 0;
        this.loop();
    },

    loop() {
        // Lógica simplificada de loop de jogo
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,300,300);
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Snake Game - Clique para Pontuar", 50, 50);
        
        if (Core.mgRunning) requestAnimationFrame(() => this.loop());
    }
};