class Instruction {
    constructor(content, action = null) {
        this.dom = document.createElement('div')
        this.dom.classList.add('instruction')
        if (typeof content == 'object') {
            this.dom.appendChild(content)
        } else {
            this.dom.innerHTML = content
        }
        this.action = action
    }

    isSelected() {
        return this.dom.classList.contains('selected')
    }

    isPreselected() {
        return this.dom.classList.contains('preselected')
    }

    select() {
        this.dom.classList.add('selected')
    }

    preselect() {
        this.dom.classList.add('preselected')
    }

    unselect() {
        this.dom.classList.remove('preselected')
        this.dom.classList.remove('selected')
    }
}

module.exports = Instruction