import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene } from "three";
// import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction) {
        var geo = new SphereGeometry(1, 8, 6);
        var mat = new MeshBasicMaterial({color: 0xdeadbeef});
        var mesh = new Mesh(geo, mat);
        mesh.position.copy(position)
        this.mesh = mesh;
        var velocity = direction.normalize().divideScalar(5);
        this.velocity = velocity;
        var damage = 1;
        this.damage = damage;
    }

    updatePosition() {
        this.mesh.position.add(this.velocity);
    }

    checkPlayerCollision(player) {

    }

    checkWallCollision(scene) {
    }
}
export default Projectile;