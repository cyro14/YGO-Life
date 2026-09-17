// js/data.js

const imgs = {
    hub: "https://images.ygoprodeck.com/images/cards/24094653.jpg",
    study: "https://images.ygoprodeck.com/images/cards/38033121.jpg",
    duel: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
    shop: "https://images.ygoprodeck.com/images/cards/55144522.jpg",
    threat: "https://images.ygoprodeck.com/images/cards/70781052.jpg"
};

const diasDaSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

const bancoTrivia = [
    { q: "Qual o Nível do Mago Negro?", opções: ["Nível 6", "Nível 7", "Nível 8"], correta: 1 },
    { q: "Quantos Pontos de Vida (PV) se começa em um duelo oficial no anime?", opções: ["2000 PV", "4000 PV", "8000 PV"], correta: 1 },
    { q: "Qual carta mágica permite comprar duas cartas do deck sem custo?", opções: ["Pote da Ganância", "Buraco Negro", "Monstro Reborn"], correta: 0 }
];

const lojaItens = [
    { id: "sanduiche_estragado", nome: "Sanduíche Estragado", tipo: "consumivel", custo: 30, desc: "50% de curar ou perder 1 HP." },
    { id: "sanduiche_ovo", nome: "Sanduíche de Ovo Padrão", tipo: "consumivel", custo: 80, desc: "Recupera 1 HP com segurança." },
    { id: "pote_ganancia", nome: "Pote da Ganância", tipo: "reliquia", custo: 300, desc: "Passivo: +50% DP no idle." },
    { id: "disco_padrao", nome: "Disco de Duelos Padrão", tipo: "equipamento", custo: 200, desc: "Velocidade do Idle +10%." }
];

const parceirosTagForce = [
    { id: "syrus", nome: "Syrus Truesdale", ano: 1, raridade: "comum", bonus: "Metade do preço na loja." },
    { id: "jaden", nome: "Jaden Yuki", ano: 1, raridade: "raro", bonus: "Duelos automáticos geram dobro de DP." },
    { id: "bastion", nome: "Bastion Misawa", ano: 2, raridade: "epico", bonus: "+50% INT nos estudos." }
];
