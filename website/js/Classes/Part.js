class Part {
    constructor(price) {
        this.increasePrice = price;
        this.colors = [];
        this.materials = [];
    }

    getIncreasePrice() {
        return this.increasePrice;
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
        var color = new THREE.Color(0x00ff00);
        color.customName = "Verde";

        switch (name) {
            case "door":
                color.setHex(0x0000ff);
                color.customName = "Azul";
                break;
            default:
                break;
        }

        return color;
    }
}
