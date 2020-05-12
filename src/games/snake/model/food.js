class Food {
    constructor(id, valor, cor, corBorda) {
        this.id = id;
        this.valor = valor;

        if (!corBorda) corBorda = cor;

        this.food = new Bloco(id, cor, corBorda, '100px');
        this.sortearLugar();
        this.food.bloco.style.textAlign = 'center';
        this.food.bloco.style.display = 'flex';
        this.food.bloco.style.alignItems = 'center';
        this.food.bloco.style.justifyContent = 'center';
        this.food.bloco.style.color = 'white';
        this.food.bloco.style.fontSize = '12px';
    }

    sortearLugar() {
        let x = Math.random() * (campo.maxX() / 15)
        let y = Math.random() * (campo.maxY() / 15);
        x = Number((x).toFixed(0)) * 15;
        y = Number((y).toFixed(0)) * 15;
        this.food.setPosition({ x, y });
    }
}

module.exports = Food