const imgs = {
    hub: "https://images.ygoprodeck.com/images/cards/24094653.jpg", // Slifer Red Dorm
    hub_ra: "https://images.ygoprodeck.com/images/cards/32338002.jpg", // Ra Yellow
    hub_obelisk: "https://images.ygoprodeck.com/images/cards/10000000.jpg", // Obelisk Blue
    study: "https://images.ygoprodeck.com/images/cards/38033121.jpg",
    duel: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
    shop: "https://images.ygoprodeck.com/images/cards/55144522.jpg",
    threat: "https://images.ygoprodeck.com/images/cards/70781052.jpg",
    bg_slifer: "assets/images/slifer_red_dorm2.jpeg",
    bg_ra: "assets/images/ra_yellow_dorm.webp",
    bg_obelisk: "assets/images/obelisk_blue_dorm.jpg",
    bg_abandoned: "assets/images/abandoned_dorms.jpg",
    bg_academy: "assets/images/duel_academy.jpeg",
    bg_forest: "assets/images/Forest.webp",
    
    shop: "assets/images/pxArt.png"
    
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
    { id: 'kuriboh', nome: 'Kuriboh', img: 'assets/images/kuriboh.png', desc: 'Pode te salvar de um golpe fatal.' },
    { id: 'ojama', nome: 'Ojama Amarelo',img: 'assets/images/ojama_yellow.jpeg', desc: 'Gera DP extra (quando não está reclamando).' },
    { id: 'mokey', nome: 'Mokey Mokey', img: 'assets/images/mokey_mokey.png', desc: 'Bônus massivo de INT após perder HP.' }
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

const puzzlesExame = {
    1: { 
        bossName: "Chazz Princeton",
        bossImg: "assets/images/pxArt.png", // Podes trocar depois por uma imagem do Chazz
        hero: {
            texto: "Chazz invocou o 'Dragão Armado LV7' (2800 ATK) e preparou-se para destruir o teu lado do campo! Tens o 'Homem-Pássaro Chama' em campo, e 'Arranha-Céu' na mão. Qual é a tua jogada?",
            opcoes: [
                { texto: "Ativar Arranha-Céu e atacar (Exige 40 ATK)", stat: 'atk', req: 40, correto: true, msg: "O teu Herói usou o terreno para superar o ataque do Dragão e venceste o duelo!" },
                { texto: "Tentar controlar com armadilhas (Exige 60 INT)", stat: 'int', req: 60, correto: true, msg: "Foste inteligente! Usaste armadilhas para anular o efeito do Dragão Armado." },
                { texto: "Mudar para Defesa e rezar", stat: 'int', req: 0, correto: false, msg: "O efeito do Dragão Armado destruiu a tua defesa e perdeste pontos de vida diretos!" }
            ]
        },
        roid: {
            texto: "Chazz invocou o 'Rei Ojama' e bloqueou 3 zonas de monstros tuas! Tens 'Gyroid' no campo e 'Brocaroid' na mão.",
            opcoes: [
                { texto: "Invocação-Tributo de Força (Exige 60 ATK)", stat: 'atk', req: 60, correto: true, msg: "Superaste o bloqueio com pura força bruta e esmagaste o Rei Ojama!" },
                { texto: "Mudar Gyroid para Defesa (Exige 40 INT)", stat: 'int', req: 40, correto: true, msg: "O efeito do Gyroid manteve-o vivo. No turno seguinte conseguiste espaço para virar o jogo!" },
                { texto: "Atacar o Rei Ojama diretamente", stat: 'atk', req: 0, correto: false, msg: "O Rei Ojama absorveu o ataque e sofres dano de recuo!" }
            ]
        },
        beast: {
            texto: "Chazz colocou 3 cartas viradas para baixo e invocou 'Ojama Amarelo'. É uma isca óbvia! O teu 'Des Koala' está pronto a agir.",
            opcoes: [
                { texto: "Atacar com Força Máxima (Exige 60 ATK)", stat: 'atk', req: 60, correto: true, msg: "Eras tão forte que a Força Espelho dele não foi suficiente para te parar!" },
                { texto: "Efeito de Dano Direto (Exige 40 INT)", stat: 'int', req: 40, correto: true, msg: "Percebeste a armadilha! Usaste o efeito do Des Koala para vencer sem iniciar a fase de batalha." },
                { texto: "Invocar mais monstros para ajudar", stat: 'int', req: 0, correto: false, msg: "Ele ativou 'Tributo Torrencial' e limpou todo o teu campo!" }
            ]
        }
    }
    // O Ano 2 e 3 podem ser adicionados aqui no futuro
};

