function initSnake() {
    if(!snakeCanvas) return;
    snakeCanvas.width = 300; snakeCanvas.height = 300;
    snake = [{x: 140, y: 140}, {x: 120, y: 140}, {x: 100, y: 140}];
    sdx = 20; sdy = 0; snextDx = 20; snextDy = 0;
    fCollectedBoosts = []; 
    snakeBoost = null; snakeBoostTimer = 0; snakeBoostLife = 0; 
    createSnakeFood(); startSnakeLoop();
}

function startSnakeLoop() { if(mgInterval) clearInterval(mgInterval); mgInterval = setInterval(drawSnake, mgSpeed); }

function createSnakeFood() {
    if(!snakeCanvas) return;
    snakeFood.x = Math.floor(Math.random() * (snakeCanvas.width / 20)) * 20;
    snakeFood.y = Math.floor(Math.random() * (snakeCanvas.height / 20)) * 20;
}

function spawnSnakeBoost() {
    if(!snakeCanvas) return;
    if(Math.random() > 0.7) return;
    const types = ['pepper', 'energy', 'flower', 'luck'];
    const icons = { pepper: '🌶️', energy: '🥤', flower: '🌼', luck: '🍀' };
    const type = types[Math.floor(Math.random() * types.length)];
    let bx, by;
    let valid = false;
    while(!valid) {
        bx = Math.floor(Math.random() * (snakeCanvas.width / 20)) * 20;
        by = Math.floor(Math.random() * (snakeCanvas.height / 20)) * 20;
        valid = !snake.some(s => s.x === bx && s.y === by) && (bx !== snakeFood.x || by !== snakeFood.y);
    }
    snakeBoost = { x: bx, y: by, type: type, icon: icons[type] };
    snakeBoostLife = 5000; 
}

function drawSnake() {
    if(!snakeCtx || !snakeCanvas) return;
    snakeBoostTimer += mgSpeed;
    if(snakeBoostTimer >= 40000) { 
        spawnSnakeBoost();
        snakeBoostTimer = 0;
    }
    if(snakeBoost) {
        snakeBoostLife -= mgSpeed;
        if(snakeBoostLife <= 0) snakeBoost = null;
    }
    sdx = snextDx; sdy = snextDy;
    const head = {x: snake[0].x + sdx, y: snake[0].y + sdy};
    if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height || snake.some(s => s.x === head.x && s.y === head.y)) { finishMG(); return; }
    snake.unshift(head);
    if(head.x === snakeFood.x && head.y === snakeFood.y) {
        mgScore++; 
        const scoreVal = document.getElementById("mgCurrentScore");
        if(scoreVal) scoreVal.textContent = mgScore;
        updateMissionProgress('mg_item_collect', 1);
        createSnakeFood(); 
        if(mgScore % 2 === 0 && mgSpeed > 60) { mgSpeed *= 0.97; startSnakeLoop(); }
    } 
    else if(snakeBoost && head.x === snakeBoost.x && head.y === snakeBoost.y) {
        fCollectedBoosts.push({type: snakeBoost.type, icon: snakeBoost.icon});
        updateMgLiveBoostsVisual(); 
        updateMissionProgress('mg_boost_collect', 1);
        playClickSound();
        snakeBoost = null;
    }
    else snake.pop();
    snakeCtx.fillStyle = "#000"; snakeCtx.fillRect(0, 0, 300, 300);
    snakeCtx.fillStyle = "#ff4757"; snakeCtx.beginPath();
    snakeCtx.arc(snakeFood.x + 10, snakeFood.y + 10, 8, 0, Math.PI * 2); snakeCtx.fill();
    if(snakeBoost) {
        snakeCtx.font = "16px Arial";
        snakeCtx.textAlign = "center";
        snakeCtx.fillText(snakeBoost.icon, snakeBoost.x + 10, snakeBoost.y + 15);
    }
    snake.forEach((p, i) => {
        snakeCtx.fillStyle = i === 0 ? varProp('--accent') : "rgba(255,255,255,0.4)";
        snakeCtx.fillRect(p.x, p.y, 18, 18);
    });
}

function varProp(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function changeSnakeDir(dir) {
    if (dir === 'LEFT' && sdx === 0) { snextDx = -20; snextDy = 0; }
    if (dir === 'UP' && sdy === 0) { snextDx = 0; snextDy = -20; }
    if (dir === 'RIGHT' && sdx === 0) { snextDx = 20; snextDy = 0; }
    if (dir === 'DOWN' && sdy === 0) { snextDx = 0; snextDy = 20; }
}