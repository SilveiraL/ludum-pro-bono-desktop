const game = require('../utils/game')

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

module.exports = Bloco