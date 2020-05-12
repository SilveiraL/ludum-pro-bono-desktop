const { Soma, Subtracao, Multiplicacao, Divisao } = require('../model/operacao')

const todasOperacoes = [
    Soma,
    Subtracao,
    Multiplicacao,
    Divisao
]

const desafio = {
    resposta: null,
    dificuldade: 1,
    operacoes: [todasOperacoes[0]],
    dificuldadeAcrescimoOperacao: 1,

    acrescentarOperacao() {
        if (this.operacoes.length < todasOperacoes.length) {
            this.operacoes.push(todasOperacoes[this.operacoes.length])
            this.dificuldade = 0
        }
    },

    setDesafio(desafio) {
        document.getElementById('desafio').innerHTML = desafio
    },

    gerarDesafio() {
        const randomIndex = Math.floor(Math.random() * this.operacoes.length)
        console.log(randomIndex)
        const Operacao = this.operacoes[randomIndex]
        const operacao = new Operacao(this.dificuldade)
        this.setDesafio(`${operacao.toString()} = ?`)
        this.resposta = operacao.calcular()
        if (this.dificuldade > this.dificuldadeAcrescimoOperacao) {
            this.acrescentarOperacao()
        }
        this.dificuldade += 1
    }
}

module.exports = desafio