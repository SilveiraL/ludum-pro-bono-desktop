const Objeto = require('../../../../utils/GameObject')
const Game = require('../../../../utils/Game')

class Scene {
    constructor(game = new Game()) {
        this.game = game
        this.bombs = []
        this.blocosInquebraveis = []
    }

    clear() {
        for (let bomb of this.bombs) {
            this.removeBomb(bomb)
        }
    }

    removeBomb(bomb) {
        this.game.window.removeChild(bomb.dom)
        this.bombs.splice(this.bombs.indexOf(bomb), 1)
    }

    criarMatrizDeBlocosInquebraveis(x, y) {
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (i % 2 != 0 && j % 2 != 0) {
                    const bloco = new BlocoInquebravel(coordinateSize)
                    bloco.setCoordenadas(i, j)
                    this.blocosInquebraveis.push(bloco)
                }
            }
        }
    }

    criarBlocosQuebraveisAleatoriamente(x, y) {

    }

    getObjetosColisores() {
        return [].concat(this.blocosInquebraveis, this.bombs)
    }
}

module.exports = Scene