const UI = {
    init() {
        this.updateStats();
        this.renderShop();
    },

    // Chamado pelo botão "COMEÇAR JOGAR" na index.html
    requestStart() {
        const startScreen = document.getElementById("startScreen");
        const loadingScreen = document.getElementById("loadingScreen");
        
        if (startScreen && loadingScreen) {
            startScreen.classList.add("hidden");
            loadingScreen.classList.remove("hidden");
            this.runLoading();
        }
    },

    // Gerencia a barra de progresso do mel
    runLoading() {
        let progress = 0;
        const bar = document.getElementById("loadingBar");
        const beeWrapper = document.querySelector(".loading-bee-wrapper");
        
        const interval = setInterval(() => {
            // Incremento aleatório para parecer um carregamento real
            progress += Math.random() * 4;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Pequeno atraso para o jogador ver a barra cheia
                setTimeout(() => this.finalizeLoading(), 500);
            }
            
            if (bar) bar.style.width = progress + "%";
            if (beeWrapper) beeWrapper.style.left = progress + "%";
        }, 80);
    },

    // Transição final para a tela de jogo
    finalizeLoading() {
        const loadingScreen = document.getElementById("loadingScreen");
        const gameUI = document.getElementById("gameUI");
        
        if (loadingScreen) loadingScreen.classList.add("hidden");
        if (gameUI) {
            gameUI.classList.remove("hidden");
            this.init(); // Inicializa os textos e a loja
        }
    },

    backToMenu() {
        document.getElementById("gameUI").classList.add("hidden");
        document.getElementById("startScreen").classList.remove("hidden");
        // Reseta a barra para caso o jogador queira entrar de novo
        const bar = document.getElementById("loadingBar");
        if (bar) bar.style.width = "0%";
    },

    toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.toggle("hidden");
    },

    resetGame() {
        if (confirm("CUIDADO: Isso apagará todo o seu progresso de mel e upgrades. Deseja continuar?")) {
            localStorage.clear();
            location.reload();
        }
    },

    updateStats() {
        const h = document.getElementById("honey");
        const m = document.getElementById("mps");
        const l = document.getElementById("lvlDisplay");
        const t = document.getElementById("talentPoints");
        const f = document.getElementById("xpFill");

        if (h) h.textContent = Math.floor(GameState.honey).toLocaleString();
        if (m) m.textContent = Economy.getMPS().toFixed(1);
        if (l) l.textContent = GameState.level;
        if (t) t.textContent = GameState.talentPoints;
        
        const perc = (GameState.xp / GameState.nextLvlXp) * 100;
        if (f) f.style.width = Math.min(perc, 100) + "%";
    },

    renderShop() {
        const container = document.getElementById("shopList");
        if (!container) return;
        
        container.innerHTML = "";
        for (let item in Economy.costs) {
            const cost = Economy.getCost(item);
            const upgradeLevel = GameState.upgrades[item];
            
            const div = document.createElement("div");
            div.className = "shop-item";
            div.innerHTML = `
                <div class="shop-text">
                    <b style="text-transform: capitalize;">${item}</b><br>
                    <small>Nível Atual: ${upgradeLevel}</small>
                </div>
                <button 
                    onclick="UI.handleBuy('${item}')" 
                    ${GameState.honey < cost ? 'disabled' : ''}
                    class="buy-button">
                    ${cost.toLocaleString()} 🍯
                </button>
            `;
            container.appendChild(div);
        }
    },

    handleBuy(item) {
        if (Economy.buyUpgrade(item)) {
            this.updateStats();
            this.renderShop();
        }
    },

    openTab(id) {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.add("hidden"));
        
        const target = document.getElementById(id);
        if (target) target.classList.remove("hidden");
    }
};
