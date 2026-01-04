const SnakeGame = {
    canvas: null,
    ctx: null,
    snake: [],
    food: {x: 0, y: 0},
    dir: "right",
    grid: 20,
    score: 0,

    start() {
        Core.mgRunning = true;
        document.getElementById("gameOverlay").classList.remove("hidden");
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 320;
        this.canvas.height = 320;
        
        this.snake = [{x: 160, y: 160}];
        this.dir = "right";
        this.score = 0;
        document.getElementById("mgScore").textContent = "0";
        this.spawnFood();
        this.loop();
    },

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * (this.canvas.width/this.grid)) * this.grid,
            y: Math.floor(Math.random() * (this.canvas.height/this.grid)) * this.grid
        };
    },

    setDir(newDir) {
        if (newDir === "up" && this.dir !== "down") this.dir = "up";
        if (newDir === "down" && this.dir !== "up") this.dir = "down";
        if (newDir === "left" && this.dir !== "right") this.dir = "left";
        if (newDir === "right" && this.dir !== "left") this.dir = "right";
    },

    loop() {
        if (!Core.mgRunning) return;
        
        setTimeout(() => {
            this.update();
            this.draw();
            this.loop();
        }, 150);
    },

    update() {
        const head = {...this.snake[0]};
        if(this.dir === "right") head.x += this.grid;
        if(this.dir === "left") head.x -= this.grid;
        if(this.dir === "up") head.y -= this.grid;
        if(this.dir === "down") head.y += this.grid;

        // Colisão com paredes
        if(head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height) {
            Core.exitMinigame();
            return;
        }

        this.snake.unshift(head);
        
        if(head.x === this.food.x && head.y === this.food.y) {
            this.score += 1;
            GameState.honey += 25; // Recompensa por comer
            document.getElementById("mgScore").textContent = this.score;
            this.spawnFood();
        } else {
            this.snake.pop();
        }
    },

    draw() {
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = "#f3f315";
        this.snake.forEach(p => this.ctx.fillRect(p.x, p.y, this.grid-2, this.grid-2));
        
        this.ctx.fillStyle = "#ff4444";
        this.ctx.fillRect(this.food.x, this.food.y, this.grid-2, this.grid-2);
    }
};

window.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp") SnakeGame.setDir("up");
    if(e.key === "ArrowDown") SnakeGame.setDir("down");
    if(e.key === "ArrowLeft") SnakeGame.setDir("left");
    if(e.key === "ArrowRight") SnakeGame.setDir("right");
});
