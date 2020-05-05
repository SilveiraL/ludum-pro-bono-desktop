const ludum = require('../../lib/ludum_pro_bono')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

const game = {
    janela: document.getElementById('window'),
    intervalo: null,
    frame: null,

    setBackgroundColor(cor) {
        this.janela.style.backgroundColor = cor;
    },

    setSize(width, height) {
        this.janela.style.width = width + 'px';
        this.janela.style.height = height + 'px';
    },

    create(tipoElemento = 'div', id) {
        const elemento = document.createElement(tipoElemento);
        elemento.id = id;
        elemento.style.position = 'absolute';
        elemento.style.bottom = window.innerHeight;
        elemento.style.left = window.innerWidth;
        return elemento;
    },

    add(elemento) {
        this.janela.appendChild(elemento);
    },

    remove(elemento) {
        this.janela.removeChild(elemento);
    },

    loop(functionLoop = function () { console.log('loop') }, tempo = 10) {
        this.intervalo = setInterval(functionLoop, tempo);
    },

    loopFrame(callback = function () { console.log('loop') }, intervalo) {
        const functionLoop = callback;
        let frame = 0;

        this.frame = () => {
            if (frame % intervalo == 0) {
                functionLoop(frame);
            }

            frame++;
            window.requestAnimationFrame(this.frame);
        };

        this.frame();
    },

    clearLoop() {
        clearInterval(this.intervalo);
        this.frame = null;
    },

    centralizar(elemento) {
        this.centralizarX(elemento);
        this.centralizarY(elemento);
    },

    centralizarX(elemento) {
        const horizontal = (window.innerWidth / 2) - (this.getSizeX(elemento) / 2);
        this.setX(elemento, horizontal);
    },

    centralizarY(elemento) {
        const vertical = (window.innerHeight / 2) - (this.getSizeY(elemento) / 2);
        this.setY(elemento, vertical);
    },

    setPosicao(elemento, x, y) {
        if (x === Number(x)) x = x + 'px';
        if (y === Number(y)) y = y + 'px';

        elemento.style.bottom = y;
        elemento.style.left = x;
    },

    getPosicao(elemento) {
        let x = elemento.style.left, y = elemento.style.bottom;

        const converterNumber = valor => {
            return Number(valor
                .replace('px', '')
                .replace('vh', '')
                .replace('vw', '')
                .replace('%', '')
            );
        }

        y = converterNumber(y);
        x = converterNumber(x);

        return { y, x }
    },

    setX(elemento, x) {
        elemento.style.left = x + 'px';
    },

    setY(elemento, y) {
        elemento.style.bottom = y + 'px';
    },

    getX(elemento) {
        return this.getPosicao(elemento).x;
    },

    getY(elemento) {
        return this.getPosicao(elemento).y;
    },

    getSizeX(elemento) {
        return Number(elemento.style.width.replace('px', ''));
    },

    getSizeY(elemento) {
        return Number(elemento.style.height.replace('px', ''));
    },

    keyDown(evento) {
        document.addEventListener('keydown', (e) => {
            evento(e.keyCode);
        });
    }
}

class Bloco {
    constructor(id, cor = 'lightgreen', corBorda = 'lightgreen', raio = 0, size = 15) {
        this.id = id;
        this.size = size;
        this.cor = cor;

        this.velocidadeX = 0;
        this.velocidadeY = 0;

        this.bloco = game.create('div', id);
        this.bloco.style.backgroundColor = cor;
        this.bloco.style.border = 'solid 2px ' + corBorda;
        this.bloco.style.boxSizing = 'border-box';
        this.bloco.style.borderRadius = raio;
        this.bloco.style.height = size + 'px';
        this.bloco.style.width = size + 'px';

        game.add(this.bloco);
    }

    setPosition({ x, y }) {
        this.setX(x);
        this.setY(y);
    }

    getPosition() {
        return { x: this.getX(), y: this.getY() }
    }

    setX(x) {
        this.bloco.style.left = x + 'px';
    }

