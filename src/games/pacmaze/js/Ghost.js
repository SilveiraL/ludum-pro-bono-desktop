const Objeto = require('../../../lib/GameObject')

class Ghost extends Objeto {
    constructor(cor = 'amarelo', circuito = [], velocidade = 30) {
        super('ghost-' + cor);

        this.classe = 'ghost';
        this.velocidade = velocidade;
        this.cor = cor;
        this.circuito = circuito;
        this.nCircuito = 0;

        this.gif = document.createElement('img');
        this.alterarGif('left');
        this.dom.append(this.gif);
        this.gif.style.height = '30px';
        this.gif.style.scale = '2px'

        this.root.append(this.dom);
    }

    alterarGif(direcao) {
        this.gif.src = "./img/sprites/fantasmas/" + this.cor + "/" + direcao + ".gif";
    }

    moverX(x) {
        super.moverX(x);
        if (x < 0) this.alterarGif('left');
        else if (x > 0) this.alterarGif('right');
    }

    moverY(y) {
        super.moverY(y);
        if (y < 0) this.alterarGif('down');
        else if (y > 0) this.alterarGif('up');
    }

    animar() {
        const circuito = this.circuito[this.nCircuito];

        if (circuito.x == this.getCoordenadaX() && circuito.y == this.getCoordenadaY()) {
            this.nCircuito++;
            this.velocidadeX = 0;
            this.velocidadeY = 0;
        }
        else if (circuito.x > this.getCoordenadaX()) this.velocidadeX = this.velocidade;
        else if (circuito.y > this.getCoordenadaY()) this.velocidadeY = this.velocidade;
        else if (circuito.x < this.getCoordenadaX()) this.velocidadeX = -this.velocidade;
        else if (circuito.y < this.getCoordenadaY()) this.velocidadeY = -this.velocidade;

        this.moverX(this.velocidadeX / 8);
        this.moverY(this.velocidadeY / 8);

        if (this.nCircuito >= this.circuito.length) this.nCircuito = 0;
    }

    addCoordenada(x, y) {
        this.circuito.push({ x, y });
    }
}

module.exports = Ghost