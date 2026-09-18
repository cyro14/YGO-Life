// js/game.js

// Estado Global do Jogador
let player = {
    name: "", deck: "", spirit: "",
    hp: 3, maxHp: 3, dp: 0, atk: 0, int: 0,
    diaIndex: 0, semana: 1, mes: 1, ano: 1, 
    foco: 'duelo',
    reliquias: [],
    equipamentos: [],
    consumiveis: [],
    parceiroAtivo: null
};

// Variáveis temporárias para a tela de criação
let selecaoAtual = { deck: null, spirit: null };

// Desenha a tela de criação ao abrir o jogo
function renderizarMenuInicial() {
    const deckGrid = document.getElementById('deck-grid');
    const spiritGrid = document.getElementById('spirit-grid');

    // 1. Renderiza Decks (Agora puxando apenas nome e status base)
    deckGrid.innerHTML = decksIniciais.map(d => `
        <div class="card-item" id="deck-${d.id}" onclick="selecionarOpcao('deck', '${d.id}')">
            <div class="card-emoji" style="font-size: 40px;">${d.emoji}</div>
            <div class="card-name">${d.nome}</div>
            <div class="card-desc">ATK: ${d.baseAtk} | INT: ${d.baseInt}</div>
        </div>
    `).join('');

    // 2. Renderiza Espíritos (Usando a tag <img> em vez de emojis)
    spiritGrid.innerHTML = espiritosIniciais.map(s => `
        <div class="card-item" id="spirit-${s.id}" onclick="selecionarOpcao('spirit', '${s.id}')">
            <img src="${s.img}" class="card-img" alt="${s.nome}" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\\'font-size:10px; color:red;\\'>Imagem não encontrada</div>');">
            <div class="card-name">${s.nome}</div>
            <div class="card-desc">${s.desc}</div>
        </div>
    `).join('');
}

// Manipula o clique nos cards
function selecionarOpcao(tipo, id) {
    selecaoAtual[tipo] = id;
    
    // Remove o brilho dourado dos outros cartões da mesma categoria
    let itens = document.querySelectorAll(`[id^="${tipo}-"]`);
    itens.forEach(el => el.classList.remove('active'));
    document.getElementById(`${tipo}-${id}`).classList.add('active');

    // Se clicou no Deck, desenha os Ases vinculados a ele na div do meio
    if (tipo === 'deck') {
        let asesDoDeck = asesIniciais.filter(a => a.deckReq === id);
        
        document.getElementById('ace-grid').innerHTML = asesDoDeck.map(a => `
            <div class="card-item" id="ace-${a.id}" onclick="selecionarOpcao('ace', '${a.id}')">
                <img src="${a.img}" class="card-img" alt="${a.nome}" onerror="this.style.display='none';">
                <div class="card-name">${a.nome}</div>
                <div class="card-desc">${a.desc}</div>
            </div>
        `).join('');
        
        selecaoAtual.ace = null; // Reseta o ás caso troque de deck
        document.getElementById('btn-start').disabled = true;
    }

    // Libera o botão de Matricular apenas se os TRÊS estiverem escolhidos
    let btnStart = document.getElementById('btn-start');
    if (selecaoAtual.deck && selecaoAtual.ace && selecaoAtual.spirit) {
        btnStart.disabled = false;
        btnStart.innerText = "Matricular-se na Academia";
    }
}

function renderizarMao() {
    let handDiv = document.getElementById('player-hand');
    if (!handDiv) return;

    if (player.reliquias.length === 0) {
        handDiv.innerHTML = `<div style="color: #666; font-size: 12px; width: 100%; text-align: center;">Nenhuma carta na mão</div>`;
        return;
    }

    handDiv.innerHTML = player.reliquias.map((relId, index) => {
        let item = lojaItens.find(i => i.id === relId);
        
        // CORREÇÃO: Se a carta não for encontrada no data.js, ele não trava o jogo
        if (!item) return `<div style="color: red; font-size: 12px;">Erro: Carta ${relId} não existe</div>`;
        
        let bg = item.subTipo === 'armadilha' ? '#bc1c6c' : '#009966'; 
        
        return `
            <div onclick="tentarAtivarCarta('${relId}', ${index})" style="background: ${bg}; border: 2px solid #fff; border-radius: 4px; padding: 10px; min-width: 100px; text-align: center; cursor: pointer; font-size: 12px; font-weight: bold; flex-shrink: 0; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); color: #fff;">
                ${item.nome}
            </div>
        `;
    }).join('');
}

