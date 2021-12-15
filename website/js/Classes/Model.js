class Model {
    constructor() {
        this.parts = [];
        this.animations = [];
    }

    getPrice() {
        var totalPrice = 0;
        this.parts.forEach((part) => {
            totalPrice += part.userData.part.getIncreasePrice();
        });

        return totalPrice;
    }

    addPart(part) {
        this.parts.push(part);
    }

    addAnimations(animations) {
        this.animations = [...this.animations, ...animations];
    }

    getParts() {
        return this.parts;
    }

    findPart() {
        var found = null;
        this.parts.forEach((part) => {
            if (part.name.localeCompare(part.name) == 0) {
                found = part;
            }
        });

        return found;
    }
}
