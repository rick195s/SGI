class Model {
    constructor(price, { animations: animations }) {
        this.price = price < 0 ? 0 : price;
        this.parts = [];
        this.textures = [];
        this.animations = [];
        //this.selectedTextureIndex = -1;

        this.addAnimations(animations);
        this.addTextures(getTexturesFromJson());
    }

    getPrice() {
        var totalPrice = this.price;
        this.parts.forEach((part) => {
            totalPrice += part.userData.part.getIncreasePrice();
        });

        // If a material was selected its price will be counted
        //if (this.selectedTextureIndex >= 0) totalPrice += this.textures[this.selectedTextureIndex].price;

        if (totalPrice < 0) {
            alert("Price Invalid");
        }
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
        part.castShadow = true;
        part.receiveShadow = true;
        // Cloning the material because exist objects sharing the same material
        part.material = part.material.clone();
        // Storing a back-up material
        part.userData.oldMaterial = part.material.clone();
        part.userData.part = new Part();
        part.userData.part.addDefaultColor(part.material.color);
        part.userData.part.addColors(getColorsFromJson(part.name));
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
