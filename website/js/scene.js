//------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------

function create_render(to_canvas) {
    var renderer = new THREE.WebGL1Renderer({ canvas: to_canvas, alpha: true });
    renderer.shadowMap.enabled = true;

    return renderer;
}

//------------------------------------------------ ADICIONAR CAMARA ---------------------------------------------------
function create_perspective_camera(aspect) {
    var camara = new THREE.PerspectiveCamera(60, aspect, 1, 500);
    camara.position.x = 15;
    camara.position.y = 15;
    camara.position.z = 15;
    camara.lookAt(0, 0, 0);

    return camara;
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
            }
            node.children.forEach((element) => {
                element.userData.part = new Part(100);
                element.userData.part.addColor(element.name);
                model.addPart(element);
            });
            update_price(model.getPrice());
        });

        gltf.material = new THREE.MeshStandardMaterial();
        cena.add(gltf.scene);
    });
}

function update_window(renderer, camara, width, height) {
    renderer.setSize(width, height);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
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
