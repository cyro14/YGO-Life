// js/game.js

// Estado Global do Jogador
let player = {
    name: "", deck: "", ace: "", spirit: "", dormitorio: "Slifer Vermelho",
    hp: 3, maxHp: 3, dp: 0, atk: 0, int: 0,
    diaIndex: 0, semana: 1, mes: 1, ano: 1,
    foco: 'duelo',
    reliquias: [], equipamentos: [], consumiveis: [],
    equipados: { disco: null, deckbox: null }, // Slots de equipamento
    parceirosDesbloqueados: [],
    amizades: { syrus: 0, jaden: 0, bastion: 0, zane: 0 },
    socialSemana: {}, protecaoEspadas: 0
};
window.estadoEvento = null;

// --- SISTEMA DE SAVE E VARIÁVEIS GLOBAIS ---
let currentSlot = 1;
let globalData = { desbloqueados: [] }; // Guarda IDs de tudo que já foi visto/comprado

const SAVE_PREFIX = "ygo_idle_slot_";
const GLOBAL_KEY = "ygo_idle_global";
const LAST_SLOT_KEY = "ygo_idle_last_slot";

function salvarGlobal() {
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(globalData));
}

function registrarDesbloqueio(id) {
    if (!globalData.desbloqueados.includes(id)) {
        globalData.desbloqueados.push(id);
        salvarGlobal();
    }
}

function autoSave() {
    localStorage.setItem(SAVE_PREFIX + currentSlot, JSON.stringify(player));
    localStorage.setItem(LAST_SLOT_KEY, currentSlot);
}

// --- CONTROLE DOS MENUS INICIAIS ---
window.onload = () => {
    carregarDadosGlobais();
    renderizarMenuInicial();

    // Força o bloqueio de todas as outras telas no carregamento
    document.getElementById('screen-creation').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('stage').style.display = 'none';

    document.getElementById('screen-main-menu').style.display = 'flex';
};

function carregarDadosGlobais() {
    let gData = localStorage.getItem(GLOBAL_KEY);
    if (gData) globalData = JSON.parse(gData);

    let btnCont = document.getElementById('btn-continuar');
    let last = localStorage.getItem(LAST_SLOT_KEY);

    // Desabilita o botão se não houver jogo salvo
    if (!last || !localStorage.getItem(SAVE_PREFIX + last)) {
        btnCont.disabled = true;
        btnCont.style.background = '#333';
        btnCont.style.cursor = 'not-allowed';
        btnCont.innerText = '▶ Continuar (Nenhum Save)';
    } else {
        btnCont.disabled = false;
        btnCont.style.background = '#e74c3c'; // Cor do botão principal
        btnCont.style.cursor = 'pointer';
        btnCont.innerText = '▶ Continuar (Último Save)';
    }
}

function continuarJogo() {
    let lastSlot = localStorage.getItem(LAST_SLOT_KEY);
    let data = localStorage.getItem(SAVE_PREFIX + lastSlot);

    if (data) {
        player = JSON.parse(data);
        currentSlot = lastSlot;
        document.getElementById('screen-main-menu').style.display = 'none';
        iniciarJogoCarregado();
    }
}

function iniciarJogoCarregado() {
    document.getElementById('screen-creation').style.display = 'none';
    document.getElementById('screen-main-menu').style.display = 'none';

    document.getElementById('hud').style.display = 'flex';
    document.getElementById('idle-progress-container').style.display = 'block';
    document.getElementById('stage').style.display = 'flex';
    document.getElementById('dialog-box').style.display = 'block';
    document.getElementById('action-panel').style.display = 'flex';
    document.getElementById('player-hand').style.display = 'flex';

    updateHUD();
    renderizarMao();
    iniciarIdleLoop();
}

function abrirSlotsNovoJogo() {
    let container = document.getElementById('slots-container');
    container.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
        let saveInfo = localStorage.getItem(SAVE_PREFIX + i);

        if (saveInfo) {
            let pData = JSON.parse(saveInfo);
            // Slot Ocupado (Mostra opções de Carregar ou Substituir)
            container.innerHTML += `
                <div style="background: #27ae60; padding: 10px; border: 1px solid #444; color: #fff; margin-bottom: 8px; border-radius: 5px;">
                    <div style="margin-bottom: 10px; font-weight: bold;">Slot ${i}: ${pData.name} (Ano ${pData.ano})</div>
                    <div style="display: flex; gap: 5px; justify-content: center;">
                        <button onclick="carregarSlotEspecifico(${i})" style="background: #2980b9; padding: 8px; font-size: 12px; border: none; border-radius: 3px; cursor: pointer;">Carregar Jogo</button>
                        <button onclick="confirmarNovoJogo(${i})" style="background: #c0392b; padding: 8px; font-size: 12px; border: none; border-radius: 3px; cursor: pointer;">Apagar e Novo</button>
                    </div>
                </div>
            `;
        } else {
            // Slot Vazio
            container.innerHTML += `<button onclick="iniciarCriacaoNovoJogo(${i})" style="background: #222; padding: 15px; border: 1px solid #444; color: #fff; cursor: pointer; border-radius: 5px; margin-bottom: 8px; width: 100%;">Slot ${i} - Vazio</button>`;
        }
    }

    document.getElementById('modal-slots').style.display = 'flex';
}

