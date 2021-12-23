class Model {
    constructor() {
        this.parts = [];
        this.textures = [];
        this.animations = [];
    }

    getPrice() {
        var totalPrice = 0;
        this.parts.forEach((part) => {
            totalPrice += part.userData.part.getIncreasePrice();
        });

        return totalPrice;
    }

    getTexture(name) {
        var validTextures = [];
        for (let index = 0; index < this.textures.length; index++) {
            if (this.textures[index].material.localeCompare(name) == 0) {
                validTextures.push(this.textures[index]);
            }
        }

        return validTextures;
    }

    async addTextures(textures) {
        console.log(await textures);

        this.textures = this.textures.concat(await textures);
    }

    addAnimations(animations) {
        this.animations = this.animations.concat(animations);
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
