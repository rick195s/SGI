// When user hovers canvas
function onHover(evento, mouse, raycaster) {
    // Updating the mouse position
    mouse.x = (evento.clientX / myCanvas.width) * 2 - 1;
    mouse.y = -(evento.clientY / myCanvas.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersected = raycaster.intersectObjects(model.getParts());
    if (intersected.length > 0) {
        // reset item color of previous hovered item
        if (inter && inter != intersected[0]) {
            reset_item_material(inter.object);
        }

        inter = intersected[0];
        // Giving user the prespective of something happening
        inter.object.material.color.set(0xf47174);
    } else if (inter) {
        reset_item_material(inter.object);
        inter = null;
    }
}

// When user clicks an item
function onClick() {
    if (inter) {
        clickedObject = inter;
        change_html(clickedObject.object);
    }
}

// Change item color
function change_item_color(value, save) {
    // Save temporarily the material so then it's possible to reset it
    clickedObject.object.userData.oldMaterial = clickedObject.object.material.clone();

    // Change the live object color
    clickedObject.object.material.color.copy(clickedObject.object.userData.part.colors[value]);

    // Change the object color permanently
    if (save) {
        clickedObject.object.userData.oldMaterial.copy(clickedObject.object.material);
        clickedObject.object.material.color.copy(clickedObject.object.userData.part.changeColor(value));
        update_selected_card(value);
        update_price();
    }
}

// The ImageBitmap needs to be loaded and then after
// the change_item_texture will be called
function start_change_item_texture(value, save) {
    // instantiate a loader
    var loader = new THREE.ImageBitmapLoader();

    // load a image resource
    loader.load(
        // resource URL
        "3D Model/materials/" + model.textures[value].path,

        // onLoad callback
        (imageBitmap) => {
            var texture = new THREE.CanvasTexture(imageBitmap);
            // preventing bug from changing texture
            texture.encoding = THREE.sRGBEncoding;
            change_item_texture(texture, save);
        }
    );
}

function update_selected_card(value) {
    var colors = document.getElementsByClassName("item_color_card");

    for (let i = 0; i < colors.length; i++) {
        colors[i].classList.remove("selected");
    }

    var element = document.getElementById("color-" + value);
    element.classList.add("selected");
}

// Change item texture
function change_item_texture(texture, save) {
    var partsWithSameTexture = model.findPartsWithTexture(clickedObject.object.material.name);

    partsWithSameTexture.forEach((element) => {
        element.userData.oldMaterial = element.material.clone();

        element.material.map = texture;
        element.material.needsUpdate = true;
    });

    if (save) {
        partsWithSameTexture.forEach((element) => {
            element.userData.oldMaterial.copy(element.material);
        });
        update_price();
    }
}

// Reset the object material
function reset_item_material(object) {
    var partsWithSameTexture;
    if (object) {
        partsWithSameTexture = model.findPartsWithTexture(object.material.name);
    } else {
        partsWithSameTexture = model.findPartsWithTexture(clickedObject.object.material.name);
    }

    partsWithSameTexture.forEach((element) => {
        element.material.copy(element.userData.oldMaterial);
    });
}

// Start Model animations
function start_animation(name) {
    var clipe = THREE.AnimationClip.findByName(model.animations, name);
    var action = mixer.clipAction(clipe);

    if (action.paused) {
        // the loop was set to LoopPingPong to execute one time
        // because we want it to animate backwards
        action.setLoop(THREE.LoopPingPong, 2);
        action.paused = false;
        action.clampWhenFinished = false;
    } else {
        // stop() do the reset() of the animation and removes the
        // animation from the mixer
        action.stop();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
    }

    action.play();
}

// Enable or Disable the shadow from the scene
function change_shadow_state() {
    scene.getObjectByName("directLight").castShadow = !scene.getObjectByName("directLight").castShadow;
}

// Disable or enable direct light
function change_light_state() {
    var light = scene.getObjectByName("directLight");
    light.intensity = light.status ? 1.5 : 0;
    light.status = !light.status;
}

// Show or Hide scene plane
function change_plane_state() {
    scene.getObjectByName("Plane").visible = !scene.getObjectByName("Plane").visible;
}
