var renderer, camera, scene, directLight, model, relogio, mixer;
var inter, clickedObject;

init();
renderizar();

function init() {
    model = new Model();
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var width = document.getElementById("canvasDiv").offsetWidth;

    //------------------------------------------------ CRIAR scene ---------------------------------------------------
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    var canvas = document.getElementById("myCanvas");
    renderer = create_render(canvas);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.8;

    //------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------
    camera = create_perspective_camera(window.innerWidth / window.innerHeight);
    scene.add(camera);

    //------------------------------------------------ ADICIONAR CONTROLOS DE sceneRIO ---------------------------------------------------
    new THREE.OrbitControls(camera, renderer.domElement);

    update_window(renderer, camera, width, window.innerHeight);

    load_gltf_to(scene, "3D Model/workBenchM_animation.gltf", model);
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

//------------------------------------------------ RENDERIZAR O sceneRIO ---------------------------------------------------
function renderizar() {
    // caso exista algum objeto a ser animado no js podemos usar
    requestAnimationFrame(renderizar);
    mixer.update(relogio.getDelta());
    // Updating light direction when user moves camera
    directLight.position.set(camera.position.x + 5, camera.position.y + 15, camera.position.z + 5);
    renderer.render(scene, camera);
}

//------------------------------------------------ HOVER COM O mouse ---------------------------------------------------

function change_html(object) {
    document.getElementById("obejctName").innerHTML = object.name;
    update_item_colors(object.userData.part.getColors());
    update_item_textures(model.getTextures(object.material.name));
}

function update_item_textures(textures) {
    html = "";

    // Updating the html of the colors tab
    if (textures.length > 0) {
        for (let i = 0; i < textures.length; i++) {
            html +=
                '<div class="col-lg-4">' +
                '<div  class="item_texture_card">' +
                '<img  src="3D Model/materials/' +
                textures[i].path +
                '" class="bg-dark rounded-circle" style="height: 75px; width: 75px">' +
                "<p>" +
                textures[i].name +
                "</p>" +
                "</div>" +
                "</div>";
        }
    } else {
        html = '<div class="col-12"><div class="item_texture_card"><h4>Sem Texturas</h4></div></div>';
    }

    document.getElementById("item_textures").innerHTML = html;

    // Find all color elements of the right side tab
    var elements = document.getElementsByClassName("item_texture_card");

    // Add events that will be activated by the user interactions
    for (let i = 0; i < elements.length; i++) {
        // Not using addEventListener because each element just need one
        // action for each event
        elements[i].onclick = () => start_change_item_texture(i, true);
        elements[i].onmouseenter = () => start_change_item_texture(i, false);
        elements[i].onmouseleave = () => reset_item_material();
    }
}

function update_item_colors(colors) {
    set_loader("item_colors");
    var images = render_images(colors);
    var html = "";

    // Updating the html of the colors tab
    if (colors.length > 0) {
        for (let i = 0; i < colors.length; i++) {
            html +=
                '<div class="col-lg-4">' +
                '<div  class="item_color_card">' +
                '<img  src="' +
                images[i].src +
                '" class="bg-dark rounded-circle" style="height: 75px; width: 75px">' +
                "<p>" +
                colors[i].name +
                "</p>" +
                "</div>" +
                "</div>";
        }
    } else {
        html = '<div class="col-12"><div class="item_color_card"><h4>Sem Cores</h4></div></div>';
    }

    document.getElementById("item_colors").innerHTML = html;

    // Find all color elements of the right side tab
    var elements = document.getElementsByClassName("item_color_card");

    // Add events that will be activated by the user interactions
    for (let i = 0; i < elements.length; i++) {
        // Not using addEventListener because each element just need one
        // action for each event
        elements[i].onclick = () => change_item_color(i, true);
        elements[i].onmouseenter = () => change_item_color(i, false);
        elements[i].onmouseleave = () => reset_item_material();
    }
}

function show_animations() {
    var html = "";

    // Updating the html of the colors tab
    if (model.animations.length > 0) {
        for (let i = 0; i < model.animations.length; i++) {
            html +=
                '<span class="rounded-circle animationBtn">' +
                "<img " +
                'src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/1200px-How_to_use_icon.svg.png"' +
                'alt=""' +
                "/>" +
                "</span>";
        }
    } else {
        html = "<span>Objeto sem animações</span>";
    }

    document.getElementById("animationsInDiv").innerHTML = html;

    var elements = document.getElementsByClassName("animationBtn");

    // Add events that will be activated by the user interactions
    for (let i = 0; i < elements.length; i++) {
        // Not using addEventListener because each element just need one
        // action for each event
        elements[i].onclick = () => start_animation(model.animations[i].name);
    }
}

function update_price() {
    document.getElementById("price").innerHTML = model.getPrice() + "€";
}

// Taking screenshot of item with different colors or textures
function render_images(colors) {
    var screen_camera = set_render_image_camera();
    var images = [];
    for (let i = 0; i < colors.length; i++) {
        var img = new Image();
        clickedObject.object.material.color.copy(colors[i]);
        renderer.render(scene, screen_camera);
        img.src = renderer.domElement.toDataURL();
        images = images.concat(img);
    }
    reset_item_material();
    return images;
}

// Placing a new camera on a new position to take a screenshot
// of each color or texture of the item
function set_render_image_camera() {
    var screen_camera = create_perspective_camera(window.innerWidth / window.innerHeight);
    screen_camera.position.copy(clickedObject.object.position);
    screen_camera.position.y *= 2;
    screen_camera.position.z *= 2;
    screen_camera.lookAt(clickedObject.object.position);

    var width = document.getElementById("canvasDiv").offsetWidth;

    update_window(renderer, screen_camera, width, window.innerHeight);

    return screen_camera;
}

function set_loader(htmlElementId) {
    var html = '<div class="col-12 d-flex justify-content-center">' + '<div class="loader"></div>' + "</div>";

    document.getElementById(htmlElementId).innerHTML = html;
}
