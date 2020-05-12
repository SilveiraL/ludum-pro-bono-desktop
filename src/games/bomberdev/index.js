const ludum = require('../../utils/ludum_pro_bono')
const Game = require('../../utils/Game')

const { tiposBloco, Bloco, BlocoInquebravel, BlocoQuebravel } = require('./model/scenario/Bloco')
const Bomberman = require('./model/scenario/Bomberman')
const Bomb = require('./model/scenario/Bomb')
const Scene = require('./model/scenario/Scene')
const FlowchartBuilder = require('./model/flowchart/FlowchartBuilder')
const Flowchart = require('./model/flowchart/Flowchart')
const Instruction = require('./model/flowchart/Instruction')
const InstructionCreator = require('./model/flowchart/InstructionCreator')

const keys = ludum.keys
ludum.addEscListenerBackToMenu()

const game = new Game('root')
const size_x = game.math.tornarMultiplo(550, 40)
const size_y = game.math.tornarMultiplo(550, 40)
game.windowProps.setSize(size_x, size_y)
game.windowProps.addClass('grama')

const coordinateSize = game.getCoordinateSize()

const scene = new Scene(game)
scene.criarMatrizDeBlocosInquebraveis(12, 12)

const bomberman = new Bomberman(coordinateSize, gameOver, scene)
bomberman.setCoordenadas(0, 0)

function gameOver() {
    alert('Game over')
    scene.clear()
}

function start(flowchartBuilder = new FlowchartBuilder) {
    bomberman.setCoordenadas(0, 0)
    const instructions = flowchartBuilder.flowcharts[0].instructions
    for (instruction of instructions) {
        instruction.action()
    }
}

const flowchartBuilder = new FlowchartBuilder()

const flowchart = new Flowchart()
const flowchart2 = new Flowchart()
const flowchart3 = new Flowchart()

const instructionCreator = new InstructionCreator(bomberman)

flowchart.addInstructions([
    instructionCreator.up(2),
    instructionCreator.bomb(),
    instructionCreator.right(3),
    instructionCreator.down(4),
])

flowchart2.addInstructions([
    instructionCreator.up(2),
    instructionCreator.left(),
    instructionCreator.bomb(),
    instructionCreator.right(1),
])

flowchart3.addInstructions([
    instructionCreator.up(2),
    instructionCreator.bomb(),
    instructionCreator.bomb(),
    instructionCreator.right(2),
])


flowchartBuilder.addFlowcharts([flowchart, flowchart2, flowchart3])

// game.keyDown(key => {
//     switch (key) {
//         case keys.up:
//             bomberman.actions.up(1)
//             break

//         case keys.down:
//             bomberman.actions.down(1)
//             break

//         case keys.left:
//             bomberman.actions.left(1)
//             break

//         case keys.right:
//             bomberman.actions.right(1)
//             break

//         case keys.action2:
//             bomberman.actions.bomb()
//             break
//     }
// })

document.addEventListener('keydown', e => {
    const key = e.keyCode
    if (key == keys.start) {
        start(flowchartBuilder)
    }
})

// bomberman.actions.bomb().up()