function tentarAtivarCarta(relId, index) {
    let item = lojaItens.find(i => i.id === relId);
    
    if (item.subTipo === 'armadilha') {
        // Armadilhas não podem ser ativadas no modo livre, precisam de um "Gatilho"
        alert("Armadilhas só podem ser ativadas em resposta a um evento (ex: durante emboscadas)!");
        return;
    }
    
    // Processa Magias Normais
    if (item.id === 'pote_ganancia') {
        player.dp += 200;
        showDialog(`Você ativou a Magia <b>Pote da Ganância</b> e comprou 200 DP diretamente para o seu bolso!`, imgs.hub);
    } else if (item.id === 'monstro_reborn') {
        if (player.hp >= player.maxHp) {
            alert("Seu HP já está no máximo!");
            return; // Impede o gasto à toa
        }
        player.hp = player.maxHp;
        showDialog(`Você ativou <b>Monstro Reborn</b>! Uma aura de luz restaurou completamente seus Pontos de Vida.`, imgs.hub);
    }
    
    // Consome a magia da mão após o uso
    player.reliquias.splice(index, 1);
    updateHUD();
    renderizarMao();
}

// Chame a renderização assim que o script carregar
window.onload = renderizarMenuInicial;

function abrirInventario() {
    let inv = document.getElementById('modal-inventario');
    let cont = document.getElementById('inv-conteudo');
    
    let html = `<b>🥪 Consumíveis:</b><br>`;
    if (player.consumiveis.length === 0) html += `<i>Vazio</i><br>`;
    player.consumiveis.forEach((item, index) => {
        html += `- ${item.nome} <button onclick="usarConsumivel(${index})" style="padding: 2px 5px; font-size: 10px;">Usar</button><br>`;
    });

    html += `<br><b>🎴 Relíquias:</b><br>`;
    if (player.reliquias.length === 0) html += `<i>Vazio</i><br>`;
    player.reliquias.forEach(r => html += `- ${r}<br>`);

    cont.innerHTML = html;
    inv.style.display = 'block';
}

function fecharInventario() {
    document.getElementById('modal-inventario').style.display = 'none';
}

function usarConsumivel(index) {
    let item = player.consumiveis[index];
    if (player.hp >= player.maxHp) {
        alert("Seu HP já está cheio!");
        return;
    }
    player.hp++;
    player.consumiveis.splice(index, 1); // Remove o item
    updateHUD();
    abrirInventario(); // Atualiza a tela do inventário
}

let idleTimer = null;
let duracaoDiaMs = 2000; // 2 segundos = 1 dia no jogo (ajustável)

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
    progBar: document.getElementById('idle-progress-bar'),
    hand: document.getElementById('player-hand')
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

function showDialog(text, stageBgUrl = null, centerImgUrl = null) {
    ui.dialog.innerHTML = text;

    // Altera o plano de fundo do container inteiro (Dormitórios, Floresta, etc)
    if (stageBgUrl) {
        // Usa um gradiente escuro por cima da imagem para o texto da interface ficar legível
        ui.stage.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${stageBgUrl}')`;
        ui.stage.style.backgroundSize = "cover";
        ui.stage.style.backgroundPosition = "center";
    }

    // Se houver uma imagem específica para o centro (ex: um sprite de personagem)
    if (centerImgUrl) {
        ui.img.src = centerImgUrl;
        ui.img.style.display = 'block';
    } else {
        ui.img.style.display = 'none'; // Esconde a imagem central se só precisarmos do cenário
    }
}

function getDormBackground() {
    if (player.ano === 1) return imgs.bg_slifer;
    if (player.ano === 2) return imgs.bg_ra;
    return imgs.bg_obelisk;
}

