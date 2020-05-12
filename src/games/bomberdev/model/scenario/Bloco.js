const Objeto = require('../../../../utils/GameObject')

const tiposBloco = {
    INQUEBRAVEL: 'INQUEBRAVEL',
    QUEBRAVEL: 'QUEBRAVEL'
}

class Bloco extends Objeto {
    constructor(size, tipo) {
        super('bloco', size)
        this.tipo = tipo
        this.dom.classList.add('bloco')
        this.dom.classList.add('bloco-' + tipo)
    }
}

class BlocoInquebravel extends Bloco {
    constructor(size) {
        super(size, 1)
        this.dom.classList.add('bloco')
        this.dom.classList.add('bloco-' + tiposBloco.INQUEBRAVEL)
    }
}

class BlocoQuebravel extends Bloco {
    constructor(size) {
        super(size, 1)
        this.dom.classList.add('bloco')
        this.dom.classList.add('bloco-' + tiposBloco.QUEBRAVEL)
    }
}

module.exports = { tiposBloco, Bloco, BlocoInquebravel, BlocoQuebravel }