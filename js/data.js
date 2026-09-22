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
    { id: 'koala', nome: 'Bestas da Floresta', baseAtk: 8, baseInt: 2, hp: 3, emoji: '🐺' }
];

const asesIniciais = [
    { id: 'avian', deckReq: 'hero', nome: 'E-Hero Avian', desc: 'Bônus passivo: +10% de ganho de INT.', img: 'assets/images/avian.png'},
    { id: 'gyroid', deckReq: 'roid', nome: 'Gyroid', desc: 'Bônus passivo: Reduz o custo da Loja em 10%.', img: 'assets/images/gyroid.jpeg' },
    { id: 'koala', deckReq: 'koala', nome: 'Des Koala', desc: 'Bônus passivo: +5 DP fixos a cada duelo ganho no idle.', img: 'assets/images/des_koala.png' }
];

const espiritosIniciais = [
    { id: 'kuriboh', nome: 'Kuriboh', img: 'assets/images/kuriboh.png', desc: 'Pode te salvar de um golpe fatal.' },
    { id: 'ojama', nome: 'Ojama Amarelo',img: 'assets/images/ojama_yellow.jpeg', desc: 'Gera DP extra (quando não está reclamando).' },
    { id: 'mokey', nome: 'Mokey Mokey', img: 'assets/images/mokey_mokey.png', desc: 'Bônus massivo de INT após perder HP.' }
];

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

const lojaItens = [
    // --- PRODUTOS DA PRATELEIRA ---
    { id: "compra_lanche", nome: "Sanduíche Surpresa", tipo: "consumivel", custo: 50, desc: "A embalagem é um mistério!", naPrateleira: true, img: "assets/images/pxArt.png" },
    { id: "compra_booster_simples", nome: "Booster Simples (1 Carta)", tipo: "reliquia", custo: 150, desc: "Rasgue para revelar 1 Carta Mágica/Armadilha aleatória.", naPrateleira: true, img: "assets/images/pxArt.png" },
    { id: "compra_booster_triplo", nome: "Booster Triplo (3 Cartas)", tipo: "reliquia", custo: 400, desc: "Pacotão promocional com 3 Cartas aleatórias!", naPrateleira: true, img: "assets/images/pxArt.png" },{ id: "deckbox_couro", nome: "Deckbox de Couro", tipo: "equipamento", custo: 250, desc: "+1 HP Máximo permanente.", naPrateleira: true, img: "assets/images/pxArt.png" },
    { id: "disco_kaibacorp", nome: "Disco KaibaCorp", tipo: "equipamento", custo: 800, desc: "Equipamento de elite.", naPrateleira: true, img: "assets/images/pxArt.png" },

    // --- RECOMPENSAS DOS LANCHES ---
    { id: "sanduiche_estragado", nome: "Sanduíche Estragado", tipo: "consumivel_real", desc: "50% de curar ou perder 1 HP.", naPrateleira: false, img: "assets/images/pxArt.png" },
    { id: "sanduiche_ovo", nome: "Sanduíche de Ovo", tipo: "consumivel_real", desc: "Recupera 1 HP garantido.", naPrateleira: false, img: "assets/images/pxArt.png" },
    { id: "sanduiche_dourado", nome: "Sanduíche de Ovo Dourado", tipo: "consumivel_real", desc: "Lendário! Recupera TODO o HP.", naPrateleira: false, img: "assets/images/pxArt.png" },
    
    // --- RECOMPENSAS DOS BOOSTERS ---
    { id: "pote_ganancia", nome: "Pote da Ganância", tipo: "reliquia_real", subTipo: "magia_normal", desc: "Ganhe 400 DP imediatos.", naPrateleira: false, img: "assets/images/pot_of_greed.jpeg" },
    { id: "monster_reborn", nome: "Monster Reborn", tipo: "reliquia_real", subTipo: "magia_normal", desc: "Cura seu HP completamente.", naPrateleira: false, img: "assets/images/monster_reborn.png" },
    { id: "forca_espelho", nome: "Força Espelho", tipo: "reliquia_real", subTipo: "armadilha", desc: "Destrói o oponente numa emboscada.", naPrateleira: false, img: "assets/images/mirror_force.jpeg" },
    { id: "espadas_luz", nome: "Espadas da Luz Reveladora", tipo: "reliquia_real", subTipo: "magia_normal", desc: "Bloqueia as próximas 3 emboscadas.", naPrateleira: false, img: "assets/images/swords_of_revealing.jpeg" },
    { id: "tufao", nome: "Tufão Espacial Místico", tipo: "reliquia_real", subTipo: "magia_normal", desc: "Destrói o teste do Crowler na Aula de Sexta.", naPrateleira: false, img: "assets/images/mystical_space.jpeg" }
];

