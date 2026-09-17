const imgs = {
    hub: "https://images.ygoprodeck.com/images/cards/24094653.jpg", // Slifer Red Dorm
    hub_ra: "https://images.ygoprodeck.com/images/cards/32338002.jpg", // Ra Yellow
    hub_obelisk: "https://images.ygoprodeck.com/images/cards/10000000.jpg", // Obelisk Blue
    study: "https://images.ygoprodeck.com/images/cards/38033121.jpg",
    duel: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
    shop: "https://images.ygoprodeck.com/images/cards/55144522.jpg",
    threat: "https://images.ygoprodeck.com/images/cards/70781052.jpg"
};

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

const lojaItens = [
    { id: "sanduiche_estragado", nome: "Sanduíche Estragado", tipo: "consumivel", custo: 30, desc: "50% de curar ou perder 1 HP." },
    { id: "sanduiche_ovo", nome: "Sanduíche de Ovo Padrão", tipo: "consumivel", custo: 80, desc: "Recupera 1 HP." },
    { id: "sanduiche_dourado", nome: "Sanduíche Dourado", tipo: "consumivel", custo: 300, desc: "Restaura HP Máximo e +1 Amizade aleatória." },
    { id: "pote_ganancia", nome: "Pote da Ganância", tipo: "reliquia", custo: 400, desc: "+50% DP no idle." },
    { id: "monstro_reborn", nome: "Monstro Reborn", tipo: "reliquia", custo: 600, desc: "Sobrevive a 1 golpe fatal." },
    { id: "deckbox_couro", nome: "Deckbox de Couro", tipo: "equipamento", custo: 250, desc: "+1 HP Máximo permanente." },
    { id: "disco_kaiba", nome: "Disco de Duelos KaibaCorp", tipo: "equipamento", custo: 800, desc: "Velocidade do Idle +25%." }
];

const bancoTrivia = [
    { q: "Qual o Nível do Mago Negro?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 1 },
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial de Batalha da Cidade?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 1 },
    { q: "O efeito do 'Número 24: Dragulas, o Dragão Vampírico' permite que ele se vire para baixo. Isso é um efeito de Ignição ou Rápido?", opções: ["Ignição", "Rápido", "Gatilho"], correta: 1 }
];
