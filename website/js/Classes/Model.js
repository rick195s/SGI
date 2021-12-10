class Model {
    constructor() {
        this.parts = [];
    }

    getPrice() {
        var totalPrice = 0;
        this.parts.forEach((element) => {
            totalPrice += element.userData.part.getIncreasePrice();
        });

        return totalPrice;
    }

    addPart(part) {
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
