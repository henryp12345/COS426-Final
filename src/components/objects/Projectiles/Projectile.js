import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene, Box3 } from "three";
// import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction) {
        var geo = new SphereGeometry(0.2, 8, 6);
        var mat = new MeshBasicMaterial({color: 0xdeadbeef});
        var mesh = new Mesh(geo, mat);
        mesh.position.copy(position)
        this.mesh = mesh;
        var velocity = direction.normalize().divideScalar(25);
        this.velocity = velocity;
        var damage = 1;
        this.damage = damage;
        this.boundingBox = new Box3();
        this.computeBoundingBox();
    }

    updatePosition() {
        this.mesh.position.add(this.velocity);
        this.computeBoundingBox();
    }

    checkPlayerCollision(player) {

    }

    checkWallCollision(scene, player) {
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i] === player) {
                console.log(i);
                continue;
            }
            scene.children[i].geometry.computeBoundingBox();
            let currentBox = scene.children[i].geometry.boundingBox;
            if (this.boundingBox.intersectsBox(currentBox)) {
                scene.remove(this.mesh);
            }
        }
    }

    computeBoundingBox() {
        this.boundingBox = new Box3().setFromObject(this.mesh);
    }
}
export default Projectile;