// js/game.js

// Estado Global do Jogador
let player = {
    name: "", deck: "", spirit: "",
    hp: 3, maxHp: 3, dp: 0, atk: 0, int: 0,
    diaIndex: 0, semana: 1, mes: 1, ano: 1, 
    foco: 'duelo',
    reliquias: [],
    equipamentos: [],
    parceiroAtivo: null
};

let idleTimer = null;
let duracaoDiaMs = 2000; // 2 segundos = 1 dia no jogo (ajustável)

const ui = {
    creation: document.getElementById('screen-creation'), hud: document.getElementById('hud'),
    stage: document.getElementById('stage'), dialog: document.getElementById('dialog-box'),
    actions: document.getElementById('action-panel'), ending: document.getElementById('screen-ending'),
    img: document.getElementById('stage-image'), overlay: document.getElementById('stage-overlay'),
    focoOverlay: document.getElementById('foco-overlay'), diaTexto: document.getElementById('v-dia'),
    progContainer: document.getElementById('idle-progress-container'), progBar: document.getElementById('idle-progress-bar')
};

// --- FUNÇÕES DE INTERFACE ---
function updateHUD() {
    document.getElementById('v-hp').innerText = player.hp;
    document.getElementById('v-dp').innerText = player.dp;
    document.getElementById('v-atk').innerText = player.atk;
    document.getElementById('v-int').innerText = player.int;
    
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

// --- INICIALIZAÇÃO ---
function startGame() {
    player.name = document.getElementById('playerName').value || "Novato";
    player.deck = document.getElementById('playerDeck').value;
    player.spirit = document.getElementById('playerSpirit').value;

    // Ajuste inicial baseado no deck
    if (player.deck === 'maquina') { player.atk = 10; player.int = 2; }
    else if (player.deck === 'mago') { player.atk = 2; player.int = 10; }
    else { player.atk = 5; player.int = 5; player.hp = 4; player.maxHp = 4; }

    ui.creation.style.display = 'none';
    ui.hud.style.display = 'flex';
    ui.progContainer.style.display = 'block';
    ui.stage.style.display = 'flex';
    ui.dialog.style.display = 'block';
    ui.actions.style.display = 'flex';

    updateHUD();
    iniciarIdleLoop();
}

// --- MOTOR DE TEMPO (CALENDÁRIO) ---
function iniciarIdleLoop() {
    if (player.hp <= 0) return dispararGameOver("Ficou sem Pontos de Vida.");

    showDialog(`<b>${diasDaSemana[player.diaIndex]}!</b><br>O semestre está correndo. Administre seu tempo e cuidado com a aula de sexta!`, player.foco === 'duelo' ? imgs.duel : imgs.study);
    
    renderButtons(`
        <button onclick="mudarFoco()" class="btn-primary">Mudar Foco (Atual: ${player.foco === 'duelo' ? 'Duelos' : 'Estudos'})</button>
        <button onclick="acaoLoja()">🛒 Visitar Dona Dorothy</button>
    `);

    clearInterval(idleTimer);
    ui.progBar.style.width = '0%';
    ui.progBar.style.transition = `width ${duracaoDiaMs}ms linear`;
    
    // Inicia a animação da barra
    setTimeout(() => ui.progBar.style.width = '100%', 50);

    idleTimer = setInterval(() => {
        processarFimDoDia();
    }, duracaoDiaMs); 
}

function processarFimDoDia() {
    // 1. Coleta os ganhos do dia
    if (player.foco === 'duelo') {
        let ganhoAtk = Math.floor(Math.random() * 3) + 1;
        let ganhoDp = Math.floor(Math.random() * 15) + 10;
        
        // Modificador do Pote da Ganância
        if (player.reliquias.includes('pote')) {
            ganhoDp = Math.floor(ganhoDp * 1.5);
        }
        
        player.atk += ganhoAtk;
        player.dp += ganhoDp;
    } else {
        player.int += Math.floor(Math.random() * 4) + 2;
    }

    // 2. Avança o calendário
    player.diaIndex++;
    if (player.diaIndex > 6) {
        player.diaIndex = 0; // Volta pra Segunda
        player.semana++;
        if (player.semana > 4) {
            player.semana = 1;
            player.mes++;
            if (player.mes > 3) {
                return iniciarExameFinal();
            }
        }
    }
    
    updateHUD();

    // 3. Verifica Eventos Fixos do Calendário
    let diaAtual = diasDaSemana[player.diaIndex];
    
    if (diaAtual === "Sexta-feira") {
        clearInterval(idleTimer);
        setTimeout(eventoAulaSexta, 100);
    } else if (diaAtual !== "Sábado" && diaAtual !== "Domingo") {
        // 4. Se for um dia normal de aula, rola os dados para ver se sofre uma emboscada
        if (dispararEventoAleatorio()) {
            return; // Interrompe o processamento visual se o evento pausou o jogo
        }
        
        // Reseta a barra visual para o próximo dia se nada aconteceu
        ui.progBar.style.transition = 'none';
        ui.progBar.style.width = '0%';
        setTimeout(() => {
            ui.progBar.style.transition = `width ${duracaoDiaMs}ms linear`;
            ui.progBar.style.width = '100%';
        }, 50);
    }
}

function mudarFoco() {
    player.foco = player.foco === 'duelo' ? 'estudo' : 'duelo';
    updateHUD();
    iniciarIdleLoop();
}

// --- EVENTOS ESPECIAIS ---
// --- EVENTOS ALEATÓRIOS (RNG) ---
function dispararEventoAleatorio() {
    let chance = Math.random();
    if (chance < 0.7) return false; // 70% de chance de seguir a vida normalmente

    clearInterval(idleTimer); // Pausa o motor idle
    let reqAtk = 15 + (player.ano * 10); 

    showDialog(`<span style="color:var(--danger)">⚠️ EMBOSCADA!</span><br>Um valentão do Obelisco Azul te parou no corredor! "Passe seus DP ou duele comigo!"<br><br>Requisito para Vencer: <b>${reqAtk} ATK</b>`, imgs.threat);
    
    renderButtons(`
        <button onclick="resolverEventoAtaque(${reqAtk})" class="btn-danger">Duelar com Força Bruta</button>
    `);
    
    return true; // Avisa ao loop que um evento ocorreu e a barra deve parar
}

function resolverEventoAtaque(requisito) {
    if (player.atk >= requisito) {
        let recompensa = 30 * player.ano;
        player.dp += recompensa;
        updateHUD();
        showDialog(`<span style="color:var(--success)"><b>VITÓRIA!</b></span><br>Seus monstros destruíram o campo dele. Você pegou <b>${recompensa} DP</b>!`, imgs.duel);
    } else {
        player.hp--;
        updateHUD();
        showDialog(`<span style="color:var(--danger)"><b>DERROTA!</b></span><br>Ele ativou uma armadilha e apagou seus monstros. Você perdeu <b>1 HP</b> pelo desgaste físico do dano real.`, imgs.threat);
    }

    if (player.hp <= 0) {
        checarMorte(); 
    } else {
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Continuar Rotina</button>`);
    }
}

function eventoAulaSexta() {
    let t = bancoTrivia[Math.floor(Math.random() * bancoTrivia.length)];
    
    showDialog(`<span style="color:var(--gold)">🎓 AULA DE SEXTA!</span><br>Prof. Crowler exige sua atenção:<br><br><b>${t.q}</b>`, imgs.study);
    
    let botoes = t.opções.map((opc, index) => {
        return `<button onclick="responderTrivia(${index}, ${t.correta})">${opc}</button>`;
    }).join("");

    renderButtons(botoes);
}

function responderTrivia(escolha, correta) {
    if (escolha === correta) {
        player.int += 15; 
        showDialog(`<span style="color:var(--success)"><b>CORRETO!</b></span> +15 INT. Você pode aproveitar o fim de semana agora.`, imgs.hub);
    } else {
        player.hp--;
        showDialog(`<span style="color:var(--danger)"><b>ERRADO!</b></span> Detenção mental. Perdeu 1 HP.`, imgs.threat);
    }
    
    updateHUD();
    
    if(player.hp <= 0) {
        renderButtons(`<button onclick="dispararGameOver('Exaustão mental crônica.')">Finalizar</button>`);
    } else {
        // Avança para Sábado
        player.diaIndex++;
        updateHUD();
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Aproveitar Fim de Semana</button>`);
    }
}

