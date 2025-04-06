"use strict";

// Variáveis globais
let pontuacao = 0;
let combustivel = 100;
let recargasCombustivel = 0;
let intervaloCombustivel; // Variável que armazena o identificador do interval associado ao combustível
let velocidadeElemento = 2;
let velocidadeCarro = 2;
let alternar = true; // Variável que possibilita alternância das cores do terreno
let cenario; 
let index = 0; // Variável que representa o índice de um array
let direcaoCarro = 0; // -1 para a esquerda, 1 para a direita
let jogoEncerrado = false; 

// Elementos do DOM
let carro = document.getElementById("carro-jogador");
let pontuacaoElemento = document.getElementById("valor-pontuacao");
let barraCombustivel = document.getElementById("barra-combustivel");
let menuInicial = document.querySelectorAll(".menu-inicial");

// CRIAÇÃO DO TERRENO - PISTA DE CORRIDA, BORDA DA PISTA E GRAMA:

// Função que cria um polígono
function criarPoligono(cor, x1, y1, x2, y2, x3, y3, x4, y4) {
    let conteiner = document.getElementById("conteiner");
    let poligono = document.createElement("div");
    let pontos = `${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px`;

    poligono.style.clipPath = `polygon(${pontos})`;
    poligono.style.backgroundColor = cor;
    poligono.classList.add("poligono");
    conteiner.appendChild(poligono);
}

// Função que cria um trapézio
function criarTrapezio(x1, y1, w1, x2, y2, w2, color = "green") {
    criarPoligono(color, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2,x2 - w2, y2);
}

// Função que cria o terreno
function criarTerreno(bol = false) {
    let w = 150; // Distancia do segmento pro outro
    let x = 600; // Tamanho da tela - altura
    let y = x - w;
    let z = y - w / 2;
    let a = 300; // pista
    let b = 350; // borda
    
    let verdeClaro = "rgb(21, 97, 19)";
    let verdeEscuro = "rgb(17, 77, 15)";
    let cinzaEscuro = "rgb(83, 83, 83)";
    let cinzaClaro = "rgb(126, 126, 126)";

    for (let i = 0; i < 4; i++) {
        // grama
        criarTrapezio(400, x, 400, 400, y, 400, bol ? verdeClaro : verdeEscuro);
        criarTrapezio(400, y, 400, 400, z, 400, bol ? verdeEscuro : verdeClaro);

        // Borda da pista
        criarTrapezio(400, x, b, 400, y, b / 2, bol ? "black" : "white");
        criarTrapezio(400, y, b / 2, 400, z, b / 2 / 2, bol ? "white" : "black");

        // Pista de corrida
        criarTrapezio(400, x, a, 400, y, a / 2, bol ? cinzaEscuro : cinzaClaro);
        criarTrapezio(400, y, a / 2, 400, z, a / 2 / 2, bol ? cinzaClaro : cinzaEscuro);

        a = a / 2 / 2;
        b = b / 2 / 2;
        x = z;
        w = w / 4;
        y = x - w;
        z = y - w / 2;

    }
}

// Cria o terreno no início
criarTerreno();

// Alternância das cores no terreno para criar a sensação de movimento
function movimento() {
    let alternancia = setInterval(function () {
        if (jogoEncerrado == true) {
            clearInterval(alternancia);
            return;
        } else if (alternar) {
            criarTerreno(true);
        } else {
            criarTerreno(false);
        }

        alternar = !alternar;
    }, 1000 / velocidadeCarro);
}

// FORMAÇÃO DOS CENÁRIOS:

// Função que cria as estrelas
function criarEstrelas(qtd) {
    // As dimensões em px da área onde está localizado as estrelas
    let largura = 800;
    let altura = 300;

    for (let i = 0; i < qtd; i++) {
        let estrela = document.createElement("div");
        estrela.classList.add("estrela");

        // Posição aleatória dentro do conteiner
        let x = Math.random() * largura;
        let y = Math.random() * altura;
        estrela.style.left = `${x}px`;
        estrela.style.top = `${y}px`;

        // Tamanho aleatório
        let tamanho = Math.random() + 1;
        estrela.style.width = `${tamanho}px`;
        estrela.style.height = `${tamanho}px`;

        // Brilho aleatório
        estrela.style.animationDuration = `${Math.random() + 1}s`;

        conteiner.appendChild(estrela);
    }
}

