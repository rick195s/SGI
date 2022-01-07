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

    // scene plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = "Plane";
    plane.visible = false;
    scene.add(plane);

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

// Create render
function create_render(to_canvas) {
    var renderer = new THREE.WebGL1Renderer({ canvas: to_canvas, alpha: true });
    renderer.shadowMap.enabled = true;

    return renderer;
}

// Create camera
function create_perspective_camera(aspect) {
    var camera = new THREE.PerspectiveCamera(60, aspect, 1, 500);
    camera.position.y = 15;
    camera.position.z = 15;

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
    show_animations(getAnimationImagesFromJson(model.model_options_path));
    scene_options();
}

function update_window(renderer, camara, width, height) {
    renderer.setSize(width, height);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
}

function add_light_to(scene) {
    // Ambient Light
    var luzPoint = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(luzPoint);

    // Back light
    var backLight = new THREE.DirectionalLight(0xfcffff, 1.2);
    backLight.position.x = 13;
    backLight.position.y = -6;
    backLight.position.z = 19;
    backLight.castShadow = true;
    backLight.shadow.bias = -0.0001;
    scene.add(backLight);

    // front right light
    var frontRightLight = new THREE.DirectionalLight(0xffffff, 0.9);
    frontRightLight.position.x = 11;
    frontRightLight.position.y = 30;
    frontRightLight.position.z = 11;
    frontRightLight.castShadow = true;
    frontRightLight.shadow.bias = -0.0001;
    scene.add(frontRightLight);

    // front left light
    directLight = new THREE.DirectionalLight(0xffe6ed, 1.5);
    directLight.position.x = -12;
    directLight.position.y = -7;
    directLight.position.z = 15;
    directLight.castShadow = true;
    directLight.shadow.bias = -0.0001;
    directLight.name = "directLight";
    directLight.state = true;
    scene.add(directLight);
}
