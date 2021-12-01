//------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------

function create_render(to_canvas) {
    var renderer = new THREE.WebGL1Renderer({ canvas: to_canvas });
    renderer.shadowMap.enabled = true;

    return renderer;
}

//------------------------------------------------ ADICIONAR CAMARA ---------------------------------------------------
function create_perspective_camera(aspect) {
    var camara = new THREE.PerspectiveCamera(50, aspect, 0.1, 500);
    camara.position.x = 15;
    camara.position.y = 15;
    camara.position.z = 15;
    camara.lookAt(0, 0, 0);

    return camara;
}

//------------------------------------------------ CARREGAR FICHEIRO BLENDER ---------------------------------------------------
function load_gltf_to(cena, path) {
    var cubo;
    var botoes = [];
    var carregador = new THREE.GLTFLoader();
    carregador.load(path, function (gltf) {
        // desativar as luzes importados do blender
        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Light) node.visible = false;

            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        gltf.material = new THREE.MeshStandardMaterial();
        cena.add(gltf.scene);

        // procurar o cubo na cena para depois ser possivel alterar
        // o seu material quando um dos botoes pequenos forem clicados
        cubo = cena.getObjectByName("Cubo");

        // adicionar os botoes à lista de botoes para depois
        // serem filtrados no invokeRaycaster
        botoes.push(cena.getObjectByName("Botao1"));
        botoes.push(cena.getObjectByName("Botao2"));
        botoes.push(cena.getObjectByName("Botao3"));
        botoes.push(cena.getObjectByName("Botao4"));
    });
}

function update_window(renderer, camara, width, height) {
    renderer.setSize(width, height);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
}
