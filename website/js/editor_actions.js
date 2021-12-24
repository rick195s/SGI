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
// function onHover(evento, mouse, raycaster) {
//     // Updating the mouse position
//     mouse.x = (evento.clientX / myCanvas.width) * 2 - 1;
//     mouse.y = -(evento.clientY / myCanvas.height) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);

//     var intersected = raycaster.intersectObjects(model.getParts());
//     if (intersected.length > 0) {
//         if (inter && inter != intersected[0]) {
//             inter.object.material.color = inter.object.userData.oldColor;
//         }

//         inter = intersected[0];
//         inter.object.userData.oldColor = inter.object.material.color.clone();

//         // Giving user the prespective of something happening
//         inter.object.material.color.set(0xff0000);
//     } else if (inter) {
//         inter.object.material.color = inter.object.userData.oldColor;
//         inter = null;
//     }
// }

function onClick() {
    if (inter) {
        clickedObject = inter;
        console.log(clickedObject.object.material.name);
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
        clickedObject.object.userData.oldMaterial = clickedObject.object.material;
        clickedObject.object.material.color.copy(clickedObject.object.userData.part.changeColor(value));
        update_price();
    }
}

function reset_item_color() {
    // Reset the object material
    clickedObject.object.material.copy(clickedObject.object.userData.oldMaterial);
}

function change_item_texture(value, save) {
    var texture = new THREE.TextureLoader().load("3D Model/materials/" + model.textures[value].path);
    clickedObject.object.material.map = texture;
    clickedObject.object.material.needsUpdate = true;
}

function start_animation(name) {
    var clipe = THREE.AnimationClip.findByName(model.animations, name);
    var action = mixer.clipAction(clipe);

    if (action.paused) {
        // two animations because the object was animated previously
        // and we just want the LoopPingPong to execute one time (backwards)
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
