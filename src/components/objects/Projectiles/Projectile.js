import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Scene, Box3, BoxHelper, Box3Helper } from "three";
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
        this.name = "projectile";
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
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i] === player || scene.children[i].name == "projectile") {
                continue;
            }
            let currentBox = scene.children[i].geometry.boundingBox;
            if (this.boundingBox.intersectsBox(currentBox)) {
                // let min = scene.children[i].localToWorld(currentBox.min);
                // let max = scene.children[i].localToWorld(currentBox.max);
                // let a = this.mesh.localToWorld(this.boundingBox.min);
                // let b = this.mesh.localToWorld(this.boundingBox.max);
                // let boxA = new Box3(min, max);
                // let boxB = new Box3(a, b);
                // console.log(boxA.intersectsBox(boxB));
                // let helper = new BoxHelper(scene.children[i].geometry);
                // scene.add(currentBox);
                console.log(scene.children[i]);
                scene.remove(this.mesh);
            }
        }
    }

    computeBoundingBox() {
        this.boundingBox = new Box3().setFromObject(this.mesh);
    }
}
export default Projectile;