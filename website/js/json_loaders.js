async function getColorsFromJson(name, model_options_path) {
    return await fetch(model_options_path)
        .then((response) => response.json())
        .then((data) => {
            var colors = [];
            if (data.parts[name]) {
                for (var i = 0; i < data.parts[name].colors.length; i++) {
                    var color = new Color();
                    color.increasePrice = data.parts[name].colors[i].price;
                    color.name = data.parts[name].colors[i].name;
                    color.setHex(data.parts[name].colors[i].hex);
                    colors.push(color);
                }
            }
            return colors;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getTexturesFromJson(model_options_path) {
    return await fetch(model_options_path)
        .then((response) => response.json())
        .then((data) => {
            return data.textures;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getAnimationImagesFromJson(model_options_path) {
    return await fetch(model_options_path)
        .then((response) => response.json())
        .then((data) => {
            return data.animations;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getProducts() {
    return await fetch("products.json")
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}
