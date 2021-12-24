var renderer, camera, scene, directLight;
var inter, clickedObject;
var model = new Model();

init();

var relogio = new THREE.Clock();
var mixer = new THREE.AnimationMixer(scene);

renderizar();

function init() {
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
    update_item_textures(model.getTexture(object.material.name));
}

function update_item_textures(textures) {
    html = "";

    // Updating the html of the colors tab
    if (textures.length > 0) {
        for (let i = 0; i < textures.length; i++) {
            html +=
                '<div class="col-lg-4">' +
                '<div  class="item_texture_card">' +
                '<span  class="bg-dark rounded-circle" style="height: 75px; width: 75px"></span>' +
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
        elements[i].onclick = () => change_item_texture(i, true);
        //elements[i].onmouseover = () => change_item_texture(i, false);
        //elements[i].onmouseout = () => reset_item_color();
    }
}

function update_item_colors(colors) {
    html = "";

    var images = render_images(colors);

    // Updating the html of the colors tab
    if (colors.length > 0) {
        for (let i = 0; i < colors.length; i++) {
            console.log(images[i].src);

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
        elements[i].onmouseover = () => change_item_color(i, false);
        elements[i].onmouseout = () => reset_item_color();
    }
}

function show_animations() {
    html = "";

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

function render_images(colors) {
    var screen_camera = create_perspective_camera(window.innerWidth / window.innerHeight);
    screen_camera.position.copy(clickedObject.object.position);
    screen_camera.position.y *= 2;
    screen_camera.position.x *= 1.5;
    screen_camera.position.z *= 2;
    screen_camera.lookAt(clickedObject.object.position);

    var width = document.getElementById("canvasDiv").offsetWidth;

    update_window(renderer, screen_camera, width, window.innerHeight);
    var images = [];
    for (let i = 0; i < colors.length; i++) {
        var img = new Image();
        clickedObject.object.material.color.copy(colors[i]);
        renderer.render(scene, screen_camera);
        img.src = renderer.domElement.toDataURL();
        images = images.concat(img);
    }
    return images;
    // renderer.render(scene, screen_camera);
    // renderer.domElement.toBlob(
    //     function (blob) {
    //         var a = document.createElement("a");
    //         var url = URL.createObjectURL(blob);
    //         a.href = url;
    //         a.download = "canvas.png";
    //         a.click();
    //     },
    //     "image/png",
    //     1.0
    // );
}