function carregarSlotEspecifico(slot) {
    let data = localStorage.getItem(SAVE_PREFIX + slot);
    if (data) {
        player = JSON.parse(data);
        currentSlot = slot;
        localStorage.setItem(LAST_SLOT_KEY, slot); // Define como o último jogado
        fecharSlots();
        document.getElementById('screen-main-menu').style.display = 'none';
        iniciarJogoCarregado();
    }
}

function confirmarNovoJogo(slot) {
    if (confirm("Tem certeza que deseja APAGAR este jogo salvo? O progresso será perdido para sempre!")) {
        iniciarCriacaoNovoJogo(slot);
    }
}

function fecharSlots() {
    document.getElementById('modal-slots').style.display = 'none';
}

function iniciarCriacaoNovoJogo(slot) {
    currentSlot = slot;
    document.getElementById('modal-slots').style.display = 'none';
    document.getElementById('screen-main-menu').style.display = 'none'; // Esconde o menu principal
    ui.creation.style.display = 'flex'; // Mostra a tela de criação

    // Reseta o player para o padrão antes de começar
    player = {
        name: "", deck: "", ace: "", spirit: "", dormitorio: "Slifer Vermelho",
        hp: 3, maxHp: 3, dp: 0, atk: 0, int: 0,
        diaIndex: 0, semana: 1, mes: 1, ano: 1,
        foco: 'duelo', reliquias: [], equipamentos: [], consumiveis: [],
        equipados: { disco: null, deckbox: null },
        parceirosDesbloqueados: [], amizades: { syrus: 0, jaden: 0, bastion: 0, zane: 0 },
        socialSemana: {}
    };
}

function travarMenu(travado) {
    let btnHome = document.getElementById('btn-home');
    if (btnHome) {
        btnHome.disabled = travado;
        btnHome.style.opacity = travado ? '0.3' : '1';
        btnHome.style.cursor = travado ? 'not-allowed' : 'pointer';
    }
}

let abaColecaoAtual = 'cartas';

function abrirColecoes() {
    document.getElementById('modal-colecoes').style.display = 'flex';
    renderizarAbaColecao('cartas');
}

function fecharColecoes() {
    document.getElementById('modal-colecoes').style.display = 'none';
    fecharZoomDex();
}

function renderizarAbaColecao(aba) {
    abaColecaoAtual = aba;
    let cont = document.getElementById('colecoes-conteudo');
    
    // Altera a cor das abas visualmente
    ['cartas', 'lanches', 'personagens'].forEach(a => {
        let btn = document.getElementById(`aba-col-${a}`);
        if(btn) btn.style.background = (a === aba) ? '#8e44ad' : '#333';
    });

    let listaAlvo = [];
    if (aba === 'cartas') {
        listaAlvo = lojaItens.filter(i => i.tipo === 'reliquia_real' || i.tipo === 'reliquia');
    } else if (aba === 'lanches') {
        listaAlvo = lojaItens.filter(i => i.tipo === 'consumivel_real' || i.tipo === 'consumivel');
    } else if (aba === 'personagens') {
        // Puxa os parceiros do array global de Tag Force
        listaAlvo = parceiros; 
    }

    let total = listaAlvo.length;
    let descobertos = 0;
    let html = '';

    listaAlvo.forEach(item => {
        let itemId = item.id;
        
        // Sincronização retroativa: se já o tem no PDA mas falhou o save global antes, corrige agora
        if (aba === 'personagens' && player.parceirosDesbloqueados.includes(itemId)) {
            registrarDesbloqueio(itemId);
        }
        
        let isDesbloqueado = globalData.desbloqueados.includes(itemId);
        
        if (isDesbloqueado) descobertos++;

        let classeExtra = isDesbloqueado ? '' : 'pokedex-oculta';
        let nomeExibicao = isDesbloqueado ? item.nome : '???';
        let imgRender = isDesbloqueado ? (item.img || 'assets/images/pxArt.png') : 'assets/images/pxArt.png';

        let safeNome = encodeURIComponent(item.nome || item.nome);
        let safeDesc = encodeURIComponent(item.desc || item.bonusDesc || 'Sem descrição.');
        let safeImg = encodeURIComponent(imgRender);

        // Lógica visual dos corações
        let coracoesHtml = '';
        if (aba === 'personagens' && isDesbloqueado) {
            let nivel = player.amizades[itemId] || 0;
            let displayCoracoes = '❤️'.repeat(nivel) + '🤍'.repeat(5 - nivel);
            coracoesHtml = `<div style="font-size: 8px; margin-top: 4px; letter-spacing: -1px;">${displayCoracoes}</div>`;
        }

        html += `
        <div class="card-item ${classeExtra}" onclick="inspecionarDex(${isDesbloqueado}, '${safeNome}', '${safeDesc}', '${safeImg}')" style="background:#1a1a1a; border:1px solid #444; border-radius:6px; padding:8px; text-align:center; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <img src="${imgRender}" style="height: 55px; width: 45px; object-fit: cover; border-radius: 3px; margin-bottom: 3px;">
            <div style="font-size: 10px; color: ${isDesbloqueado ? '#fff' : '#666'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${nomeExibicao}</div>
            ${coracoesHtml}
        </div>`;
    });
    document.getElementById('dex-progresso').innerText = `${descobertos} / ${total} Descobertos`;
    cont.innerHTML = html;
}