function acaoLoja() {
    clearInterval(idleTimer); // Pausa o tempo do jogo
    showDialog("Dona Dorothy: 'Temos lanches novos e algumas cartas raras hoje. O que vai levar?'", imgs.shop);
    renderButtons(`
        <button onclick="comprarLoja('estragado', 30)" style="background:#8e44ad">Sanduíche Suspeito (30 DP)</button>
        <button onclick="comprarLoja('ovo', 80)" style="background:#27ae60">Pão de Ovo Seguro (80 DP)</button>
        <button onclick="comprarLoja('pote', 300)" style="background:#f1c40f; color:#000;">Relíquia: Pote da Ganância (300 DP)</button>
        <button onclick="comprarLoja('reborn', 600)" style="background:#c0392b">Relíquia: Monstro Reborn (600 DP)</button>
        <button onclick="iniciarIdleLoop()">Sair da Loja</button>
    `);
}

function comprarLoja(item, custo) {
    if (player.dp < custo) {
        showDialog("Dona Dorothy: 'Você não tem DP suficiente para isso, querido.'", imgs.shop);
        return;
    }

    player.dp -= custo;

    if (item === 'estragado') {
        if (Math.random() < 0.5) {
            if (player.hp < player.maxHp) player.hp++;
            showDialog("Foi uma delícia! Você recuperou 1 HP.", imgs.shop);
        } else {
            player.hp--;
            showDialog("Ugh... O recheio estava vencido. Você perdeu 1 HP.", imgs.threat);
        }
    } else if (item === 'ovo') {
        if (player.hp < player.maxHp) player.hp++;
        showDialog("Um clássico! Você recuperou 1 HP de forma segura.", imgs.shop);
    } else if (item === 'pote') {
        if(!player.reliquias.includes('pote')) player.reliquias.push('pote');
        showDialog("Você comprou o Pote da Ganância! Agora seus duelos geram +50% DP no modo Idle.", imgs.shop);
    } else if (item === 'reborn') {
        if(!player.reliquias.includes('reborn')) player.reliquias.push('reborn');
        showDialog("Você comprou o Monstro Reborn! Ele vai te salvar automaticamente de um golpe fatal.", imgs.shop);
    }

    updateHUD();
    
    if (player.hp <= 0) {
        renderButtons(`<button onclick="checarMorte()">Continuar</button>`);
    }
}