// Função que cria flocos de neve
function flocosNeve(qtd) {
    
    for (let i = 0; i < qtd; i++) {
        let floco = document.createElement("div");
        floco.classList.add("floco-neve");

        // Posição horizontal aleatória dentro do conteiner
        let x = Math.random() * 800;
        floco.style.left = `${x}px`;

        // Tamanho e opacidade aleatórios
        let tamanho = Math.random() * 4 + 2;
        floco.style.width = `${tamanho}px`;
        floco.style.height = `${tamanho}px`;
        floco.style.opacity = Math.random();

        // Duração aleatória da animação
        floco.style.animationDuration = `${Math.random() * 5 + 5}s`;

        conteiner.appendChild(floco);
    }
}

// Função para remover todas as divs com as classes "estrela" e "floco-neve"
function removerDivs() {
    const divs = document.querySelectorAll(".estrela, .floco-neve");
    
    // Itera sobre as divs e as remove
    divs.forEach(div => {
        div.remove();
    });
}

// Função que cria o cenário do dia
function dia() {
    let conteiner = document.getElementById("conteiner");
    conteiner.style.backgroundColor = "lightblue";
    conteiner.style.color = "black";
    removerDivs();
}

// Função que cria o cenário da tarde
function tarde() {
    let conteiner = document.getElementById("conteiner");
    conteiner.style.backgroundColor = "orangered";
    conteiner.style.color = "black";
    removerDivs();
}

// Função que cria o cenário da noite
function noite() {
    let conteiner = document.getElementById("conteiner");
    conteiner.style.backgroundColor = "rgb(0, 0, 20)";
    conteiner.style.color = "white";
    removerDivs();
    criarEstrelas(150); 
}

// Função que cria o cenário da neve
function neve() {
    let conteiner = document.getElementById("conteiner");
    conteiner.style.backgroundColor = "gray";
    conteiner.style.color = "black";
    removerDivs();
    flocosNeve(200);
}

// Escolhendo o ambiente inicial ao clicar no botão do menu 
document.getElementById("dia").addEventListener("click", dia);
document.getElementById("tarde").addEventListener("click", tarde);
document.getElementById("noite").addEventListener("click", noite);
document.getElementById("neve").addEventListener("click", neve);

// Função que alterna a cada 30s o cenário
function alternarCenarios() {
    let cenarios = ["dia", "tarde", "noite", "neve"];

    let alternancia = setInterval(function(){
        // Um cenário é escolhido conforme a sequência
        let funcao = cenarios[index % cenarios.length];

        if (jogoEncerrado == true) {
            clearInterval(alternancia);
            return;
        }

        // Chama a função de um dos cenários
        window[funcao]();

        index++;

    }, 30000); // Chama a função a cada 30s

}

// MOVIMENTAÇÃO DO CARRO E CONSUMO DE COMBUSTÍVEL:

// Função que movimenta o carro
function moverCarro() {
   
    let intervaloMovimento = setInterval(function() {
        let esquerda = parseInt(window.getComputedStyle(carro).getPropertyValue("left"));
        let posicao = esquerda + direcaoCarro * velocidadeCarro;

        if (jogoEncerrado == true) {
            clearInterval(intervaloMovimento);
            return;
        }
        
        if (posicao >= 25 && posicao <= 775) {
            carro.style.left = posicao + "px";
        }

        // Velocidade do carro
        if (!(posicao >= 100 && posicao <= 700) && velocidadeCarro > 0.5) {
            // Reduz velocidade em 15%
            velocidadeElemento *= 0.85;
            velocidadeCarro *= 0.85;

        } else if (!(posicao >= 100 && posicao <= 700) && velocidadeCarro <= 0.5 ) {
            velocidadeElemento = 0.5;
            velocidadeCarro = 0.5;

        } else if (velocidadeCarro <= 2) {
            // Aumenta a velocidade em 15%;
            velocidadeElemento *= 1.15;
            velocidadeCarro *= 1.15;

        } 
    }, 1000 / 60); // 60 FPS

}

