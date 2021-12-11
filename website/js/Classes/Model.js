class Model {
    constructor() {
        this.parts = [];
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
