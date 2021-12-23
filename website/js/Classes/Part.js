class Part {
    constructor(price) {
        this.price = price;
        this.selectedColorIndex = -1;
        this.selectedMaterialIndex = -1;
        this.colors = [];
    }

    getIncreasePrice() {
        var increasePrice = 0;

        // If a color was selected its price will be counted
        if (this.selectedColorIndex >= 0) increasePrice += this.colors[this.selectedColorIndex].increasePrice;

        // If a material was selected its price will be counted
        if (this.selectedMaterialIndex >= 0) increasePrice += this.materials[this.selectedMaterialIndex].increasePrice;

        return this.price + increasePrice;
    }

    getSelectedColor() {
        return this.colors[this.selectedColorIndex];
    }

    getColors() {
        return this.colors;
    }

    addDefaultColor(color) {
        var defaultColor = new Color(color);
        defaultColor.increasePrice = 0;
        defaultColor.name = "Normal";
        this.colors.push(defaultColor);
        this.selectedColorIndex = this.colors.indexOf(defaultColor);
    }

    async addColors(colors) {
        this.colors = this.colors.concat(await colors);
    }

    changeColor(value) {
        if (value < 0 || value > this.colors.length - 1) {
            alert("Color does not exist " + value);
            return;
        }

        this.selectedColorIndex = value;
        return this.colors[value];
    }
}
