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
function load_gltf_to(cena, path, selectableObjects) {
    var carregador = new THREE.GLTFLoader();

    carregador.load(path, function (gltf) {
        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Light) node.visible = false;
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
            node.children.forEach((element) => {
                selectableObjects.push(element);
            });
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