function inspecionarDex(desbloqueado, safeNome, safeDesc, safeImg) {
    let nome = decodeURIComponent(safeNome);
    let desc = decodeURIComponent(safeDesc);
    let img = decodeURIComponent(safeImg);

    if (!desbloqueado) {
        nome = "???";
        desc = "Você ainda não encontrou este item ou carta na sua jornada pela academia.";
        img = "assets/images/pxArt.png";
    }

    document.getElementById('zoom-dex-img').src = img;
    document.getElementById('zoom-dex-nome').innerText = nome;
    document.getElementById('zoom-dex-desc').innerText = desc;
    document.getElementById('modal-dex-zoom').style.display = 'flex';
}

function fecharZoomDex() {
    document.getElementById('modal-dex-zoom').style.display = 'none';
}

let abaAtual = 'consumiveis'; // Controla a aba aberta do inventário

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

// --- CONTROLE DE TELA CHEIA ---
function toggleFullScreen() {
    let elem = document.documentElement; // Pega a página inteira

    if (!document.fullscreenElement) {
        // Tenta entrar em tela cheia
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    } else {
        // Tenta sair da tela cheia
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
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
        if (!item) return `<div style="color: red; font-size: 12px;">Erro: Carta ${relId}</div>`;

        // Verde para Magia, Rosa/Roxo para Armadilha
        let bgCor = item.subTipo === 'armadilha' ? '#bc1c6c' : '#009966';
        let imgUrl = item.img || 'assets/images/pxArt.png';

        // Substitui o bloco de texto pela imagem da carta real
        return `
            <div onclick="abrirDetalhesCarta('${relId}', ${index})" style="cursor: pointer; flex-shrink: 0; width: 55px; height: 80px; border-radius: 4px; overflow: hidden; border: 2px solid ${bgCor}; box-shadow: 2px 2px 5px rgba(0,0,0,0.5);">
                <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/pxArt.png'">
            </div>
        `;
    }).join('');
}

function abrirDetalhesCarta(relId, index) {
    let item = lojaItens.find(i => i.id === relId);
    if (!item) return;

    // Preenche as informações do modal
    document.getElementById('detalhe-carta-img').src = item.img || 'assets/images/pxArt.png';
    document.getElementById('detalhe-carta-nome').innerText = item.nome;
    document.getElementById('detalhe-carta-desc').innerText = item.desc;

    // Define os botões dependendo do tipo da carta
    let acoesHtml = `<button onclick="fecharDetalhesCarta()" style="background: #555; padding: 10px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; color: white;">Guardar</button>`;

    if (item.subTipo === 'armadilha') {
        // Armadilhas ficam na mão aguardando uma emboscada
        acoesHtml += `<button disabled style="background: #bc1c6c; padding: 10px; font-size: 13px; border: none; border-radius: 4px; color: white; opacity: 0.5;">Ativação Automática (Aguardando Evento)</button>`;
    } else {
        // Magias podem ser ativadas no clique
        acoesHtml += `<button onclick="fecharDetalhesCarta(); tentarAtivarCarta('${relId}', ${index});" style="background: #009966; padding: 10px; font-size: 13px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold;">Ativar Magia</button>`;
    }

    document.getElementById('detalhe-carta-acoes').innerHTML = acoesHtml;
    document.getElementById('modal-carta').style.display = 'flex';
}

function fecharDetalhesCarta() {
    document.getElementById('modal-carta').style.display = 'none';
}

