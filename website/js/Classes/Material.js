class Material extends THREE.MeshBasicMaterial {
    constructor(...args) {
        super(...args);
        this.increasePrice = 0;
        this.name = "";
    }
}