    setY(y) {
        this.bloco.style.bottom = y + 'px';
    }

    getX() {
        return Number(this.bloco.style.left.replace('px', ''));
    }

    getY() {
        return Number(this.bloco.style.bottom.replace('px', ''));
    }

    moverX(x) {
        this.setX(this.getX() + x);
    }

    moverY(y) {
        this.setY(this.getY() + y);
    }
}

class Food {
    constructor(id, valor, cor, corBorda) {
        this.id = id;
        this.valor = valor;

        if (!corBorda) corBorda = cor;

        this.food = new Bloco(id, cor, corBorda, '100px');
        this.sortearLugar();
        this.food.bloco.style.textAlign = 'center';
        this.food.bloco.style.display = 'flex';
        this.food.bloco.style.alignItems = 'center';
        this.food.bloco.style.justifyContent = 'center';
        this.food.bloco.style.color = 'white';
        this.food.bloco.style.fontSize = '12px';
    }

    sortearLugar() {
        let x = Math.random() * (campo.maxX() / 15)
        let y = Math.random() * (campo.maxY() / 15);
        x = Number((x).toFixed(0)) * 15;
        y = Number((y).toFixed(0)) * 15;
        this.food.setPosition({ x, y });
    }
}

class Snake {
    constructor(id, cor, corBorda) {
        this.id = id;
        this.cor = cor;
        this.corBorda = corBorda;
        this.pontos = 0;
        this.divPontos = document.querySelector('[snake=' + id + '] > .pontos');
        this.iniciouMovimento = false;
        this.movimentoTurno = false;

        this.head = new Bloco(id + '-head', cor, 'white');
        this.body = [new Bloco(this.id + '-body-0', this.cor, this.corBorda)];

        this.head.setPosition({ x: campo.xi, y: campo.yi });
    }

    addBody(quantidade) {
        if (!quantidade) quantidade = 1;

        for (let n = 0; n < quantidade; n++) {
            const square = new Bloco(this.id + '-body-' + this.body.length, this.cor, this.corBorda);
            square.setPosition({ x: window.innerWidth, y: window.innerHeight })
            this.body.push(square);
        }
    }

    posicionarBody() {
        for (let n = this.body.length - 1; n > 0; n--) {
            this.body[n].setPosition(this.body[n - 1].getPosition());
        }
        this.body[0].setPosition(this.head.getPosition());
    }

    verificarColisaoFood(foods = [new Food()]) {
        foods.forEach(food => {
            const { x, y } = food.food.getPosition();
            if (this.head.getX() == x && this.head.getY() == y) {
                this.colisaoFood(food);
            }
        });
    }

    colisaoFood(food = new Food()) {
        this.setPontos(food.valor);

        food.sortearLugar();

        if (this.pontos == desafio.resposta) {
            addTempo(100);
            this.setPontos(0);
            this.addBody(((desafio.dificuldade - 5) / 5));
            desafio.gerarDesafio();
        }
    }

    verificarColisaoSnake(snakes = [new Snake()]) {
        snakes.forEach(snake => {
            if (this.iniciouMovimento) {
                snake.body.forEach(body => {
                    if (this.head.getX() == body.getX() && this.head.getY() == body.getY()) {
                        gameOver(this);
                        return;
                    }
                });
            }
        });
    }

    setPontos(valor) {
        if (valor == 0) this.pontos = 0;
        else {
            this.pontos += valor;
            if (this.pontos < 0) this.pontos = 0;
        }

        this.divPontos.innerHTML = 'Soma: ' + this.pontos;
    }
}

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

const desafio = {
    resposta: null,
    dificuldade: 5,

    setDesafio(desafio) {
        document.getElementById('desafio').innerHTML = desafio;
    },

    gerarDesafio() {
        const n1 = Math.ceil(Math.random() * this.dificuldade);
        const n2 = Math.ceil(Math.random() * this.dificuldade);
        this.setDesafio(`${n1} + ${n2} = ?`);
        this.resposta = n1 + n2;
        this.dificuldade += 5;
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