// --- SISTEMA SOCIAL ---
const parceiros = [
    { 
        id: 'syrus', nome: 'Syrus Truesdale', anoReq: 1, raridade: 'Comum', 
        bonusDesc: 'Reduz o custo dos itens da loja pela metade.', img: 'assets/images/pxArt.png' 
    },
    { 
        id: 'jaden', nome: 'Jaden Yuki', anoReq: 1, raridade: 'Raro', 
        bonusDesc: 'Duelos automáticos no idle geram o dobro de DP.', img: 'assets/images/pxArt.png' 
    },
    { 
        id: 'bastion', nome: 'Bastion Misawa', anoReq: 2, raridade: 'Épico', 
        bonusDesc: '+50% de ganho de INT durante os focos de estudo.', img: 'assets/images/pxArt.png' 
    },
    { 
        id: 'zane', nome: 'Zane Truesdale', anoReq: 3, raridade: 'Lenda', 
        bonusDesc: 'Dobra o ganho de ATK, mas sofres -2 de HP máximo.', img: 'assets/images/pxArt.png' 
    }
];

const bancoConversas = [
    {
        fala: "Qual você acha que é a qualidade mais importante de um duelista?",
        certa: "Acreditar no Coração das Cartas.",
        erradas: ["Comprar as cartas mais caras da loja.", "Humilhar o oponente sem dó."]
    },
    {
        fala: "O que você faria se comprasse uma mão inicial péssima?",
        certa: "Pensaria numa estratégia defensiva e manteria a calma.",
        erradas: ["Desistiria do duelo na hora.", "Reclamaria que o meu deck me odeia."]
    },
    {
        fala: "Qual é a melhor forma de se preparar para o Exame Prático?",
        certa: "Duelar com amigos para testar a sinergia dos combos.",
        erradas: ["Copiar o deck de alguém do Obelisco Azul.", "Subornar o Professor Crowler."]
    }
];

const bancoTrivia = [
    { q: "Qual o Nível do Mago Negro?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 1 },
    { q: "Qual é o nome do dormitório reservado para os alunos com o desempenho mais baixo, associado à cor vermelha?", opções: ["Obelisco Vermelho", "Rá Vermelho", "Slifer Vermelho"], correta: 2 },
    
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial de Batalha da Cidade?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 1 },
    { q: "Qual o Nível do Elemental HERO Flame Wingman?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 0 },
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial no TCG?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 2 },
    { q: "Qual carta mágica permite comprar duas cartas do deck sem custo?", opções: ["Pote da Ganância", "Buraco Negro", "Monstro Reborn"], correta: 0 }
];

