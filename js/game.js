// Estado Global do Jogador
let player = {
    name: "", deck: "", spirit: "", dormitorio: "Slifer Vermelho",
    hp: 3, maxHp: 3, dp: 0, atk: 0, int: 0,
    diaIndex: 0, semana: 1, mes: 1, ano: 1, 
    foco: 'duelo',
    reliquias: [], equipamentos: [],
    amizades: { syrus: 0, jaden: 0, bastion: 0, zane: 0 }
};

let idleTimer = null;
let duracaoDiaMs = 2000;

// MAPEAMENTO DA INTERFACE (Isso estava faltando!)
const ui = {
    creation: document.getElementById('screen-creation'), 
    hud: document.getElementById('hud'),
    stage: document.getElementById('stage'), 
    dialog: document.getElementById('dialog-box'),
    actions: document.getElementById('action-panel'), 
    ending: document.getElementById('screen-ending'),
    img: document.getElementById('stage-image'), 
    overlay: document.getElementById('stage-overlay'),
    focoOverlay: document.getElementById('foco-overlay'), 
    progContainer: document.getElementById('idle-progress-container'), 
    progBar: document.getElementById('idle-progress-bar')
};

// --- FUNÇÕES DE INTERFACE ---
function updateHUD() {
    document.getElementById('v-hp').innerText = player.hp;
    document.getElementById('v-dp').innerText = player.dp;
    document.getElementById('v-atk').innerText = player.atk;
    document.getElementById('v-int').innerText = player.int;
    
    // Assegure-se de que a variável diasDaSemana exista no seu data.js
    ui.overlay.innerHTML = `Mês ${player.mes} - Sem ${player.semana} - <span style="color:#fff">${diasDaSemana[player.diaIndex]}</span>`;
    ui.focoOverlay.innerText = `Foco: ${player.foco === 'duelo' ? "⚔️ Duelos" : "📚 Estudos"}`;
}

function showDialog(text, bgUrl = imgs.hub) {
    ui.dialog.innerHTML = text;
    ui.img.src = bgUrl;
}

function renderButtons(buttonsHTML) {
    ui.actions.innerHTML = buttonsHTML;
}

// --- INICIALIZAÇÃO DO JOGO ---
function startGame() {
    player.name = document.getElementById('playerName').value || "Novato";
    player.deck = document.getElementById('playerDeck').value;
    player.spirit = document.getElementById('playerSpirit').value;

    if (player.deck === 'maquina') { player.atk = 10; player.int = 2; }
    else if (player.deck === 'mago') { player.atk = 2; player.int = 10; }
    else { player.atk = 6; player.int = 6; player.hp = 4; player.maxHp = 4; }

    ui.creation.style.display = 'none';
    ui.hud.style.display = 'flex';
    ui.progContainer.style.display = 'block';
    ui.stage.style.display = 'flex';
    ui.dialog.style.display = 'block';
    ui.actions.style.display = 'flex';

    updateHUD();
    iniciarIdleLoop();
}

function startGame() {
    player.name = document.getElementById('playerName').value || "Novato";
    player.deck = document.getElementById('playerDeck').value;
    player.spirit = document.getElementById('playerSpirit').value;

    if (player.deck === 'maquina') { player.atk = 10; player.int = 2; }
    else if (player.deck === 'mago') { player.atk = 2; player.int = 10; }
    else { player.atk = 6; player.int = 6; player.hp = 4; player.maxHp = 4; } // Zumbi/Vampiro

    // Bônus inicial do Deckbox se já tivesse (preparando para NG+)
    ui.creation.style.display = 'none';
    ui.hud.style.display = 'flex';
    ui.progContainer.style.display = 'block';
    ui.stage.style.display = 'flex';
    ui.dialog.style.display = 'block';
    ui.actions.style.display = 'flex';

    updateHUD();
    iniciarIdleLoop();
}

function iniciarIdleLoop() {
    if (player.hp <= 0) return checarMorte();

    // Aplica bônus de equipamento na velocidade
    let velocidadeAtual = player.equipamentos.includes('disco_kaiba') ? duracaoDiaMs * 0.75 : duracaoDiaMs;

    showDialog(`<b>${diasDaSemana[player.diaIndex]}!</b><br>As aulas estão rolando. Qual o seu foco?`, imgs.hub);
    renderButtons(`<button onclick="mudarFoco()" class="btn-primary">Mudar Foco (Atual: ${player.foco === 'duelo' ? 'Duelos' : 'Estudos'})</button>`);

    clearInterval(idleTimer);
    animarBarraTempo(velocidadeAtual);

    idleTimer = setInterval(() => {
        processarFimDoDia();
    }, velocidadeAtual); 
}

