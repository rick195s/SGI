var renderer,
    camara,
    cena,
    directLight,
    selectableObjects = [];
var width = document.getElementById("canvasDiv").offsetWidth;

var raycaster = new THREE.Raycaster();
var rato = new THREE.Vector2();

init();
renderizar();

function init() {
    window.addEventListener("resize", () => (width = document.getElementById("canvasDiv").offsetWidth), false);
    //------------------------------------------------ CRIAR CENA ---------------------------------------------------
    cena = new THREE.Scene();
    cena.background = new THREE.Color(0xdddddd);
    var meuCanvas = document.getElementById("myCanvas");

    renderer = create_render(meuCanvas);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.8;

    //------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------
    camara = create_perspective_camera(window.innerWidth / window.innerHeight);
    cena.add(camara);

    update_window(renderer, camara, width, window.innerHeight);

    window.addEventListener("resize", () => update_window(renderer, camara, width, window.innerHeight), false);
    //window.addEventListener("mousemove", (evento) => invokeRaycaster(evento));
    load_gltf_to(cena, "3D Model/workBenchM.gltf", selectableObjects);
    //------------------------------------------------ ADICIONAR CONTROLOS DE CENARIO ---------------------------------------------------
    var controls = new THREE.OrbitControls(camara, renderer.domElement);

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

    myCanvas.onclick = function (evento) {
        rato.x = (evento.clientX / myCanvas.width) * 2 - 1;
        rato.y = -(evento.clientY / myCanvas.height) * 2 + 1;
        // invocar raycaster
        invokeRaycaster();
    };
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

function invokeRaycaster() {
    raycaster.setFromCamera(rato, camara);
    // vai procurar na lista de botoes se existe algum desses elementos
    // que foram clicados

    var intersected = raycaster.intersectObjects(selectableObjects);
    if (intersected.length > 0) {
        // altera o material do cubo para o material do primeiro
        // botao da lista de selecionados
        console.log(intersected);
    }

    // intersected.forEach(function (node) {
    //     cubo.material = node.object.material;
    // });
}
