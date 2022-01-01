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
        inter.object.material.color.set(0xff0000);
    } else if (inter) {
        reset_item_material(inter.object);
        inter = null;
    }
}

function onClick() {
    if (inter) {
        clickedObject = inter;
        change_html(clickedObject.object);
    }
}

function change_item_color(value, save) {
    // Save temporarily the material so then it's possible to reset it
    clickedObject.object.userData.oldMaterial = clickedObject.object.material.clone();

    // Change the live object color
    clickedObject.object.material.color.copy(clickedObject.object.userData.part.colors[value]);

    // Change the object color permanently
    if (save) {
        clickedObject.object.userData.oldMaterial.copy(clickedObject.object.material);
        clickedObject.object.material.color.copy(clickedObject.object.userData.part.changeColor(value));
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
            change_item_texture(texture, save);
        }
    );
}

function change_item_texture(texture, save) {
    var partsWithSameTexture = model.findPartsWithTexture(clickedObject.object.material.name);

    partsWithSameTexture.forEach((element) => {
        element.userData.oldMaterial = element.material.clone();
        element.material.map = texture;
    });

    if (save) {
        partsWithSameTexture.forEach((element) => {
            element.userData.oldMaterial.copy(element.material);
        });
    }
}

function reset_item_material(object) {
    var partsWithSameTexture;
    // Reset the object material
    if (object) {
        partsWithSameTexture = model.findPartsWithTexture(object.material.name);
    } else {
        partsWithSameTexture = model.findPartsWithTexture(clickedObject.object.material.name);
    }

    partsWithSameTexture.forEach((element) => {
        element.material.copy(element.userData.oldMaterial);
    });
}

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