const puzzlesExame = {
    0: { // EXAME DE ADMISSÃO
        bossName: "Prof. Crowler (Avaliador Surpresa)",
        bossImg: "assets/images/pxArt.png", 
        hero: {
            texto: "Você chegou atrasado e perdeu a prova teórica! O Prof. Crowler, irritado, decidiu te avaliar pessoalmente. Ele invocou o 'Golem das Engrenagens Antigas' (3000 ATK). Seu 'Homem-Pássaro Chama' tem apenas 2100 ATK. Como você sobrevive?",
            opcoes: [
                { texto: "Usar o terreno 'Arranha-Céu' para ganhar vantagem (Exige 5 INT)", stat: 'int', req: 5, correto: true, msg: "Você usou o cenário a seu favor! O ataque superou o Golem e Crowler ficou boquiaberto." },
                { texto: "Ataque frontal com força bruta (Exige 20 ATK)", stat: 'atk', req: 20, correto: true, msg: "Isso exigiria uma força que você ainda não tem." },
                { texto: "Correr e desistir do duelo", stat: 'int', req: 0, correto: false, msg: "Você fugiu da arena. Crowler riu e carimbou sua reprovação." }
            ]
        },
        roid: {
            texto: "Você perdeu a prova teórica! Para entrar, precisa impressionar o Prof. Crowler no duelo prático. Ele bloqueou sua linha de frente com monstros imensos. Você tem 'Gyroid' e 'Brocaroid'.",
            opcoes: [
                { texto: "Atacar diretamente com força bruta (Exige 10 ATK)", stat: 'atk', req: 10, correto: true, msg: "Seus Roids ainda não têm essa potência ofensiva." },
                { texto: "Usar manobras evasivas e efeito de perfuração (Exige 3 INT)", stat: 'int', req: 3, correto: true, msg: "Jogada tática perfeita! Você contornou a defesa pesada dele e causou dano direto, garantindo sua vaga!" },
                { texto: "Apertar botões aleatórios dos Roids", stat: 'int', req: 0, correto: false, msg: "Seu Gyroid pifou no meio da arena. Reprovado sumariamente." }
            ]
        },
        koala: {
            texto: "Após zerar a prova teórica por falta de presença, Crowler exige um duelo prático perfeito. Ele encheu o campo de cartas viradas para baixo (armadilhas) para conter suas feras.",
            opcoes: [
                { texto: "Investida brutal com 'Rei Tigre Wanghu' (Exige 8 ATK)", stat: 'atk', req: 8, correto: true, msg: "A agressividade do seu deck destruiu a estratégia dele antes que as armadilhas pudessem ser ativadas! Aprovado!" },
                { texto: "Tentar desarmar as armadilhas com magia (Exige 10 INT)", stat: 'int', req: 10, correto: true, msg: "Você não tem o intelecto necessário para essa jogada sutil." },
                { texto: "Recuar os monstros para defesa", stat: 'int', req: 0, correto: false, msg: "Bestas não recuam! Crowler aproveitou sua hesitação e obliterou seus monstros." }
            ]
        }
    },

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
        koala: {
            texto: "Chazz colocou 3 cartas viradas para baixo e invocou 'Ojama Amarelo'. É uma isca óbvia! O teu 'Des Koala' está pronto a agir.",
            opcoes: [
                { texto: "Atacar com Força Máxima (Exige 60 ATK)", stat: 'atk', req: 60, correto: true, msg: "Eras tão forte que a Força Espelho dele não foi suficiente para te parar!" },
                { texto: "Efeito de Dano Direto (Exige 40 INT)", stat: 'int', req: 40, correto: true, msg: "Percebeste a armadilha! Usaste o efeito do Des Koala para vencer sem iniciar a fase de batalha." },
                { texto: "Invocar mais monstros para ajudar", stat: 'int', req: 0, correto: false, msg: "Ele ativou 'Tributo Torrencial' e limpou todo o teu campo!" }
            ]
        }
    },
    2: { 
        bossName: "Bastion Misawa",
        bossImg: "assets/images/pxArt.png", 
        hero: {
            texto: "Bastion calculou as suas jogadas e invocou o 'Dragão da Água' (2800 ATK), reduzindo o ATK do seu 'Homem-Pássaro Chama' a 0 pela habilidade natural! Você tem 'Polimerização' e 'Explosão de Herói' na mão.",
            opcoes: [
                { texto: "Fundir um novo Herói imune (Exige 250 ATK)", stat: 'atk', req: 250, correto: true, msg: "A força bruta do seu novo Herói Elementar superou os cálculos de Bastion e esmagou o Dragão da Água!" },
                { texto: "Usar Explosão de Herói com precisão (Exige 130 INT)", stat: 'int', req: 130, correto: true, msg: "Você previu a tática dele! A magia destruiu o Dragão da Água contornando a diferença de ataque." },
                { texto: "Atacar o Dragão da Água cegamente", stat: 'atk', req: 0, correto: false, msg: "Bastion riu da sua jogada ilógica. Seu monstro foi destruído e você levou dano massivo!" }
            ]
        },
        roid: {
            texto: "Bastion ativou cartas de Controle de Gravidade. Seu 'Gyroid' está preso e ele prepara um ataque letal matemático. Seu 'Super Veicroid - Conexão Furtiva' está pronto no Extra Deck.",
            opcoes: [
                { texto: "Invocar Super Veicroid e atropelar (Exige 250 ATK)", stat: 'atk', req: 250, correto: true, msg: "O motor do Veicroid superaqueceu e ignorou a gravidade, causando dano perfurante fatal!" },
                { texto: "Ativar Zona de Conexão Veicroid (Exige 130 INT)", stat: 'int', req: 130, correto: true, msg: "Gênio! A Zona de Conexão tornou sua fusão imune aos efeitos de controle dele." },
                { texto: "Esperar a fase final dele", stat: 'int', req: 0, correto: false, msg: "Você hesitou demais. As fórmulas de Bastion limparam seu campo antes do seu turno!" }
            ]
        },
        beast: {
            texto: "Bastion ativou 'Cilindro Mágico' no seu ataque principal! Você está prestes a tomar o reflexo do próprio dano, mas tem efeitos feras engatilhados.",
            opcoes: [
                { texto: "Invocar Babuíno Verde em resposta (Exige 250 ATK)", stat: 'atk', req: 250, correto: true, msg: "O rugido do Babuíno Verde cancelou a armadilha com pura brutalidade física, despedaçando o campo de Bastion!" },
                { texto: "Redirecionar o dano com sabedoria (Exige 130 INT)", stat: 'int', req: 130, correto: true, msg: "Estratégia perfeita! Você absorveu o impacto e usou os efeitos de bestas no cemitério para contra-atacar." },
                { texto: "Aceitar o dano passivamente", stat: 'int', req: 0, correto: false, msg: "O Cilindro Mágico refletiu 3000 de dano direto. A matemática de Bastion foi implacável!" }
            ]
        }
    }
    
};

