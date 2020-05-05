import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene } from "three";
import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction) {
        var geo = new SphereGeometry(1, 8, 6);
        var mat = new MeshBasicMaterial({color: 0xdeadbeef});
        var mesh = new Mesh(geo, mat);
        this.mesh = mesh;
        this.mesh.position = position;
        console.log(mesh);
        var velocity = direction.normalize.divideScalar(0.2);
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
        let noCollisions = true;
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i] === this || ) {
                continue;
            }
            // player.geometry.computeBoundingBox();
            player.computeBoundingBox();
            scene.children[i].geometry.computeBoundingBox();
            let minW = scene.children[i].localToWorld(scene.children[i].geometry.boundingBox.min.clone());
            let maxW = scene.children[i].localToWorld(scene.children[i].geometry.boundingBox.max.clone());
            let boxW = new Box3(minW, maxW);
            // console.log(boxW, minPoint, maxPoint);
            if (boxW.containsPoint(minPoint) || boxW.containsPoint(maxPoint)) {
                noCollisions = false;
            }
        }
	    return noCollisions;
    }
}
export default Projectile;