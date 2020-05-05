const Objeto = require('../../../lib/GameObject')

class Food extends Objeto {
    constructor() {
        super('food', 30);

        this.dom.classList.add('food');
        this.dom.appendChild(document.createElement('div'));

        this.setPosition({ x: window.innerWidth, y: window.innerHTML });
    }
}

module.exports = Food