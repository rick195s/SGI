//------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------

function create_render(to_canvas) {
    var renderer = new THREE.WebGL1Renderer({ canvas: to_canvas, alpha: true });
    renderer.shadowMap.enabled = true;

    return renderer;
}

//------------------------------------------------ ADICIONAR CAMARA ---------------------------------------------------
function create_perspective_camera(aspect) {
    var camera = new THREE.PerspectiveCamera(60, aspect, 1, 500);
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 15;
    camera.lookAt(0, 2.5, 0);

    return camera;
}

//------------------------------------------------ CARREGAR FICHEIRO BLENDER ---------------------------------------------------
function load_gltf_to(cena, path, model) {
    var carregador = new THREE.GLTFLoader();

    carregador.load(path, function (gltf) {
        gltf.scene.traverse((node) => {
            if (node instanceof THREE.Light) node.visible = false;
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.userData.part = new Part(100);
                node.userData.part.addDefaultColor(node.material.color);
                node.userData.part.addColors(getColorsFromJson(node.name));
                model.addPart(node);
            }

            update_price();
        });

        // gltf.parser.getDependencies("material").then((materials) => {
        //     console.log(materials);
        // });
        model.addTextures(getTexturesFromJson());
        model.addAnimations(gltf.animations);
        show_animations();
        gltf.material = new THREE.MeshStandardMaterial();
        cena.add(gltf.scene);
    });
}

function update_window(renderer, camara, width, height) {
    renderer.setSize(width, height);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
}

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

function add_light_to(scene) {
    //------------------------------------------------ ADICIONAR LUZ AMBIENTE AO sceneRIO ---------------------------------------------------
    var luzPoint = new THREE.AmbientLight(0xffffff, 4);
    scene.add(luzPoint);

    // Sun Light
    directLight = new THREE.DirectionalLight(0xffa95c, 4);
    directLight.castShadow = true;
    directLight.shadow.bias = -0.0001;
    directLight.shadow.mapSize.width = 1024 * 4;
    directLight.shadow.mapSize.heigh = 1024 * 4;
    scene.add(directLight);
}