// Detecta o pressionamento das teclas - seta esquerda e seta direita
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        direcaoCarro = -1;
    } else if (event.key === "ArrowRight") {
        direcaoCarro = 1;
    }
});

// Detecta quando a seta esquerda ou seta direita é liberada
document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        direcaoCarro = 0; // Parar de mover quando a tecla for solta
    }
});

// Função que atualiza o estado do combustível
function atualizarCombustivel() {

    intervaloCombustivel = setInterval(function() {
        // Consumo constante de combustível
        combustivel -= 1;
        barraCombustivel.style.width = combustivel + "%";

        // Quando o combustível acaba, o jogo termina
        if (combustivel <= 0) {
            encerrarJogo();
        }
    }, 1000); // A cada 1s

}

// CRIAÇÃO E INTERAÇÃO DOS ELEMENTOS DA PISTA DE CORRIDA NO JOGO:

// Função que verifica se dois elementos se sobrepõem visualmente na tela
function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();

    // Verifica se A invade a área de B na horizontal e vice-versa
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

    // Verifica se A invade a área de B na vertical e vice-versa
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
}

// Função que verifica se o carro do jogador interagiu com algum elemento
function interacaoElementos(elemento) {
    let sobrepostos = estaoSobrepostos(carro, elemento); 

    if (sobrepostos) {
        if (elemento.classList.contains("elemento1")) { // Carro adversário - colidiu

            return 1; // Indica que interagiu com o elemento 1 - ocorreu uma colisão
             
        } else if (elemento.classList.contains("elemento2")) { // Posto de combustível - abastece o carro do jogador

            combustivel += 10;
            
            // Verifica se o combustível está cheio
            if (combustivel > 100) {
                combustivel = 100;
            }
            
            barraCombustivel.style.width = combustivel + "%";

            recargasCombustivel++;
          
            elemento.remove();

            return 2; // Indica que interagiu com o elemento 2

        } else if (elemento.classList.contains("elemento3")) { // Barreira - reduz a velocidade e perde pontos
            
            // Diminuição da pontuação
            if (pontuacao > 1) {
                pontuacao -= 2;
            } else {
                pontuacao = 0;
            }

            pontuacaoElemento.textContent = pontuacao;

            // Redução da velocidade em 15 %
            if (velocidadeCarro > 0.5) {
                velocidadeElemento = velocidadeElemento * 0.85;
                velocidadeCarro = velocidadeCarro * 0.85;
            }
            
            elemento.remove();

            return 3; // Indica que interagiu com o elemento 3

        } else if (elemento.classList.contains("elemento4")) { // Nitro - aumenta a velocidade e ganha pontos

            pontuacao += 2;

            pontuacaoElemento.textContent = pontuacao;

            velocidadeCarro += 5;
            velocidadeElemento += 5;
            
            elemento.remove();

            return 4; // Indica que interagiu com o elemento 4

        }
    } else {
        return 0; // Indica que o carro não interagiu diretamente com algum elemento
    }
}

