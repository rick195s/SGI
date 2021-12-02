var renderer, camara, cena;
var width = document.getElementById("canvasDiv").offsetWidth;

init();
renderizar();

function init() {
    window.addEventListener("resize", () => (width = document.getElementById("canvasDiv").offsetWidth), false);

    //------------------------------------------------ CRIAR CENA ---------------------------------------------------

    cena = new THREE.Scene();

    var meuCanvas = document.getElementById("myCanvas");

    renderer = create_render(meuCanvas);

    //------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------
    camara = create_perspective_camera(window.innerWidth / window.innerHeight);

    cena.add(camara);

    update_window(renderer, camara, width, window.innerHeight);

    window.addEventListener("resize", () => update_window(renderer, camara, width, window.innerHeight), false);

    //load_gltf_to(cena, "../Material/gltf/cena.gltf");
    load_gltf_to(cena, "3D Model/workBenchM.gltf");

    //------------------------------------------------ ADICIONAR CONTROLOS DE CENARIO ---------------------------------------------------
    var controls = new THREE.OrbitControls(camara, renderer.domElement);

    //------------------------------------------------ ADICIONAR LUZ AMBIENTE AO CENARIO ---------------------------------------------------
    var luzAmbiente = new THREE.AmbientLight("white");
    luzAmbiente.position.set(5, 6, 0);
    cena.add(luzAmbiente);

    var raycaster = new THREE.Raycaster();

    meuCanvas.onclick = function (evento) {
        var rato = new THREE.Vector2();

        rato.x = (evento.clientX / window.innerWidth) * 2 - 1;
        rato.y = -(evento.clientY / window.innerHeight) * 2 + 1;
        // invocar raycaster
        invokeRaycaster(raycaster);
    };
}

//------------------------------------------------ INTERACOES COM O RATO ---------------------------------------------------

function invokeRaycaster(raycaster) {
    raycaster.setFromCamera(rato, camara);

    // vai procurar na lista de botoes se existe algum desses elementos
    // que foram clicados

    var intersected = raycaster.intersectObjects(botoes);

    if (intersected.length > 0) {
        // altera o material do cubo para o material do primeiro
        // botao da lista de selecionados
        cubo.material = intersected[0].object.material;
    }

    // intersected.forEach(function (node) {
    //     cubo.material = node.object.material;
    // });
}

//------------------------------------------------ RENDERIZAR O CENARIO ---------------------------------------------------
function renderizar() {
    // caso exista algum objeto a ser animado no js podemos usar
    requestAnimationFrame(renderizar);
    renderer.render(cena, camara);
}
