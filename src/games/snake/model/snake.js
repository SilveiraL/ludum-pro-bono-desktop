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
            addTempo(20);
            this.setPontos(0);
            this.addBody(Math.ceil(desafio.dificuldade / 3));
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

module.exports = Snake