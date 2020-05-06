import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene, Box3, BoxHelper } from "three";
// import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction) {
        var geo = new SphereGeometry(0.2, 8, 6);
        var mat = new MeshBasicMaterial({color: 0xdeadbeef});
        var mesh = new Mesh(geo, mat);
        mesh.position.copy(position)
        this.mesh = mesh;
        var velocity = direction.normalize().divideScalar(5);
        this.velocity = velocity;
        var damage = 1;
        this.damage = damage;
        this.boundingBox = new Box3();
        this.computeBoundingBox();
        this.mesh.name = 'projectile';
    }

    updatePosition() {
        this.mesh.position.add(this.velocity);
        this.computeBoundingBox();
    }

    checkPlayerCollision(player) {
        player.computeBoundingBox();
        if (this.boundingBox.intersectsBox(player.boundingBox)) {
            player.reduceHealth(this.damage);
        }
    }

    checkWallCollision(scene, player) {
        let length = scene.children.length;
        let currentBox = new Box3();
        for (let i = 0; i < length; i++) {
            if (scene.children[i] === player || scene.children[i].name == 'projectile') {
                continue;
            }
            currentBox = new Box3().setFromObject(scene.children[i]);
            if (this.boundingBox.intersectsBox(currentBox)) {
                scene.remove(this.mesh);
                return true;
            }
        }
        return false;
    }

    computeBoundingBox() {
        this.boundingBox = new Box3().setFromObject(this.mesh);
    }
}
export default Projectile;