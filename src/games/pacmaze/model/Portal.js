const Objeto = require('../../../utils/GameObject')

class Portal extends Objeto {
    constructor(cor = 'blue', size = 30) {
        super('portal-' + cor, size)
        this.size = size
        this.cor = cor

        this.gif = document.createElement('img')
        this.gif.style.height = size + 'px'
        this.gif.style.width = size + 'px'
        this.gif.src = './img/portais/portal-' + cor + '.gif'
        this.dom.append(this.gif)

        this.dom.oncontextmenu = e => {
            this.removerObjeto(portais)
        }
    }

    removerObjeto(portais) {
        if (!!portais) {
            for (let n in portais) {
                if (portais[n][0] === this || portais[n][1] === this) {
                    this.root.removeChild(portais[n][0].dom);
                    if (!!portais[n][1]) this.root.removeChild(portais[n][1].dom);
                    portais = portais.splice(n, 1)
                    break
                }
            }
        } else {
            this.root.removeChild(this.dom);
        }
    }
}

module.exports = Portal