function renderButtons(buttonsHTML) {
    ui.actions.innerHTML = buttonsHTML;
}

function startGame() {
    player.name = document.getElementById('playerName').value || "Novato";
    player.deck = selecaoAtual.deck;
    player.ace = selecaoAtual.ace;
    player.spirit = selecaoAtual.spirit;

    // Define status base do DECK
    let deckBase = decksIniciais.find(d => d.id === player.deck);
    player.atk = deckBase.baseAtk;
    player.int = deckBase.baseInt;
    player.hp = deckBase.hp;
    player.maxHp = deckBase.hp;

    ui.creation.style.display = 'none';
    ui.hud.style.display = 'flex';
    ui.progContainer.style.display = 'block';
    ui.stage.style.display = 'flex';
    ui.dialog.style.display = 'block';
    ui.actions.style.display = 'flex';
    ui.hand.style.display = 'flex';

    updateHUD();
    abrirBoosterInicial();
}

function abrirBoosterInicial() {
    let poolReliquias = lojaItens.filter(i => i.tipo === 'reliquia');
    let draft = poolReliquias.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    let nomesHTML = [];
    draft.forEach(item => {
        player.reliquias.push(item.id);
        nomesHTML.push(`🎴 <b>${item.nome}</b>: <span style="font-size:12px; color:#ccc;">${item.desc}</span>`);
    });

    showDialog(`<span style="color:var(--gold)">🎁 PACOTE DE MATRÍCULA!</span><br>O Reitor Sheppard te entregou 3 cartas raras para iniciar sua jornada. Construa sua estratégia em volta delas:<br><br>${nomesHTML.join('<br><br>')}`, imgs.hub);
    
    // CORREÇÃO: Atualiza o visual da mão assim que recebe as cartas
    renderizarMao(); 
    
    renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Vestir Uniforme e Começar</button>`);
}

// --- MOTOR DE TEMPO (CALENDÁRIO) ---
function iniciarIdleLoop() {
    if (player.hp <= 0) return dispararGameOver("Ficou sem Pontos de Vida.");

    showDialog(`<b>${diasDaSemana[player.diaIndex]}!</b><br>O semestre está correndo. Administre seu tempo!`, getDormBackground());
    
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
function dispararEventoAleatorio() {
    let chance = Math.random();
    
    // Bloqueio das Espadas da Luz Reveladora
    if (player.reliquias.includes('espadas_luz') && player.mes === 1) return false; 
    
    if (chance < 0.7) return false; 

    clearInterval(idleTimer);
    
    let reqAtk = 5 + (player.mes * 4) + (player.semana * 2) + Math.floor(Math.random() * 5); 
    let custoFuga = 15 + (player.mes * 20);

    showDialog(`<span style="color:var(--danger)">⚠️ EMBOSCADA!</span><br>Um veterano furioso bloqueia seu caminho! "Pague o pedágio de ${custoFuga} DP ou duele!"<br><br><i>A postura dele é intimidadora. Você não tem certeza se o seu ATK (${player.atk}) é suficiente para vencê-lo...</i>`, imgs.bg_abandoned);

    // CORREÇÃO: Declarando a variável botoes com 'let'
    let botoes = `
        <button onclick="resolverEventoAtaque(${reqAtk})" class="btn-danger">Arriscar Duelo</button>
        <button onclick="pagarValentao(${custoFuga})" style="background:#f39c12">Pagar ${custoFuga} DP e Fugir</button>
    `;

    // Verifica se o jogador tem a Força Espelho
    if (player.reliquias.includes('forca_espelho')) {
        botoes += `<button onclick="ativarArmadilhaBatalha('forca_espelho')" style="background:#bc1c6c; color: white; border-color: #fff;">Ativar Armadilha: Força Espelho</button>`;
    }
    
    renderButtons(botoes);
    
    return true; 
}

function ativarArmadilhaBatalha(id) {
    if (id === 'forca_espelho') {
        // Remove a carta da mão
        let index = player.reliquias.indexOf('forca_espelho');
        player.reliquias.splice(index, 1);
        renderizarMao();

        let recompensa = 25 * player.mes;
        player.dp += recompensa;
        updateHUD();
        
        showDialog(`<b>VOCÊ ATIVOU UMA CARTA ARMADILHA!</b><br>A <b>Força Espelho</b> estilhaçou o ataque do veterano e varreu o campo dele! Você venceu instantaneamente e pegou ${recompensa} DP!`, imgs.duel);
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Continuar Rotina</button>`);
    }
}

