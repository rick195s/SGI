//------------------------------------------------ CRIAR OBJETO PARA RENDER  ---------------------------------------------------
var renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
//------------------------------------------------ criar cena ---------------------------------------------------
var cena = new THREE.Scene();
cena.background = new THREE.Color(0xf1f1f1);

//------------------------------------------------ ADICIONAR CAMARA ---------------------------------------------------
var camara = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camara.position.x = 4;
camara.position.y = 3;
camara.position.z = 2;
camara.lookAt(0, 0, 0);
cena.add(camara);

//------------------------------------------------ CARREGAR FICHEIRO BLENDER ---------------------------------------------------
var cubo;
var carregador = new THREE.GLTFLoader();
carregador.load("./3D Model/workBenchM.gltf", function (gltf) {
    // desativar as luzes importados do blender
    gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Light) node.visible = false;

        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    gltf.material = new THREE.MeshStandardMaterial();
    cena.add(gltf.scene);
});

//------------------------------------------------ ADICIONAR CONTROLOS DE CENARIO ---------------------------------------------------
var controls = new THREE.OrbitControls(camara, renderer.domElement);

//------------------------------------------------ ADICIONAR LUZ AMBIENTE AO CENARIO ---------------------------------------------------
let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;
// Add directional Light to scene
cena.add(dirLight);

// Floor
let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
let floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    shininess: 0,
});

let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -11;
cena.add(floor);

var luzAmbiente = new THREE.AmbientLight("white");
luzAmbiente.position.set(5, 6, 0);
cena.add(luzAmbiente);

//------------------------------------------------ INTERACOES COM O RATO ---------------------------------------------------

var raycaster = new THREE.Raycaster();
var rato = new THREE.Vector2();

function invokeRaycaster() {
    raycaster.setFromCamera(rato, camara);

    // vai procurar na lista de botoes se existe algum desses elementos
    // que foram clicados

    var intersected = raycaster.intersectObjects(cena.getObjectByName("Scene"));

    if (intersected.length > 0) {
        // altera o material do cubo para o material do primeiro
        // botao da lista de selecionados
        cubo.material = intersected[0].object.material;
    }

    // intersected.forEach(function (node) {
    //     cubo.material = node.object.material;
    // });
}

window.onclick = function (evento) {
    rato.x = (evento.clientX / window.innerWidth) * 2 - 1;
    rato.y = -(evento.clientY / window.innerHeight) * 2 + 1;
    // invocar raycaster
    invokeRaycaster();
};
//------------------------------------------------ RENDERIZAR O CENARIO ---------------------------------------------------
function renderizar() {
    // caso exista algum objeto a ser animado no js podemos usar
    requestAnimationFrame(renderizar);
    renderer.render(cena, camara);
}

renderizar();
// caso nao haja objeto retirar isto de comentario
var controls = new THREE.OrbitControls(camara, renderer.domElement);
