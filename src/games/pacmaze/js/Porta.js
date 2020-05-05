const Objeto = require('../../../lib/GameObject')

class Porta extends Objeto {
    constructor(cor = 'lightgreen', corBorda = 'green', raio = 0, size = 30) {
        super('porta', size);
        this.size = size;
        this.cor = cor;

        this.dom.style.backgroundColor = cor;
        this.dom.style.border = 'solid 3px ' + corBorda;
        this.dom.style.boxSizing = 'border-box';
        this.dom.style.borderRadius = raio;

        this.setPosition({ x: window.innerWidth, y: window.innerHeight });
    }
}

module.exports = Porta