function resolverEventoAtaque(requisito) {
    if (player.atk >= requisito) {
        let recompensa = 25 * player.mes;
        // Bônus passivo do Des Koala (Monstro Ás)
        if (player.ace === 'koala') recompensa += 5;
        
        player.dp += recompensa;
        updateHUD();
        showDialog(`<span style="color:var(--success)"><b>VITÓRIA ESMAGADORA!</b></span><br>Você superou as expectativas e venceu! Recolheu <b>${recompensa} DP</b> do veterano.`, imgs.duel);
    } else {
        // Verifica se tem Força Espelho para refletir a derrota
        if (player.reliquias.includes('forca_espelho')) {
            player.reliquias = player.reliquias.filter(r => r !== 'forca_espelho');
            showDialog(`<b>DERROTA IMINENTE... MAS ESPERE!</b><br>Sua <b>Força Espelho</b> foi ativada, destruindo os monstros do oponente antes do ataque final! Você saiu ileso, mas a carta foi consumida.`, imgs.duel);
        } else {
            player.hp--;
            showDialog(`<span style="color:var(--danger)"><b>DERROTA!</b></span><br>Os monstros dele eram muito mais fortes (${requisito} ATK). Você apanhou no duelo e perdeu <b>1 HP</b> pelo desgaste.`, imgs.threat);
        }
        updateHUD();
    }

    if (player.hp <= 0) {
        checarMorte(); 
    } else {
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Continuar Rotina</button>`);
    }
}

function pagarValentao(custo) {
    if (player.dp >= custo) {
        player.dp -= custo;
        updateHUD();
        showDialog(`Você entregou os ${custo} DP. O valentão riu e te deixou passar. A dignidade dói, mas os Pontos de Vida estão intactos.`, imgs.threat);
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-primary">Engolir o orgulho e continuar</button>`);
    } else {
        showDialog(`Você não tem ${custo} DP! O valentão percebeu que você está quebrado e atacou!`, imgs.threat);
        // Força a derrota automaticamente já que não tem dinheiro nem quis lutar
        renderButtons(`<button onclick="resolverEventoAtaque(9999)" class="btn-danger">Sofrer as consequências</button>`);
    }
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
    
    showDialog(`<span style="color:var(--gold)">🎓 AULA DE SEXTA!</span><br>Prof. Crowler exige sua atenção:<br><br><b>${t.q}</b>`, imgs.bg_academy);
    
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
        <button onclick="comprarLoja('reborn', 600)" style="background:#c0392b">Relíquia: Monster Reborn (600 DP)</button>
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
        if (player.hp < player.maxHp) {
            player.hp++;
            showDialog("Você comeu na hora e recuperou 1 HP.", imgs.shop);
        } else {
            player.consumiveis.push({ id: 'ovo', nome: 'Pão de Ovo Seguro' });
            showDialog("Seu HP está cheio! Você guardou o Pão de Ovo na mochila.", imgs.shop);
        }
    } else if (item === 'pote') {
        if(!player.reliquias.includes('pote')) player.reliquias.push('pote');
        showDialog("Você comprou o Pote da Ganância! Agora seus duelos geram +50% DP no modo Idle.", imgs.shop);
    } else if (item === 'reborn') {
        if(!player.reliquias.includes('reborn')) player.reliquias.push('reborn');
        showDialog("Você comprou o Monster Reborn! Ele vai te salvar automaticamente de um golpe fatal.", imgs.shop);
    }

    updateHUD();
    
    if (player.hp <= 0) {
        renderButtons(`<button onclick="checarMorte()">Continuar</button>`);
    }
}

