const imgs = {
    hub: "https://images.ygoprodeck.com/images/cards/24094653.jpg", // Slifer Red Dorm
    hub_ra: "https://images.ygoprodeck.com/images/cards/32338002.jpg", // Ra Yellow
    hub_obelisk: "https://images.ygoprodeck.com/images/cards/10000000.jpg", // Obelisk Blue
    study: "https://images.ygoprodeck.com/images/cards/38033121.jpg",
    duel: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
    shop: "https://images.ygoprodeck.com/images/cards/55144522.jpg",
    threat: "https://images.ygoprodeck.com/images/cards/70781052.jpg"
};

const decksIniciais = [
    { id: 'hero', nome: 'Herói Elementar', baseAtk: 5, baseInt: 5, hp: 3, emoji: '🦸' },
    { id: 'roid', nome: 'Veículos Roid', baseAtk: 3, baseInt: 3, hp: 4, emoji: '🚁' },
    { id: 'beast', nome: 'Bestas da Floresta', baseAtk: 8, baseInt: 2, hp: 3, emoji: '🐺' }
];

const asesIniciais = [
    { id: 'avian', deckReq: 'hero', nome: 'E-Hero Avian', desc: 'Bônus passivo: +10% de ganho de INT.', emoji: '🦅' },
    { id: 'gyroid', deckReq: 'roid', nome: 'Gyroid', desc: 'Bônus passivo: Reduz o custo da Loja em 10%.', emoji: '🚲' },
    { id: 'koala', deckReq: 'beast', nome: 'Des Koala', desc: 'Bônus passivo: +5 DP fixos a cada duelo ganho no idle.', emoji: '🐨' }
];

const espiritosIniciais = [
    { id: 'kuriboh', nome: 'Kuriboh', emoji: '🌰', desc: 'Pode te salvar de um golpe fatal.' },
    { id: 'ojama', nome: 'Ojama Amarelo', emoji: '🤪', desc: 'Gera DP extra (quando não está reclamando).' },
    { id: 'mokey', nome: 'Mokey Mokey', emoji: '☁️', desc: 'Bônus massivo de INT após perder HP.' }
];

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

const lojaItens = [

    //consumiveis
    { id: "sanduiche_estragado", nome: "Sanduíche Estragado", tipo: "consumivel", custo: 30, desc: "50% de curar ou perder 1 HP." },
    { id: "sanduiche_ovo", nome: "Sanduíche de Ovo Padrão", tipo: "consumivel", custo: 80, desc: "Recupera 1 HP." },
    { id: "sanduiche_dourado", nome: "Sanduíche Dourado", tipo: "consumivel", custo: 300, desc: "Restaura HP Máximo e +1 Amizade aleatória." },
    
    //equips
    { id: "deckbox_couro", nome: "Deckbox de Couro", tipo: "equipamento", custo: 250, desc: "+1 HP Máximo permanente." },
    { id: "disco_kaiba", nome: "Disco de Duelos KaibaCorp", tipo: "equipamento", custo: 800, desc: "Velocidade do Idle +25%." },
    
    
    //reliquias
    { id: "espadas_luz", nome: "Espadas da Luz Reveladora", tipo: "reliquia", subTipo: "magia_normal", custo: 350, desc: "Bloqueia emboscadas por 1 mês inteiro." },
    { id: "tufao", nome: "Tufão Espacial Místico", tipo: "reliquia", custo: 250, desc: "Encontra o dobro de consumíveis em eventos." },
    { id: "pote_ganancia", nome: "Pote da Ganância", tipo: "reliquia", subTipo: "magia_normal", custo: 400, desc: "Ative a qualquer momento para ganhar 200 DP imediatos." },
    { id: "monster_reborn", nome: "Monster Reborn", tipo: "reliquia", subTipo: "magia_normal", custo: 600, desc: "Ative a qualquer momento para curar seu HP completamente." },
    { id: "forca_espelho", nome: "Força Espelho", tipo: "reliquia", subTipo: "armadilha", custo: 500, desc: "Ative durante uma emboscada para destruir o oponente e vencer." },
];

const bancoTrivia = [
    { q: "Qual o Nível do Mago Negro?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 1 },
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial de Batalha da Cidade?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 1 },
    { q: "Qual o Nível do Elemental HERO Flame Wingman?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 0 },
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial no TCG?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 2 },
    { q: "Qual carta mágica permite comprar duas cartas do deck sem custo?", opções: ["Pote da Ganância", "Buraco Negro", "Monstro Reborn"], correta: 0 }
];

