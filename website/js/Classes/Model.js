class Model {
    constructor() {
        this.parts = [];
        this.price = 0;
    }

    getPrice() {
        return this.price;
    }

    addPart(part) {
        this.price += part.userData.part.increasePrice;
        this.parts.push(part);
    }

    getParts() {
        return this.parts;
    }

    findPart(part) {
        var found = null;
        this.parts.forEach((element) => {
            if (element.name.localeCompare(part.name) == 0) {
                found = element;
            }
        });

        return found;
    }
}
