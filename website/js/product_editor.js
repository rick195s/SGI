var renderer, camera, scene, directLight;
var inter, clickedObject;
var model = new Model();

init();

var relogio = new THREE.Clock();
var misturador = new THREE.AnimationMixer(scene);

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
    misturador.update(relogio.getDelta());
    // Updating light direction when user moves camera
    directLight.position.set(camera.position.x + 5, camera.position.y + 15, camera.position.z + 5);
    renderer.render(scene, camera);
}

//------------------------------------------------ HOVER COM O mouse ---------------------------------------------------

function onHover(evento, mouse, raycaster) {
    // Updating the mouse position
    mouse.x = (evento.clientX / myCanvas.width) * 2 - 1;
    mouse.y = -(evento.clientY / myCanvas.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var intersected = raycaster.intersectObjects(model.getParts());

    if (intersected.length > 0) {
        if (inter && inter != intersected[0]) {
            inter.object.material = inter.object.userData.oldMaterial;
        }

        inter = intersected[0];

        // Cloning the material because exist objects sharing the same material
        inter.object.material = intersected[0].object.material.clone();

        inter.object.userData.oldMaterial = inter.object.material.clone();

        // Giving user the prespective of something happening
        inter.object.material.color.set(0xff0000);
    } else if (inter) {
        inter.object.material = inter.object.userData.oldMaterial;
        inter = null;
    }
}

function onClick(raycaster) {
    var intersected = raycaster.intersectObjects(model.getParts());

    if (intersected.length > 0) {
        clickedObject = intersected[0];
        change_html(clickedObject.object);
    }
}

function change_html(object) {
    document.getElementById("obejctName").innerHTML = object.name;

    update_item_colors(object.userData.part.getColors());
}

function show_animations() {
    html = "";

    // Updating the html of the colors tab
    if (colors.length > 0) {
        for (let i = 0; i < colors.length; i++) {
            html +=
                '<div class="col-lg-4">' +
                '<div  class="item_color_card">' +
                '<span  class="bg-dark rounded-circle" style="height: 75px; width: 75px"></span>' +
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
}

function update_price() {
    document.getElementById("price").firstElementChild.textContent = model.getPrice();
}

function update_item_colors(colors) {
    html = "";

    // Updating the html of the colors tab
    if (colors.length > 0) {
        for (let i = 0; i < colors.length; i++) {
            html +=
                '<div class="col-lg-4">' +
                '<div  class="item_color_card">' +
                '<span  class="bg-dark rounded-circle" style="height: 75px; width: 75px"></span>' +
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

function change_item_color(value, save) {
    // Save temporarily the material so then it's possible to reset it
    clickedObject.object.userData.oldMaterial = clickedObject.object.material.clone();

    // Change the live object color
    clickedObject.object.material.color = clickedObject.object.userData.part.colors[value];

    // Change the object color permanently
    if (save) {
        clickedObject.object.userData.oldMaterial = clickedObject.object.material;
        clickedObject.object.material.color = clickedObject.object.userData.part.changeColor(value);
        update_price();
    }
}

function reset_item_color() {
    // Reset the object material
    clickedObject.object.material = clickedObject.object.userData.oldMaterial;
}
