async function getColorsFromJson(name) {
    return await fetch("model_options/workBench.json")
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

async function getTexturesFromJson() {
    return await fetch("model_options/workBench.json")
        .then((response) => response.json())
        .then((data) => {
            return data.textures;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getAnimationImagesFromJson() {
    return await fetch("model_options/workBench.json")
        .then((response) => response.json())
        .then((data) => {
            return data.animations;
        })
        .catch((error) => {
            console.error(error);
        });
}
