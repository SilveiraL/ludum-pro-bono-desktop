const ludum = require('../../utils/ludum_pro_bono')
const game = require('./utils/game')
const desafio = require('./utils/desafio')
const Snake = require('./model/snake')
const Food = require('./model/food')
const Bloco = require('./model/bloco')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

game.keyDown(key => {
    switch (key) {
        case keys.left: // Esquerda
            left(1);
            break;

        case keys.up: // Cima
            up(1);
            break;

        case keys.right: // Direita
            right(1);
            break;

        case keys.down: // Baixo
            down(1);
            break;

        case 65: // A
            left(2);
            break;

        case 87: // W
            up(2);
            break;

        case 68: // D
            right(2);
            break;

        case 83: // S
            down(2);
            break;
    }
});

function gameOver() {
    const mensagem = document.getElementById('gameOver');
    const pontos = document.getElementById('pontos');
    mensagem.style.display = 'block';
    pontos.innerHTML = 'Pontuação: ' + snakes[0].body.length;

    game.clearLoop();

    document.addEventListener('keydown', key => {
        if (key.keyCode == keys.start) {
            window.location.reload();
        }
    });
}

function verificarSeSaiuDoCampo(snake = new Snake()) {
    if (snake.head.getX() > campo.maxX()) snake.head.setX(campo.minX());
    if (snake.head.getX() < campo.minX()) snake.head.setX(campo.maxX());
    if (snake.head.getY() > campo.maxY()) snake.head.setY(campo.minY());
    if (snake.head.getY() < campo.minY()) snake.head.setY(campo.maxY());
}

function up(player) {
    const snake = snakes[player - 1];

    snake.iniciouMovimento = true;

    if (snake.head.velocidadeY == 0 && !snake.movimentoTurno) {
        snake.head.velocidadeX = 0;
        snake.head.velocidadeY = 15;
        snake.movimentoTurno = true;
    }
}

function down(player) {
    const snake = snakes[player - 1];

    snake.iniciouMovimento = true;

    if (snake.head.velocidadeY == 0 && !snake.movimentoTurno) {
        snake.head.velocidadeX = 0;
        snake.head.velocidadeY = -15;
        snake.movimentoTurno = true;
    }
}

function left(player) {
    const snake = snakes[player - 1];

    snake.iniciouMovimento = true;

    if (snake.head.velocidadeX == 0 && !snake.movimentoTurno) {
        snake.head.velocidadeY = 0;
        snake.head.velocidadeX = -15;
        snake.movimentoTurno = true;
    }
}

function right(player) {
    const snake = snakes[player - 1];

    snake.iniciouMovimento = true;

    if (snake.head.velocidadeX == 0 && !snake.movimentoTurno) {
        snake.head.velocidadeY = 0;
        snake.head.velocidadeX = 15;
        snake.movimentoTurno = true;
    }
}

function setTempo(tempo = 100) {
    timer.innerHTML = tempo;
}

function getTempo() {
    return parseInt(timer.innerHTML);
}

function addTempo(tempo) {
    setTempo(getTempo() + tempo);
}

function createFoods() {
    const legenda = document.getElementById('legenda');

    for (let food of legenda.children) {
        const n = food.getAttribute('n');
        const valor = food.innerHTML == 'X' ? 0 : parseInt(food.innerHTML);
        const color = food.style.backgroundColor;

        for (let cont = 0; cont < n; cont++) {
            foods.push(new Food('food-' + valor, valor, color));
        }
    }
}

const campo = {
    xi: 15,
    yi: 15,
    xf: (Math.floor(window.innerWidth / 15) * 15) - 30,
    yf: (Math.floor(window.innerHeight / 15) * 15) - 75,
    blocoSize: 15,
    minX() { return this.xi - this.blocoSize },
    minY() { return this.yi - this.blocoSize },
    maxY() { return this.yf - this.blocoSize },
    maxX() { return this.xf - this.blocoSize }
}

game.setBackgroundColor('black');
game.setSize(campo.xf, campo.yf);
game.setPosicao(game.janela, campo.xi, campo.yi);

var contador = 0;
const timer = document.getElementById('timer');
const snakes = [];
snakes[0] = new Snake('snake1', 'lightgreen', 'green');

const foods = [];

createFoods();
desafio.gerarDesafio();
setTempo(250);

function loop() {
    snakes.forEach(snake => {
        snake.posicionarBody();
        snake.head.moverX(snake.head.velocidadeX);
        snake.head.moverY(snake.head.velocidadeY);
        verificarSeSaiuDoCampo(snake);
        snake.verificarColisaoFood(foods);
        snake.verificarColisaoSnake(snakes);
        snake.movimentoTurno = false;
    });

    contador++;

    if (contador >= 4 && snakes[0].iniciouMovimento) {
        contador = 0
        addTempo(-1);
    }

    if (getTempo() == 0) gameOver();
}

game.loopFrame(loop, 7);