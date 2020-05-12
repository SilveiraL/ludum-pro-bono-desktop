class Operacao {
    constructor(dificuldade) {
        this.dificuldade = dificuldade
        this.a = 0
        this.b = 0
        this.gerarExpressao()
    }

    gerarExpressao() {

    }

    toString() {
        return null
    }

    calcular() {
        return null
    }
}

class Soma extends Operacao {
    gerarExpressao() {
        this.a = Math.ceil(Math.random() * this.dificuldade * 5)
        this.b = Math.ceil(Math.random() * this.dificuldade * 5)
    }

    toString() {
        return `${this.a} + ${this.b}`
    }

    calcular() {
        return this.a + this.b
    }
}

class Subtracao extends Operacao {
    gerarExpressao() {
        const n1 = Math.ceil(Math.random() * this.dificuldade * 5)
        const n2 = Math.ceil(Math.random() * this.dificuldade * 5)
        this.a = Math.max(n1, n2)
        this.b = Math.min(n1, n2)
    }

    toString() {
        return `${this.a} - ${this.b}`
    }

    calcular() {
        return this.a - this.b
    }
}

class Multiplicacao extends Operacao {
    toString() {
        return `${this.a} x ${this.b}`
    }

    calcular() {
        return this.a * this.b
    }
}

class Divisao extends Operacao {
    toString() {
        return `${this.a} / ${this.b}`
    }

    calcular() {
        return this.a / this.b
    }
}

module.exports = {
    Operacao,
    Soma,
    Subtracao,
    Multiplicacao,
    Divisao
}