function set_scene() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var width = document.getElementById("canvasDiv").offsetWidth;
    var canvas = document.getElementById("myCanvas");
    renderer = create_render(canvas);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.8;

    camera = create_perspective_camera(window.innerWidth / window.innerHeight);
    scene.add(camera);

    // user controls to the scene
    new THREE.OrbitControls(camera, renderer.domElement);
    update_window(renderer, camera, width, window.innerHeight);
    add_light_to(scene);

    relogio = new THREE.Clock();
    mixer = new THREE.AnimationMixer(scene);

    // Resize canvas when page is resized
    window.addEventListener(
        "resize",
        () => {
            width = document.getElementById("canvasDiv").offsetWidth;
            update_window(renderer, camera, width, window.innerHeight);
        },
        false
    );

    // Show what object is being hovered
    canvas.addEventListener("mousemove", (evento) => onHover(evento, mouse, raycaster));

    // Selects the hovered object
    canvas.addEventListener("click", () => onClick(raycaster));
}
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
    camera.position.y = 15;
    camera.position.z = 15;
    //camera.lookAt(0, 2.5, 0);

    return camera;
}

// Replacing the loader inside canvasDiv with this html
function set_canvas() {
    var html =
        '<canvas id="myCanvas"></canvas>' +
        '<div id="animationsOutDiv" class="d-flex align-items-center">' +
        "<h6>Animações</h6>" +
        '<div style="display: flex; flex-direction: row" id="animationsInDiv">' +
        "<span>Objeto sem animações</span>" +
        "</div>" +
        "</div>";

    document.getElementById("canvasDiv").innerHTML = html;
    show_animations();
}

function update_window(renderer, camara, width, height) {
    renderer.setSize(width, height);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
}

function add_light_to(scene) {
    //------------------------------------------------ ADICIONAR LUZ AMBIENTE AO sceneRIO ---------------------------------------------------
    var luzPoint = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(luzPoint);

    // Sun Light
    directLight = new THREE.DirectionalLight(0xffa95c, 4);
    // directLight.castShadow = true;
    // directLight.shadow.bias = -0.0001;
    // directLight.shadow.mapSize.width = 1024 * 4;
    // directLight.shadow.mapSize.heigh = 1024 * 4;
    scene.add(directLight);
}
