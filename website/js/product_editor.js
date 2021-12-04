var renderer,
    camara,
    cena,
    directLight,
    selectableObjects = [];
var inter, clickedObject;
var model = new Model(100);

init();
renderizar();

function init() {
    console.log(model.getPrice());

    var raycaster = new THREE.Raycaster();
    var rato = new THREE.Vector2();
    var width = document.getElementById("canvasDiv").offsetWidth;

    //------------------------------------------------ CRIAR CENA ---------------------------------------------------
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0xffffff);

    var meuCanvas = document.getElementById("myCanvas");
    renderer = create_render(meuCanvas);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.8;

    //------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------
    camara = create_perspective_camera(window.innerWidth / window.innerHeight);
    cena.add(camara);

    //------------------------------------------------ ADICIONAR CONTROLOS DE CENARIO ---------------------------------------------------
    new THREE.OrbitControls(camara, renderer.domElement);

    update_window(renderer, camara, width, window.innerHeight);

    load_gltf_to(cena, "3D Model/workBenchM.gltf", selectableObjects);

    add_light_to(cena);

    // Resize canvas when page is resized
    window.addEventListener(
        "resize",
        () => {
            width = document.getElementById("canvasDiv").offsetWidth;
            update_window(renderer, camara, width, window.innerHeight);
        },
        false
    );

    myCanvas.addEventListener("mousemove", (evento) => invokeRaycaster(evento, rato, raycaster));
    // invocar raycaster
    myCanvas.onclick = (evento) => invokeRaycaster(evento, rato, raycaster, true);
}

//------------------------------------------------ RENDERIZAR O CENARIO ---------------------------------------------------
function renderizar() {
    // caso exista algum objeto a ser animado no js podemos usar
    requestAnimationFrame(renderizar);

    // Updating light direction when user moves camara
    directLight.position.set(camara.position.x + 5, camara.position.y + 15, camara.position.z + 5);
    renderer.render(cena, camara);
}

//------------------------------------------------ INTERACOES COM O RATO ---------------------------------------------------

function invokeRaycaster(evento, rato, raycaster, clicked) {
    rato.x = (evento.clientX / myCanvas.width) * 2 - 1;
    rato.y = -(evento.clientY / myCanvas.height) * 2 + 1;
    raycaster.setFromCamera(rato, camara);

    // vai procurar na lista de botoes se existe algum desses elementos
    // que foram clicados

    var intersected = raycaster.intersectObjects(selectableObjects);

    if (intersected.length > 0) {
        if (clicked) {
            change_html(inter.object.name);
            update_price(model.getPrice());
            if (clickedObject) {
                clickedObject.object.material.color.set(0xffffff);
            }
            clickedObject = inter;
        }

        if (inter && inter != intersected[0]) {
            inter.object.material.color.set(0xffffff);
        }

        inter = intersected[0];

        // material foi clonado, porque existem vários objetos da mesa com
        // referencia para o mesmo material
        inter.object.material = inter.object.material.clone();
        inter.object.material.color.set(0xff0000);
    } else if (inter) inter.object.material.color.set(0xffffff);

    if (clickedObject) {
        clickedObject.object.material.color.set(0xff0000);
    }
}

function change_html(name) {
    document.getElementById("obejctName").innerHTML = name;
}

function add_light_to(cena) {
    //------------------------------------------------ ADICIONAR LUZ AMBIENTE AO CENARIO ---------------------------------------------------
    var luzPoint = new THREE.AmbientLight(0xffffff, 4);
    cena.add(luzPoint);

    // Sun Light
    directLight = new THREE.DirectionalLight(0xffa95c, 4);
    directLight.castShadow = true;
    directLight.shadow.bias = -0.0001;
    directLight.shadow.mapSize.width = 1024 * 4;
    directLight.shadow.mapSize.heigh = 1024 * 4;
    cena.add(directLight);
}

function update_price(price) {
    console.log((document.getElementById("price").firstElementChild.textContent = price));
}