function tentarAtivarCarta(relId, index) {
    let item = lojaItens.find(i => i.id === relId);

    if (item.subTipo === 'armadilha') {
        // Armadilhas não podem ser ativadas no modo livre, precisam de um "Gatilho"
        alert("Armadilhas só podem ser ativadas em resposta a um evento (ex: durante emboscadas)!");
        return;
    }

    // Dentro da função tentarAtivarCarta(relId, index)...

    // Processa Magias Normais
    if (item.id === 'pote_ganancia') {
        player.dp += 400;
        showDialog(`Você ativou a Magia <b>Pote da Ganância</b> e comprou 400 DP diretamente para o seu bolso!`, imgs.hub);
        player.reliquias.splice(index, 1);
    }
    else if (item.id === 'monster_reborn') {
        if (player.hp >= player.maxHp) {
            alert("Seu HP já está no máximo!");
            return;
        }
        player.hp = player.maxHp;
        showDialog(`Você ativou <b>Monstro Reborn</b>! Você sente como se fosse recém-resuscitado.`, imgs.hub);
        player.reliquias.splice(index, 1);
    }
    else if (item.id === 'tufao') {
        if (window.estadoEvento === 'trivia') {
            player.int += 15;
            window.estadoEvento = null;
            showDialog(`Você ativou <b>Tufão Espacial Místico</b>! A rajada de vento soprou os papéis do teste do Crowler para fora da janela. Ele ficou confuso e te deu a nota máxima de graça!`, imgs.bg_academy);
            player.reliquias.splice(index, 1); // Consome a carta

            player.diaIndex++; // Avança para Sábado
            updateHUD();
            renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Aproveitar Fim de Semana</button>`);
        } else {
            alert("Guarde isto! O Tufão Espacial Místico só pode ser ativado durante a Aula de Sexta do Prof. Crowler!");
            return; // Impede o gasto à toa, retorna sem dar splice na carta
        }
    }
    else if (item.id === 'espadas_luz') {
        player.protecaoEspadas = 3;
        showDialog(`Você ativou <b>Espadas da Luz Reveladora</b>! As lâminas flutuam ao seu redor, prontas para bloquear e afastar as próximas 3 emboscadas!`, imgs.bg_academy);
        player.reliquias.splice(index, 1);
    }

    updateHUD();
    renderizarMao();
}

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

// --- SISTEMA SOCIAL (TAG FORCE) ---
function abrirSocial() {
    document.getElementById('modal-social').style.display = 'flex';
    renderizarSocial();
}

function fecharSocial() {
    document.getElementById('modal-social').style.display = 'none';
}

function renderizarSocial() {
    let cont = document.getElementById('social-conteudo');
    if (player.parceirosDesbloqueados.length === 0) {
        cont.innerHTML = `<div style="text-align:center; color:#888; margin-top:50px;">Ainda não conheces ninguém. Continua a explorar!</div>`;
        return;
    }

    let html = '';
    player.parceirosDesbloqueados.forEach(id => {
        let p = parceiros.find(x => x.id === id);
        let coracoes = player.amizades[id];
        let displayCoracoes = '❤️'.repeat(coracoes) + '🤍'.repeat(5 - coracoes);

        let statusBonus = coracoes >= 3
            ? `<span style="color:#27ae60; font-weight:bold;">Bônus Ativo</span>`
            : `<span style="color:#e74c3c;">Desbloqueia aos 3 ❤️</span>`;

        // Verifica se já interagiu nesta semana
        let interagiu = player.socialSemana[id] || { chat: false, gift: false };

        let btnChat = interagiu.chat
            ? `<button disabled style="flex:1; padding:5px; font-size:11px; background:#555;">Já Conversou</button>`
            : `<button onclick="iniciarConversa('${id}')" style="flex:1; padding:5px; font-size:11px; background:#2980b9;">Conversar</button>`;

        let btnGift = (interagiu.gift || coracoes >= 5)
            ? `<button disabled style="flex:1; padding:5px; font-size:11px; background:#555;">${coracoes >= 5 ? 'Amizade Máxima' : 'Já Presenteou'}</button>`
            : `<button onclick="presentearParceiro('${id}')" style="flex:1; padding:5px; font-size:11px; background:#27ae60;">Lanche (100 DP)</button>`;

        html += `
        <div style="background:#222; padding:10px; margin-bottom:10px; border-radius:5px; border:1px solid #555; display:flex; gap:10px;">
            <div style="width:60px; height:60px; background:#111; border:1px solid #444; border-radius:5px; overflow:hidden;">
                <img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="flex:1;">
                <b style="color:var(--gold);">${p.nome}</b> (${p.raridade})<br>
                <div style="font-size:16px; margin: 5px 0;">${displayCoracoes}</div>
                <div style="font-size:10px; color:#aaa;">${p.bonusDesc} (${statusBonus})</div>
                <div style="margin-top:10px; display:flex; gap:5px;">${btnChat}${btnGift}</div>
            </div>
        </div>`;
    });
    cont.innerHTML = html;
}

function iniciarConversa(id) {
    travarMenu(true); // Bloqueia o botão Home durante a conversa
    fecharSocial(); // Fecha o PDA para mostrar a conversa no palco principal
    let p = parceiros.find(x => x.id === id);

    // Sorteia uma pergunta
    let conv = bancoConversas[Math.floor(Math.random() * bancoConversas.length)];

    // Mistura as opções
    let opcoes = [
        { txt: conv.certa, correto: true },
        { txt: conv.erradas[0], correto: false },
        { txt: conv.erradas[1], correto: false }
    ];
    opcoes.sort(() => Math.random() - 0.5);

    showDialog(`<b>${p.nome}</b> te faz uma pergunta:<br><br>"${conv.fala}"`, imgs.bg_academy, p.img);

    let botoesHTML = opcoes.map(opc => {
        return `<button onclick="responderConversa('${id}', ${opc.correto})" class="btn-primary" style="margin-bottom:5px; font-size:12px; text-transform:none;">${opc.txt}</button>`;
    }).join('');

    renderButtons(botoesHTML);
}

function responderConversa(id, acertou) {
    let p = parceiros.find(x => x.id === id);

    if (!player.socialSemana[id]) player.socialSemana[id] = { chat: false, gift: false };
    player.socialSemana[id].chat = true; // Bloqueia chat até semana que vem

    if (acertou) {
        if (player.amizades[id] < 5) player.amizades[id]++;
        aplicarPenalidadeZane(id);
        updateHUD();
        showDialog(`<b>${p.nome}:</b> "Exatamente! Pensamos da mesma forma."<br><br><span style="color:var(--success);">❤️ A amizade aumentou!</span>`, imgs.bg_academy, p.img);
    } else {
        showDialog(`<b>${p.nome}:</b> "Sério? Eu não concordo muito com isso..."<br><br><span style="color:var(--danger);">O clima ficou constrangedor. A amizade não mudou.</span>`, imgs.bg_academy, p.img);
    }

    renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Continuar</button>`);
}

function presentearParceiro(id) {
    if (player.dp < 100) return;

    player.dp -= 100;

    if (!player.socialSemana[id]) player.socialSemana[id] = { chat: false, gift: false };
    player.socialSemana[id].gift = true; // Bloqueia presente até semana que vem

    if (player.amizades[id] < 5) player.amizades[id]++;

    aplicarPenalidadeZane(id);
    updateHUD();
    renderizarSocial();
}

function aplicarPenalidadeZane(id) {
    if (id === 'zane' && player.amizades[id] === 3) {
        player.maxHp -= 2;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
        alert("O treino com Zane é brutal. Desbloqueaste o bônus dele, mas perdeste 2 HP Máximo permanente!");
        updateHUD();
    }
}

// Verifica de forma rápida se um bónus está ativo
function temBonus(id) {
    return player.parceirosDesbloqueados.includes(id) && player.amizades[id] >= 3;
}

function dispararEventoSocial() {
    let chance = Math.random();
    if (chance < 0.8) return false; 

    // Filtra quem pode ser encontrado no ano atual e que ainda não conheces
    let possiveis = parceiros.filter(p => p.anoReq <= player.ano && !player.parceirosDesbloqueados.includes(p.id));

    if (possiveis.length === 0) return false;

    // EVENTO ACONTECEU: Trava o menu e pausa o jogo
    travarMenu(true);
    clearInterval(idleTimer);
    
    let novoAmigo = possiveis[Math.floor(Math.random() * possiveis.length)];
    
    // Regista no save da run atual e no save global (Dex)
    player.parceirosDesbloqueados.push(novoAmigo.id);
    registrarDesbloqueio(novoAmigo.id);
    autoSave();

    showDialog(`<span style="color:#2980b9">🤝 NOVO ENCONTRO!</span><br>Cruzaste com <b>${novoAmigo.nome}</b> no pátio da Academia! Agora tens o contacto dele no teu PDA. Aumenta a amizade para desbloquear o bónus passivo.`, imgs.bg_academy, novoAmigo.img);

    renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-primary">Cumprimentar e seguir caminho</button>`);
    return true;
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

    // BLINDAGEM: Força as telas antigas a sumirem
    document.getElementById('screen-creation').style.display = 'none';
    document.getElementById('screen-main-menu').style.display = 'none';

    // Mostra as telas do jogo
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('idle-progress-container').style.display = 'block';
    document.getElementById('stage').style.display = 'flex';
    document.getElementById('dialog-box').style.display = 'block';
    document.getElementById('action-panel').style.display = 'flex';
    document.getElementById('player-hand').style.display = 'flex';

    updateHUD();

    let checkFs = document.getElementById('check-fullscreen');
    if (checkFs && checkFs.checked) {
        toggleFullScreen();
    }

    iniciarExameAdmissao();
}

// --- MOTOR DE TEMPO (CALENDÁRIO) ---
function iniciarIdleLoop() {
    travarMenu(false);
    window.estadoEvento = null;
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

        // Bónus Jaden (Dobra DP) e Zane (Dobra ATK)
        if (temBonus('jaden')) ganhoDp *= 2;
        if (temBonus('zane')) ganhoAtk *= 2;

        // Modificador do Pote da Ganância (Atenção ao ID correto da carta)
        if (player.reliquias.includes('pote_ganancia')) {
            ganhoDp = Math.floor(ganhoDp * 1.5);
        }

        player.atk += ganhoAtk;
        player.dp += ganhoDp;
    } else {
        // CORREÇÃO: Faltava declarar e calcular o ganhoInt antes de multiplicar
        let ganhoInt = Math.floor(Math.random() * 4) + 2;

        if (temBonus('bastion')) ganhoInt = Math.floor(ganhoInt * 1.5);

        player.int += ganhoInt;
    }

    // 2. Avança o calendário
    player.diaIndex++;
    if (player.diaIndex > 6) {
        player.diaIndex = 0; // Volta pra Segunda
        player.semana++;
        player.socialSemana = {};
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

        // 4. Se for um dia normal de aula, rola os dados para ver se sofre um evento aleatório
        if (dispararEventoAleatorio()) {
            return; // Interrompe se sofreu emboscada
        }
        else if (dispararEventoSocial()) {
            return; // Interrompe se encontrou um parceiro
        }

        // Reseta a barra visual para o próximo dia se nada aconteceu
        ui.progBar.style.transition = 'none';
        ui.progBar.style.width = '0%';
        setTimeout(() => {
            ui.progBar.style.transition = `width ${duracaoDiaMs}ms linear`;
            ui.progBar.style.width = '100%';
        }, 50);
    }

    autoSave();
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

    if (player.protecaoEspadas > 0) {
        player.protecaoEspadas--;
        travarMenu(true);
        clearInterval(idleTimer);
        showDialog(`Um valentão saltou das sombras, mas as <b>Espadas da Luz Reveladora</b> formaram uma barreira intransponível! Ele fugiu cego.<br><br><i>(Cargas restantes das Espadas: ${player.protecaoEspadas})</i>`, imgs.bg_academy);
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Continuar</button>`);
        return true;
    }

    travarMenu(true);

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
    travarMenu(true);
    let t = bancoTrivia[Math.floor(Math.random() * bancoTrivia.length)];
    window.estadoEvento = 'trivia'; // Informa ao jogo que o Quiz começou

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

    if (player.hp <= 0) {
        renderButtons(`<button onclick="dispararGameOver('Exaustão mental crônica.')">Finalizar</button>`);
    } else {
        // Avança para Sábado
        player.diaIndex++;
        updateHUD();
        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Aproveitar Fim de Semana</button>`);
    }
}