// --- FIM DE JOGO ---
// --- EXAMES FINAIS E PUZZLES ---
function iniciarExameFinal() {
    clearInterval(idleTimer);
    
    // Fallback de segurança caso o ano ainda não tenha puzzle (ex: Ano 2)
    let anoExame = puzzlesExame[player.ano] ? player.ano : 1; 
    let puzzle = puzzlesExame[anoExame];
    let puzzleDeck = puzzle[player.deck];

    showDialog(`<span style="color:var(--danger)">🔥 EXAME PRÁTICO DO ${player.ano}º ANO! 🔥</span><br><b>Oponente: ${puzzle.bossName}</b><br><br>${puzzleDeck.texto}`, imgs.bg_academy, puzzle.bossImg);
    
    let botoesHTML = puzzleDeck.opcoes.map((opc, index) => {
        return `<button onclick="resolverPuzzleExame(${anoExame}, '${player.deck}', ${index})" class="btn-primary" style="margin-bottom: 5px; font-size: 13px; text-transform: none;">${opc.texto}</button>`;
    }).join('');

    renderButtons(botoesHTML);
}

function resolverPuzzleExame(anoExame, deckId, opcIndex) {
    let puzzle = puzzlesExame[anoExame][deckId];
    let escolha = puzzle.opcoes[opcIndex];
    let statAtual = escolha.stat === 'atk' ? player.atk : player.int;

    if (escolha.correto && statAtual >= escolha.req) {
        // VITÓRIA
        player.ano++;
        player.mes = 1;
        player.semana = 1;
        player.diaIndex = 0;
        
        // Progressão de Dormitório
        if (player.ano === 2) player.dormitorio = "Rá Amarelo";
        if (player.ano === 3) player.dormitorio = "Obelisco Azul";

        updateHUD();
        showDialog(`<span style="color:var(--success)"><b>VITÓRIA NO EXAME!</b></span><br>${escolha.msg}<br><br>Passaste de ano com distinção. Bem-vindo ao teu novo dormitório: <b>${player.dormitorio}</b>!`, imgs.bg_academy);
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Iniciar ${player.ano}º Ano</button>`);
    
    } else if (escolha.correto && statAtual < escolha.req) {
        // FALHA POR FALTA DE STATS
        player.hp -= 2;
        showDialog(`<span style="color:var(--danger)"><b>FALTOU PODER!</b></span><br>A ideia era boa, mas só tinhas ${statAtual} de ${escolha.stat.toUpperCase()} (Exigia ${escolha.req}). Foste esmagado!<br><br><b>Perdeste 2 HP.</b>`, imgs.threat);
        verificarMorteExame();
    
    } else {
        // ESCOLHA ERRADA
        player.hp -= 2;
        showDialog(`<span style="color:var(--danger)"><b>JOGADA TERRÍVEL!</b></span><br>${escolha.msg}<br><br><b>Perdeste 2 HP.</b>`, imgs.threat);
        verificarMorteExame();
    }
}

function verificarMorteExame() {
    updateHUD();
    if (player.hp <= 0) {
        if (player.reliquias.includes('monstro_reborn')) {
            player.hp = 1;
            player.reliquias = player.reliquias.filter(r => r !== 'monstro_reborn');
            updateHUD();
            renderizarMao();
            showDialog(`<b>GOLPE FATAL!</b><br>A magia <b>Monstro Reborn</b> ativou-se a partir da tua mão! Sobreviveste com 1 HP e podes continuar o exame!`, imgs.bg_academy);
            renderButtons(`<button onclick="iniciarExameFinal()">Retomar Exame</button>`);
        } else {
            dispararGameOver("Foste obliterado no Exame Prático. Matrícula revogada.");
        }
    } else {
        renderButtons(`<button onclick="iniciarExameFinal()" class="btn-danger">Repensar Estratégia e Tentar Novamente</button>`);
    }
}

function checarMorte() {
    if (player.reliquias.includes('reborn')) {
        player.hp = 1;
        player.reliquias = player.reliquias.filter(r => r !== 'reborn'); // Consome a carta
        updateHUD();
        showDialog(`<b>GOLPE FATAL!</b><br>Mas a magia da sua carta <b>Monster Reborn</b> ativou! Você sobreviveu com 1 HP!`, imgs.duel);
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