// --- FIM DE JOGO ---
function iniciarExameFinal() {
    clearInterval(idleTimer);
    showDialog(`<b>Mês do Exame Final!</b><br>O ano letivo acabou, prepare seu deck. Em breve, a mecânica de Puzzles será implementada aqui.`, imgs.boss1);
    renderButtons(`<button onclick="dispararGameOver('Fim do Protótipo!')">Ver Tela Final</button>`);
}

function checarMorte() {
    if (player.reliquias.includes('reborn')) {
        player.hp = 1;
        player.reliquias = player.reliquias.filter(r => r !== 'reborn'); // Consome a carta
        updateHUD();
        showDialog(`<b>GOLPE FATAL!</b><br>Mas a magia da sua carta <b>Monstro Reborn</b> ativou! Você sobreviveu com 1 HP!`, imgs.duel);
        renderButtons(`<button onclick="iniciarIdleLoop()">Ufa, voltar à rotina!</button>`);
    } else {
        dispararGameOver("Seus Pontos de Vida chegaram a zero.");
    }
}

function dispararGameOver(motivo) {
    clearInterval(idleTimer);
    ui.hud.style.display = 'none'; ui.stage.style.display = 'none';
    ui.progContainer.style.display = 'none'; ui.dialog.style.display = 'none';
    ui.actions.style.display = 'none'; ui.ending.style.display = 'flex';

    document.getElementById('id-name').innerText = player.name;
    document.getElementById('id-deck').innerText = player.deck.toUpperCase();
    document.getElementById('id-atk').innerText = player.atk;
    document.getElementById('id-int').innerText = player.int;
    document.getElementById('id-year').innerText = "Encerrado";
}