// --- SISTEMA DE LOJA ---
function acaoLoja() {
    travarMenu(true);
    clearInterval(idleTimer);
    showDialog("Dona Dorothy: 'Bem-vindo! As prateleiras estão organizadas. O que procura?'", imgs.shop);
    renderButtons(`
        <button onclick="mostrarLojaCategoria('consumivel')" style="background:#27ae60">Comprar Lanches</button>
        <button onclick="mostrarLojaCategoria('reliquia')" style="background:#8e44ad">Comprar Cartas (Mágicas/Armadilhas)</button>
        <button onclick="mostrarLojaCategoria('equipamento')" style="background:#2980b9">Comprar Equipamentos</button>
        <button onclick="iniciarIdleLoop()">Sair da Loja</button>
    `);
}

function mostrarLojaCategoria(categoria) {
    // Filtra apenas o que é exibível na prateleira daquela categoria
    let itensCategoria = lojaItens.filter(i => i.tipo === categoria && i.naPrateleira === true);
    let multiplicador = temBonus('syrus') ? 0.5 : 1;

    let botoes = itensCategoria.map(i => {
        // Lanches e Boosters agora podem ser comprados repetidamente. Só os equipamentos esgotam.
        let jaPossui = i.tipo === 'equipamento' ? player.equipamentos.includes(i.id) : false;

        let custoReal = Math.floor(i.custo * multiplicador);
        let status = jaPossui ? "disabled" : "";
        let texto = jaPossui ? "Esgotado" : `${custoReal} DP`;

        return `<button onclick="comprarLoja('${i.id}')" ${status} style="font-size: 12px; text-transform: none; text-align: left;">
                    <b>${i.nome}</b> (${texto})<br><span style="font-size: 10px; color:#ccc;">${i.desc}</span>
                </button>`;
    }).join('');

    botoes += `<button onclick="acaoLoja()" style="background:#555">Voltar às Categorias</button>`;
    renderButtons(botoes);
}

