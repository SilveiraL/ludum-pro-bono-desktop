const Bomberman = require('../scenario/Bomberman')
const Instruction = require('./Instruction')

class InstructionCreator {
    constructor(bomberman = new Bomberman) {
        this.bomberman = bomberman
        this.sizeImg = 30
    }

    create(texto, action) {
        return new Instruction(texto, action)
    }


    bomb() {
        return this.create(this.createImgText("./assets/img/bomb.png"), () => {
            this.bomberman.actions.bomb()
        })
    }

    createImgText(pathImg) {
        return `<img style="margin: 5px" width="${this.sizeImg}" height="${this.sizeImg}" src="${pathImg}">`
    }

    up(n = 1) {
        return this.create(
            `${n} ${this.createImgText("./assets/img/setas/up.png")}`,
            () => this.bomberman.actions.up(n)
        )
    }
    down(n = 1) {
        return this.create(
            `${n} ${this.createImgText("./assets/img/setas/down.png")}`, (
            ) => this.bomberman.actions.down(n)
        )
    }
    left(n = 1) {
        return this.create(
            `${n} ${this.createImgText("./assets/img/setas/left.png")}`,
            () => this.bomberman.actions.left(n)
        )
    }
    right(n = 1) {
        return this.create(
            `${n} ${this.createImgText("./assets/img/setas/right.png")}`,
            () => this.bomberman.actions.right(n)
        )
    }
}

module.exports = InstructionCreator