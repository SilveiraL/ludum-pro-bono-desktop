const Instruction = require('./Instruction')

class Flowchart {
    constructor() {
        this.dom = document.createElement('div')
        this.dom.classList.add('flowchart')
        this.instructions = []
    }

    insertInstruction(index = 0, instruction = new Instruction) {
        if (index < this.instructions.length) {
            this.instructions.splice(index, 0, instruction)
            this.dom.insertBefore(instruction.dom, this.dom.childNodes[index])
            return index
        } else {
            return this.addInstruction(instruction)
        }
    }

    addInstruction(instruction = new Instruction) {
        this.instructions.push(instruction)
        this.dom.append(instruction.dom)
        return this.instructions.length - 1
    }

    removeInstruction(instruction = new Instruction) {
        this.instructions.splice(this.instructions.indexOf(instruction), 1)
        this.dom.removeChild(instruction.dom)
    }

    addInstructions(instructions = [new Instruction]) {
        instructions.forEach(instruction => this.addInstruction(instruction))
    }
}

module.exports = Flowchart