function comprarLoja(id) {
    let item = lojaItens.find(x => x.id === id);
    let multiplicador = temBonus('syrus') ? 0.5 : 1;
    let custoReal = Math.floor(item.custo * multiplicador);

    if (player.dp < custoReal) {
        showDialog(`Dona Dorothy: 'Você não tem ${custoReal} DP suficiente para isso!'`, imgs.shop);
        return;
    }

    player.dp -= custoReal;

    if (id === 'compra_lanche') {
        let poolLanches = lojaItens.filter(i => i.tipo === 'consumivel_real');
        // Chance igual para todos por enquanto. Pode adicionar peso matemático no futuro.
        let sorteado = poolLanches[Math.floor(Math.random() * poolLanches.length)];

        player.consumiveis.push(sorteado.id);
        registrarDesbloqueio(sorteado.id);
        showDialog(`Dona Dorothy te entregou o embrulho. Você abriu e era um <b>${sorteado.nome}</b>! Vai para a mochila.`, imgs.shop);

    } else if (id === 'compra_booster_simples') {
        let poolCartas = lojaItens.filter(i => i.tipo === 'reliquia_real');
        let sorteada = poolCartas[Math.floor(Math.random() * poolCartas.length)];

        player.reliquias.push(sorteada.id);
        registrarDesbloqueio(sorteada.id);

        renderizarMao();
        showDialog(`Você abriu o Booster Simples e tirou:<br><br>🎴 <b>${sorteada.nome}</b>`, imgs.shop);

    } else if (id === 'compra_booster_triplo') {
        let poolCartas = lojaItens.filter(i => i.tipo === 'reliquia_real');
        let sorteados = [];

        for (let i = 0; i < 3; i++) {
            sorteados.push(poolCartas[Math.floor(Math.random() * poolCartas.length)]);
        }

        let nomesHTML = sorteados.map(s => {
            player.reliquias.push(s.id);
            registrarDesbloqueio(s.id);
            return `🎴 <b>${s.nome}</b>`;
        }).join('<br>');

        renderizarMao();
        showDialog(`Você rasgou o Booster Triplo e encontrou 3 cartas:<br><br>${nomesHTML}`, imgs.shop);
    } else if (item.tipo === 'equipamento') {
        player.equipamentos.push(item.id);
        registrarDesbloqueio(item.id);
        showDialog(`Compraste <b>${item.nome}</b>! Vá à mochila para equipar.`, imgs.shop);
    }

    autoSave();
    updateHUD();
    mostrarLojaCategoria(item.tipo);
}

