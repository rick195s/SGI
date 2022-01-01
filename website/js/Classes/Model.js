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

    getTextures(name) {
        // find this.textures with same name as 'name'
        var validTextures = [];
        for (let index = 0; index < this.textures.length; index++) {
            if (this.textures[index].materialName.localeCompare(name) == 0) {
                validTextures.push(this.textures[index]);
            }
        }

        return validTextures;
    }

    async addTextures(textures) {
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

    findPartsWithTexture(name) {
        var found = [];
        this.parts.forEach((part) => {
            if (name.localeCompare(part.material.name) == 0) {
                found = found.concat(part);
            }
        });

        return found;
    }
}
