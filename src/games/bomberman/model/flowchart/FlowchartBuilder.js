const Flowchart = require('./Flowchart')
const Instruction = require('./Instruction')
const ludum = require('../../../../lib/ludum_pro_bono')

const keys = ludum.keys

class FlowchartBuilder {
    constructor() {
        this.dom = document.createElement('div')
        this.dom.classList.add('flowchart-builder')

        this.root = document.getElementById('body')
        this.root.append(this.dom)

        this.flowcharts = []
        this.indexFlowchart = 0
        this.indexInstruction = 0
        this.addKeyboardListener()
    }

    addFlowchart(flowchart = new Flowchart) {
        this.flowcharts.push(flowchart)
        this.dom.append(flowchart.dom)
    }

    addFlowcharts(flowcharts = [new Flowchart]) {
        flowcharts.forEach(flowchart => this.addFlowchart(flowchart))
    }

    getInstruction(indexFlowchart = this.indexFlowchart, indexInstruction = this.indexInstruction) {
        const flowchart = this.flowcharts[indexFlowchart]
        const instruction = flowchart.instructions[indexInstruction]
        return instruction
    }

    changeInstructionCurrent(callback) {
        const sendCurrentInstruction = () => {
            const instruction = this.getInstruction(this.indexFlowchart, this.indexInstruction)
            callback(instruction)
        }

        const leftOrRight = (indexs) => {
            if (this.flowcharts[indexs[0]].instructions.length > 0) {
                this.indexFlowchart = indexs[0]
                this.indexInstruction = indexs[1]
            }
            sendCurrentInstruction()
        }

        return {
            current: () => {
                sendCurrentInstruction()
            },
            up: () => {
                this.indexInstruction = this.getIndexFlowchartInstruction().up()[1]
                sendCurrentInstruction()
            },

            down: () => {
                this.indexInstruction = this.getIndexFlowchartInstruction().down()[1]
                sendCurrentInstruction()
            },

            right: () => {
                leftOrRight(this.getIndexFlowchartInstruction().right())
            },

            left: () => {
                leftOrRight(this.getIndexFlowchartInstruction().left())
            }
        }
    }

    moveInstructionSelectedOrChangeInstructionPreselected() {
        const selectOrPreselect = () => {
            const instruction = this.getInstruction()
            if (instruction.isSelected()) {
                return this.moveToDirection()
            } else {
                return this.preselect()
            }
        }

        return {
            current: () => {
                selectOrPreselect().current()
            },
            up: () => {
                selectOrPreselect().up()
            },

            down: () => {
                selectOrPreselect().down()
            },

            right: () => {
                selectOrPreselect().right()
            },

            left: () => {
                selectOrPreselect().left()
            }
        }
    }

    toggleSelect() {
        const instructionOldIsSelected = this.getInstruction().isSelected()
        this.unselect()
        return this.changeInstructionCurrent(instruction => {
            if (instructionOldIsSelected) {
                instruction.preselect()
            } else {
                instruction.select()
            }
        })
    }

    select() {
        this.unselect()
        return this.changeInstructionCurrent(instruction => instruction.select())
    }

    preselect() {
        this.unselect()
        return this.changeInstructionCurrent(instruction => instruction.preselect())
    }

    getIndexFlowchartInstruction() {
        const leftOrRight = (indexFlowchart) => {
            const maxIndexInstruction = this.flowcharts[indexFlowchart].instructions.length - 1
            let indexInstruction = this.indexInstruction
            if (maxIndexInstruction < indexInstruction) {
                indexInstruction = maxIndexInstruction
            }
            return [indexFlowchart, indexInstruction]
        }

        return {
            up: () => [this.indexFlowchart, this.getIndexInstruction().up()],
            down: () => [this.indexFlowchart, this.getIndexInstruction().down()],
            left: () => {
                const indexFlowchart = this.getIndexFlowchart().left()
                return leftOrRight(indexFlowchart)
            },
            right: () => {
                const indexFlowchart = this.getIndexFlowchart().right()
                return leftOrRight(indexFlowchart)
            },
        }
    }

    getIndexInstruction() {
        return {
            up: () => this.indexInstruction - 1 >= 0 ? this.indexInstruction - 1 : this.flowcharts[this.indexFlowchart].instructions.length - 1,
            down: () => this.indexInstruction + 1 < this.flowcharts[this.indexFlowchart].instructions.length ? this.indexInstruction + 1 : 0
        }
    }

    getIndexFlowchart() {
        return {
            right: () => this.indexFlowchart + 1 < this.flowcharts.length ? this.indexFlowchart + 1 : 0,
            left: () => this.indexFlowchart - 1 >= 0 ? this.indexFlowchart - 1 : this.flowcharts.length - 1
        }
    }

    moveToDirection() {
        return {
            up: () => {
                const [_, newIndexInstruction] = this.getIndexFlowchartInstruction().up()
                this.move(this.indexFlowchart, newIndexInstruction)
            },

            down: () => {
                const [_, newIndexInstruction] = this.getIndexFlowchartInstruction().down()
                this.move(this.indexFlowchart, newIndexInstruction)
            },

            right: () => {
                const [newIndexFlowchart, _] = this.getIndexFlowchartInstruction().right()
                this.move(newIndexFlowchart, this.indexInstruction)
            },

            left: () => {
                const [newIndexFlowchart, _] = this.getIndexFlowchartInstruction().left()
                this.move(newIndexFlowchart, this.indexInstruction)
            }
        }
    }

    move(
        newIndexFlowchart,
        newIndexInstruction,
        indexFlowchart = this.indexFlowchart,
        indexInstruction = this.indexInstruction
    ) {
        const instruction = this.getInstruction(indexFlowchart, indexInstruction)
        this.flowcharts[indexFlowchart].removeInstruction(instruction)
        newIndexInstruction = this.flowcharts[newIndexFlowchart].insertInstruction(newIndexInstruction, instruction)
        this.indexInstruction = newIndexInstruction
        this.indexFlowchart = newIndexFlowchart
    }

    unselect(indexFlowchart = this.indexFlowchart, indexInstruction = this.indexInstruction) {
        const instruction = this.getInstruction(indexFlowchart, indexInstruction)
        if (instruction) instruction.unselect()
    }

    addKeyboardListener() {
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case keys.action1:
                    this.toggleSelect().current()
                    break
                case keys.up:
                    this.moveInstructionSelectedOrChangeInstructionPreselected().up()
                    break
                case keys.down:
                    this.moveInstructionSelectedOrChangeInstructionPreselected().down()
                    break
                case keys.left:
                    this.moveInstructionSelectedOrChangeInstructionPreselected().left()
                    break
                case keys.right:
                    this.moveInstructionSelectedOrChangeInstructionPreselected().right()
                    break
            }
        })
    }
}

module.exports = FlowchartBuilder