// --- SISTEMA DE INVENTÁRIO (ESTILO GBA) ---
function abrirInventario() {
    document.getElementById('modal-inventario').style.display = 'flex';
    renderizarAbaInv(abaAtual);
}

function fecharInventario() {
    document.getElementById('modal-inventario').style.display = 'none';
}

function renderizarAbaInv(aba) {
    abaAtual = aba;
    let cont = document.getElementById('inv-conteudo');

    // Atualiza cores das abas
    ['consumiveis', 'reliquias', 'equipamentos'].forEach(a => {
        document.getElementById(`aba-${a}`).style.background = (a === aba) ? '#27ae60' : '#444';
    });

    let html = '';

    if (aba === 'consumiveis') {
        html += `<p style="color:var(--gold); font-weight:bold;">🥪 Bolso de Lanches</p>`;
        if (player.consumiveis.length === 0) html += `<i>Vazio</i>`;
        player.consumiveis.forEach((itemId, index) => {
            let item = lojaItens.find(i => i.id === itemId);
            let imgUrl = item.img || 'assets/images/pxArt.png';
            html += `<div style="background:#222; padding:8px; margin-bottom:5px; border-radius:5px; border:1px solid #555; display:flex; justify-content:space-between; align-items:center;">
                        <span>${item.nome}</span>
                        <button onclick="usarConsumivel(${index})" style="padding: 5px; font-size: 11px;">Consumir</button>
                     </div>`;
        });

    } else if (aba === 'reliquias') {
        html += `<p style="color:var(--gold); font-weight:bold;">🎴 Estojo de Cartas (Na Mão)</p>`;
        if (player.reliquias.length === 0) html += `<i>Nenhuma magia ou armadilha na mão.</i>`;
        player.reliquias.forEach(itemId => {
            let item = lojaItens.find(i => i.id === itemId);
            let imgUrl = item.img || 'assets/images/pxArt.png';
            html += `<div style="background:#222; padding:8px; margin-bottom:5px; border-radius:5px; border:1px solid #555;">
                        <b>${item.nome}</b><br><span style="font-size:11px; color:#aaa;">${item.desc}</span>
                     </div>`;
        });

    } else if (aba === 'equipamentos') {
        // Layout de Personagem à esquerda, Lista à direita
        let imgDisco = player.equipados.disco ? lojaItens.find(i => i.id === player.equipados.disco).nome : "Nenhum";
        let imgDeckbox = player.equipados.deckbox ? lojaItens.find(i => i.id === player.equipados.deckbox).nome : "Nenhuma";

        html += `
        <div style="display:flex; gap:10px;">
            <div style="flex:1; background:#111; border:1px solid var(--gold); border-radius:5px; padding:10px; text-align:center;">
                <div style="width:60px; height:60px; background:#333; border-radius:30px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center; font-size:24px;">👤</div>
                <div style="font-size:11px; color:#aaa; margin-bottom:5px;"><b>DISCO:</b><br>${imgDisco}</div>
                <div style="font-size:11px; color:#aaa;"><b>DECKBOX:</b><br>${imgDeckbox}</div>
            </div>
            
            <div style="flex:2;">
                <p style="margin-top:0; color:var(--gold); font-weight:bold;">Seus Equipamentos</p>
        `;

        if (player.equipamentos.length === 0) html += `<i>Você não comprou equipamentos.</i>`;
        player.equipamentos.forEach(itemId => {
            let item = lojaItens.find(i => i.id === itemId);
            let estaEquipado = (player.equipados.disco === itemId || player.equipados.deckbox === itemId);
            let btnAcao = estaEquipado
                ? `<button disabled style="padding:5px; font-size:10px; background:#555;">Equipado</button>`
                : `<button onclick="equiparItem('${itemId}')" style="padding:5px; font-size:10px; background:#2980b9;">Equipar</button>`;

            html += `<div style="background:#222; padding:8px; margin-bottom:5px; border-radius:5px; border:1px solid #555; display:flex; justify-content:space-between; align-items:center;">
                        <div><b>${item.nome}</b><br><span style="font-size:10px; color:#aaa;">${item.desc}</span></div>
                        ${btnAcao}
                     </div>`;
        });

        html += `</div></div>`;
    }

    cont.innerHTML = html;
}

