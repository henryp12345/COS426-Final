import { Mesh, SphereGeometry, MeshPhongMaterial, Vector3, Scene, Box3, BoxHelper, Box3Helper, PointLight } from "three";
// import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction, isSpecial, color) {
        var geo = new SphereGeometry(0.2, 8, 6);
        var mat = new MeshPhongMaterial({color: color});
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
        if (isSpecial == true) {
            this.light = new PointLight(color);
            this.light.position.set(position.x, position.y, position.z + 0.25);
            this.light.name = 'light';
        } else {
            this.light = null;
        }
    }

    updatePosition() {
        this.mesh.position.add(this.velocity);
        if (this.light != null) {
            this.light.position.add(this.velocity);
        }
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
            if (scene.children[i] === player || scene.children[i].name == 'projectile' || scene.children[i].name == 'light') {
                continue;
            }
            currentBox = new Box3().setFromObject(scene.children[i]);
            if (this.boundingBox.intersectsBox(currentBox)) {
                scene.remove(this.mesh);
                scene.remove(this.light);
                return true;
            }
        }
        return false;
    }

    checkEnemyCollision(scene, enemy) {
        let death = false;
        enemy.computeBoundingBox();
        if (this.boundingBox.intersectsBox(enemy.boundingBox)) {
            death = enemy.reduceHealth(this.damage);
        }
        if (death) {
            scene.remove(this.mesh);
            scene.remove(this.light);
        }
        return death;
    }

    computeBoundingBox() {
        this.boundingBox = new Box3().setFromObject(this.mesh);
    }
}
export default Projectile;