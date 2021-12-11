class Part {
    constructor(price) {
        this.price = price;
        this.selectedColorIndex = -1;
        this.selectedMaterialIndex = -1;
        this.colors = [];
        this.materials = [];

        this.addColor("default");
    }

    getIncreasePrice() {
        var increasePrice = 0;

        // If a color was selected its price will be counted
        if (this.selectedColorIndex >= 0) increasePrice += this.colors[this.selectedColorIndex].increasePrice;

        // If a material was selected its price will be counted
        if (this.selectedMaterialIndex >= 0) increasePrice += this.materials[this.selectedMaterialIndex].increasePrice;

        return this.price + increasePrice;
    }

    getColors() {
        return this.colors;
    }

    getMateriais() {
        return this.materials;
    }

    addColor(name) {
        this.colors.push(this.findColor(name));
    }

    addMaterial(material) {
        this.materials.push(material);
    }

    findColor(name) {
        var color = new Color();

        switch (name) {
            case "door":
                color.setHex(0x0000ff);
                color.name = "Azul";
                color.increasePrice = 100;
                break;
            case "default":
                color.setHex(0xffffff);
                color.name = "Normal";
                color.increasePrice = 0;
                break;
            default:
                color.setHex(0x00ff00);
                color.name = "Verde";
                color.increasePrice = 200;
                break;
        }

        return color;
    }

    changeColor(value) {
        console.log(value);
        if (value < 0 || value > this.colors.length - 1) {
            alert("Color does not exist " + value);
            return;
        }

        this.selectedColorIndex = value;
        console.log(this.colors[this.selectedColorIndex].increasePrice);

        return this.colors[value];
    }
}