// Lógica de Consumo (Otimizada)
function usarConsumivel(index) {
    let itemId = player.consumiveis[index];
    if (itemId === 'sanduiche_ovo' && player.hp >= player.maxHp) {
        alert("Seu HP já está no máximo!");
        return;
    }

    if (itemId === 'sanduiche_ovo') player.hp++;
    else if (itemId === 'sanduiche_estragado') player.hp += Math.random() < 0.5 ? 1 : -1;
    else if (itemId === 'sanduiche_dourado') player.hp = player.maxHp; // + Amizade seria adicionada aqui

    player.consumiveis.splice(index, 1);
    updateHUD();
    renderizarAbaInv('consumiveis');

    if (player.hp <= 0) {
        fecharInventario();
        checarMorte();
    }
}

// Lógica de Equipar
function equiparItem(itemId) {
    let item = lojaItens.find(i => i.id === itemId);

    if (itemId.includes('disco')) {
        player.equipados.disco = itemId;
    } else if (itemId.includes('deckbox')) {
        // Se já tinha deckbox antes, removemos o HP máximo antigo (para não acumular infinitamente)
        if (player.equipados.deckbox === 'deckbox_couro') player.maxHp -= 1;

        player.equipados.deckbox = itemId;

        // Aplica os buffs do novo equipamento
        if (itemId === 'deckbox_couro') player.maxHp += 1;
    }

    updateHUD();
    renderizarAbaInv('equipamentos');
}

// --- FIM DE JOGO ---
// --- EXAMES FINAIS E PUZZLES ---
function iniciarExameFinal() {
    travarMenu(true);
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

function iniciarExameAdmissao() {
    travarMenu(true);
    let puzzle = puzzlesExame[0]; // Ano 0 = Admissão
    let puzzleDeck = puzzle[player.deck];

    // Oponente pode ser um Instrutor comum ou o próprio Crowler (10% de chance para o easter egg, ou fixo no Crowler)
    let nomeOponente = Math.random() > 0.8 ? puzzle.bossName : "Instrutor da Academia";

    showDialog(`<span style="color:var(--danger)">⚠️ EXAME DE ADMISSÃO! ⚠️</span><br><b>Oponente: ${nomeOponente}</b><br><br>${puzzleDeck.texto}`, imgs.bg_academy, puzzle.bossImg);

    let botoesHTML = puzzleDeck.opcoes.map((opc, index) => {
        return `<button onclick="resolverPuzzleAdmissao('${player.deck}', ${index})" class="btn-primary" style="margin-bottom: 5px; font-size: 13px; text-transform: none;">${opc.texto}</button>`;
    }).join('');

    renderButtons(botoesHTML);
}

function resolverPuzzleAdmissao(deckId, opcIndex) {
    let puzzle = puzzlesExame[0][deckId];
    let escolha = puzzle.opcoes[opcIndex];
    let statAtual = escolha.stat === 'atk' ? player.atk : player.int;

    if (escolha.correto && statAtual >= escolha.req) {
        // PASSOU NA ADMISSÃO

        registrarDesbloqueio(player.ace);
        registrarDesbloqueio(player.spirit);

        showDialog(`<span style="color:var(--success)"><b>APROVADO!</b></span><br>${escolha.msg}<br><br>Você compensou a falta da prova teórica com um duelo brilhante. Devido à sua nota teórica zero, você foi designado para o dormitório de menor rank: <b>Slifer Vermelho</b>. Bem-vindo à Academia de Duelos!`, imgs.bg_academy);

        renderButtons(`<button onclick="iniciarIdleLoop()" class="btn-success">Ir para o Dormitório Slifer</button>`);

    } else {
        // GAME OVER PRECOCE
        showDialog(`<span style="color:var(--danger)"><b>REPROVADO!</b></span><br>${escolha.msg}<br><br>Sua performance foi pífia. Os seguranças da KaibaCorp estão escoltando você para fora da ilha.`, imgs.threat);

        renderButtons(`<button onclick="dispararGameOver('Reprovado no Exame Prático de Admissão.')" class="btn-danger">Fim de Jogo</button>`);
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

function voltarAoMenu() {
    // Pausa o jogo e salva o progresso imediatamente
    clearInterval(idleTimer);
    autoSave();

    // Esconde todas as interfaces do jogo atual
    document.getElementById('hud').style.display = 'none';
    document.getElementById('idle-progress-container').style.display = 'none';
    document.getElementById('stage').style.display = 'none';
    document.getElementById('dialog-box').style.display = 'none';
    document.getElementById('action-panel').style.display = 'none';
    document.getElementById('player-hand').style.display = 'none';
    document.getElementById('screen-creation').style.display = 'none';

    // Oculta os modais de inventário e social, caso estejam abertos
    document.getElementById('modal-inventario').style.display = 'none';
    document.getElementById('modal-social').style.display = 'none';

    // Exibe o Menu Principal e atualiza os dados
    carregarDadosGlobais(); // Atualiza a cor/estado do botão Continuar
    document.getElementById('screen-main-menu').style.display = 'flex';
}