function processarFimDoDia() {
    // 1. Calcular Ganhos com Modificadores (Relíquias e Espíritos)
    let ganhoAtk = 0; let ganhoInt = 0; let ganhoDp = 0;

    if (player.foco === 'duelo') {
        ganhoAtk = Math.floor(Math.random() * 3) + 1;
        ganhoDp = Math.floor(Math.random() * 15) + 10;
        
        // Modificador: Pote da Ganância
        if (player.reliquias.includes('pote_ganancia')) ganhoDp = Math.floor(ganhoDp * 1.5);
        // Modificador: Espírito Ojama
        if (player.spirit === 'ojama') ganhoDp += 5;
        
        player.atk += ganhoAtk;
        player.dp += ganhoDp;
    } else {
        ganhoInt = Math.floor(Math.random() * 4) + 2;
        // Modificador: Espírito Mago da Fé
        if (player.spirit === 'mago_fe') ganhoInt += 2;
        player.int += ganhoInt;
    }

    // 2. Avanço de Calendário
    player.diaIndex++;
    updateHUD();

    // 3. Checagem de Sexta ou Fim de Semana
    if (player.diaIndex === 4) { // Sexta-feira
        clearInterval(idleTimer);
        ui.progBar.style.transition = 'none'; ui.progBar.style.width = '0%';
        setTimeout(eventoAulaSexta, 100);
    } 
    else if (player.diaIndex > 4) { // Sábado ou Domingo
        // O loop já foi parado na sexta, então isso é chamado manualmente após a trivia
        iniciarFimDeSemana();
    } else {
        animarBarraTempo(duracaoDiaMs);
    }
}

// --- FIM DE SEMANA (Sábado e Domingo) ---
function iniciarFimDeSemana() {
    clearInterval(idleTimer);
    ui.progBar.style.transition = 'none'; ui.progBar.style.width = '0%';
    
    let textoFds = player.diaIndex === 5 ? "Sábado chegou!" : "Domingo preguiçoso.";
    showDialog(`<b>${diasDaSemana[player.diaIndex]}!</b><br>${textoFds} O que você quer fazer hoje? (O tempo não passa sozinho no fim de semana).`, imgs.hub);
    
    renderButtons(`
        <button onclick="acaoLoja()" style="background:#f39c12">🛒 Ir à Loja</button>
        <button onclick="acaoSocial()" style="background:#8e44ad">🤝 Procurar Duelistas (Social)</button>
        <button onclick="acaoDescansar()" style="background:#27ae60">🛌 Descansar (+1 HP)</button>
    `);
}

function acaoDescansar() {
    if(player.hp < player.maxHp) player.hp++;
    avancarDiaManual();
}

function avancarDiaManual() {
    player.diaIndex++;
    if (player.diaIndex > 6) {
        player.diaIndex = 0; // Volta pra Segunda
        player.semana++;
        if (player.semana > 4) {
            player.semana = 1;
            player.mes++;
            if (player.mes > 3) return iniciarExameFinal();
        }
        updateHUD();
        iniciarIdleLoop(); // Retoma o modo idle na Segunda
    } else {
        updateHUD();
        iniciarFimDeSemana(); // Continua no menu de Domingo
    }
}

// --- SISTEMA DE MORTE E RELÍQUIAS ---
function checarMorte() {
    if (player.reliquias.includes('monstro_reborn')) {
        player.hp = 1;
        // Remove a relíquia após o uso
        player.reliquias = player.reliquias.filter(r => r !== 'monstro_reborn');
        updateHUD();
        showDialog(`<b>GOLPE FATAL!</b><br>Mas a magia do seu <b>Monstro Reborn</b> ativou no cemitério! Você sobreviveu com 1 HP!`, imgs.duel);
        renderButtons(`<button onclick="iniciarIdleLoop()">Continuar (Ufa!)</button>`);
    } else if (player.spirit === 'kuriboh' && Math.random() < 0.3) {
        player.hp = 1;
        showDialog(`<b>KURI KURI!</b><br>Seu Kuriboh descartou a si mesmo da sua mão para zerar o dano! Você sobreviveu com 1 HP.`, imgs.duel);
        renderButtons(`<button onclick="iniciarIdleLoop()">Agradecer ao Kuriboh</button>`);
    } else {
        dispararGameOver('Seus Pontos de Vida chegaram a zero.');
    }
}

function animarBarraTempo(tempoMs) {
    ui.progBar.style.transition = 'none';
    ui.progBar.style.width = '0%';
    setTimeout(() => {
        ui.progBar.style.transition = `width ${tempoMs}ms linear`;
        ui.progBar.style.width = '100%';
    }, 50);
}