function criarElemento() {

    let tiposElemento = ["elemento1", "elemento2", "elemento3", "elemento4"]; // Tipos de elementos disponíveis
    let conteiner = document.getElementById("conteiner"); 

    // Gera um número aleatório entre 0 e 99
    let probabilidade = Math.floor(Math.random() * 100);

    // Define o tipo de elemento com base na probabilidade
    let elementoSorteado;
    if (probabilidade < 50) {
        elementoSorteado = "elemento1";
    } else {
        elementoSorteado = tiposElemento[Math.floor(Math.random() * tiposElemento.length)];
    }

    // Criando a div do elemento
    let elemento = document.createElement("div");
    elemento.className = "elemento " + elementoSorteado;

    // Define a posição inicial do elemento no centro do contêiner
    let posicaoInicialX = conteiner.offsetWidth * 2 / 4 - 25;
    let posicaoInicialY = 325;
    elemento.style.left = posicaoInicialX + "px";
    elemento.style.top = posicaoInicialY + "px";

    // Adiciona o elemento ao contêiner
    conteiner.appendChild(elemento);

    // Define a direção do elemento
    let posicaoAtualX = posicaoInicialX; // Variável da posição horizontal no eixo x
    let posicaoAtualY = posicaoInicialY; // Variável da posição vertical no eixo y
    let posicaoAleatoriaX = Math.floor(Math.random() * (600 - 150 + 1) + 150);
    let posicaoAleatoriaY = conteiner.offsetHeight;

    // Move o obstáculo diagonalmente em 60 FPS
    let intervaloElemento = setInterval(function () {

        // Quando o jogo finaliza o elemento para de se mover
        if (jogoEncerrado == true) {
            clearInterval(intervaloElemento);
            return;
        }

        // Calcula os deltas de movimento
        let deltaX = posicaoAleatoriaX - posicaoAtualX;
        let deltaY = posicaoAleatoriaY - posicaoAtualY;

        // Calcula o vetor de movimento normalizado
        let distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let vetorMovimento = {
            x: deltaX / distancia,
            y: deltaY / distancia,
        };

        // Define a posição atual do elemento
        posicaoAtualX += vetorMovimento.x * velocidadeElemento;
        posicaoAtualY += vetorMovimento.y * velocidadeElemento;
        elemento.style.left = posicaoAtualX + "px";
        elemento.style.top = posicaoAtualY + "px";

        // Verifica se ocorreu alguma interação entre o carro do jogador e algum elemento
        if (posicaoAtualY > 600) {

            clearInterval(intervaloElemento);
            elemento.remove();

            // Ultrapassou o carro adversário
            if (elementoSorteado == "elemento1") {
                pontuacao += 1;
                pontuacaoElemento.textContent = pontuacao;
            }

            criarElemento();

        } else if (posicaoAtualY > 500) {
            // Verificando se interagiu com algum elemento
            let aux = interacaoElementos(elemento); 

            // Colidiu com o carro adversário
            if (aux === 1) {
                clearInterval(intervaloElemento);
                encerrarJogo();
            }     
        }

    }, 1000 / 60); // 60 FPS
}

// INÍCIO, REINÍCIO E TÉRMINO DO JOGO

// Função que reinicia o jogo
function reiniciarJogo() {
    //Recarrega a página para retornar ao menu inicial
    window.location.reload();
}

// Função para exibir tela de fim de jogo
function exibirTelaFinal() {
    const telaFimDeJogo = document.createElement("div");
    telaFimDeJogo.id = "tela-final";

    const declararFim = document.createElement("h1");
    declararFim.textContent = "Fim de Jogo!";

    const pontuacaoFinal = document.createElement("p");
    pontuacaoFinal.textContent = `Pontuação: ${pontuacao}`;

    const numeroCombustivel = document.createElement("p")
    numeroCombustivel.textContent = `Combustível: ${recargasCombustivel}`;

    const botaoReiniciar = document.createElement("button");
    botaoReiniciar.textContent = "Reiniciar";
    botaoReiniciar.addEventListener("click", reiniciarJogo);

    telaFimDeJogo.appendChild(declararFim);
    telaFimDeJogo.appendChild(pontuacaoFinal);
    telaFimDeJogo.appendChild(numeroCombustivel);
    telaFimDeJogo.appendChild(botaoReiniciar);
    document.body.appendChild(telaFimDeJogo);
}

// Função de fim de jogo
function encerrarJogo() {
    jogoEncerrado = true;
    clearInterval(intervaloCombustivel);
    exibirTelaFinal();
}

// Função que inicia o jogo
function iniciarJogo() {

    // Itera sobre os elementos menu e remove cada um deles
    menuInicial.forEach(function(elemento) {
        elemento.remove();
    });

    // Chamando funções para começar o jogo
    movimento();
    alternarCenarios();
    moverCarro();
    atualizarCombustivel();
    criarElemento();

}

// Iniciar o jogo
document.getElementById("jogar").addEventListener("click", iniciarJogo);