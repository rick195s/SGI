// File with principal code for the edit_product page that changes html

var renderer, camera, scene, directLight, model, relogio, mixer;
var inter, clickedObject;

init();

function init() {
    set_loader("canvasDiv");

    var loader = new THREE.GLTFLoader();

    // Extracting GET params from URL
    let params = new URL(document.location).searchParams;
    var name = params.get("model") == null ? "workBench" : params.get("model");

    // Get all products from products.json
    getProducts().then((products) => {
        var path,
            price = 0,
            model_options_path;

        // searching for the selected product
        products.forEach((product) => {
            if (product.name == name) {
                path = product.model_3d;
                price = product.basePrice;
                model_options_path = product.model_options;
                return;
            }
        });

        // creating scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        loader.load(path, function (gltf) {
            // Creating model with all the custom fields
            model = new Model(price, model_options_path, { animations: gltf.animations });
            gltf.scene.traverse((node) => {
                if (node instanceof THREE.Light) node.visible = false;
                if (node instanceof THREE.Mesh) {
                    model.addPart(node);
                }
            });

            set_canvas();
            gltf.material = new THREE.MeshStandardMaterial();
            scene.add(gltf.scene);
            set_scene();
            renderizar();
        });
    });
}

// Render scenario
function renderizar() {
    // caso exista algum objeto a ser animado no js podemos usar
    requestAnimationFrame(renderizar);
    mixer.update(relogio.getDelta());
    // Updating light direction when user moves camera
    directLight.position.set(camera.position.x + 5, camera.position.y + 15, camera.position.z + 5);
    renderer.render(scene, camera);
}

// Called when user clickes an item
function change_html(object) {
    set_option_tab();
    document.getElementById("obejctName").innerHTML = object.name;
    update_item_colors(object.userData.part.getColors());
    update_item_textures(model.getTextures(object.material.name));
    update_price();
}

// Change the textures html from the right tab
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
        html = '<div class="col-12"><div id="item_texture"><h4>Sem Texturas</h4></div></div>';
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

// Change the colors html from the right tab
function update_item_colors(colors) {
    set_loader("item_colors");
    render_images(colors).then((images) => {
        var html = "";

        // Updating the html of the colors tab
        if (colors.length > 0) {
            for (let i = 0; i < colors.length; i++) {
                html +=
                    '<div class="col-lg-4">' +
                    '<div  class="item_color_card">' +
                    //'<span class="rounded-circle" style="height: 75px; width: 75px; background-color: #' +
                    //colors[i].getHexString() +
                    //'"></span>' +
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
    });
}

// Showing animations inside the canvas
function show_animations(animationsData) {
    var html = "";

    animationsData.then((data) => {
        if (model.animations.length > 0) {
            for (let i = 0; i < model.animations.length; i++) {
                html +=
                    '<span class="rounded-circle animationBtn">' +
                    "<img " +
                    'src="' +
                    data[model.animations[i].name].image +
                    '"' +
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
            elements[i].onclick = () => start_animation(model.animations[i].name);
        }
    });
}

// Update price when user changes item color or texture
function update_price() {
    document.getElementById("price").innerHTML = model.getPrice() + "€";
}

// Taking screenshot of item with different colors or textures
async function render_images(colors) {
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
    screen_camera.position.y += 4;
    screen_camera.position.z += 4;

    screen_camera.lookAt(clickedObject.object.position);

    var width = document.getElementById("canvasDiv").offsetWidth;

    update_window(renderer, screen_camera, width, window.innerHeight);

    return screen_camera;
}

// Loader to show the system status to user
function set_loader(htmlElementId) {
    var html =
        '<div class="col-12 d-grid text-center justify-content-center">' +
        '<div class="loader"></div><h5 class="pt-3">Loading...</h5>' +
        "</div>";

    document.getElementById(htmlElementId).innerHTML = html;
}

// Adding the scene options to the left side
function scene_options() {
    var html =
        '<div id="sceneOptions" class="align-items-center">' +
        "<h6>Opções</h6>" +
        '<div title="Ativar/Desativar Sombras" style="display: flex; flex-direction: row" id="scene_shadow">' +
        '<span class="rounded-circle sceneOptionBtn">' +
        '<img src="img/shadow_icon.png" alt="" />' +
        "</span>" +
        "</div>" +
        '<div title="Ligar/Desligar Luzes"  style="display: flex; flex-direction: row" id="scene_shut_light">' +
        '<span class="rounded-circle sceneOptionBtn">' +
        '<img src="img/night_day_icon.png" alt="" />' +
        "</span>" +
        "</div>" +
        '<div title="Adicionar/Remover Plano"  style="display: flex; flex-direction: row" id="scene_remove_plane">' +
        '<span class="rounded-circle sceneOptionBtn">' +
        '<img src="img/remove_plane_icon.png" alt="" />' +
        "</span>" +
        "</div>" +
        "</div>";

    document.getElementById("canvasDiv").innerHTML += html;
    document.getElementById("scene_shadow").addEventListener("click", () => change_shadow_state());
    document.getElementById("scene_shut_light").addEventListener("click", () => change_light_state());
    document.getElementById("scene_remove_plane").addEventListener("click", () => change_plane_state());
}

// changing the option tab html
function set_option_tab() {
    var html =
        ' <div class="row mb-3">' +
        '<h4 class="mt-5">Escolha uma cor</h4>' +
        '<p id="obejctName">Selecione um Objecto</p>' +
        "</div>" +
        '<div class="row" id="item_colors">' +
        '<div class="col-12">' +
        '<div class="item_color_card">' +
        "   <h5>Sem Cores</h5>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<hr />" +
        '<div class="row mb-3">' +
        "<h4>Escolha uma Textura</h4>" +
        "</div>" +
        '<div class="row" id="item_textures">' +
        '<div class="col-12">' +
        '    <div class="item_texture_card">' +
        "         <h5>Sem Texturas</h5>" +
        "      </div>" +
        "   </div>" +
        "</div>" +
        '<div class="row" id="priceDiv">' +
        "<h6>JUNTAR AO CARRINHO:</h6>" +
        '<p id="price"></p>' +
        "</div>";

    document.getElementById("option_tab").innerHTML = html;
}
