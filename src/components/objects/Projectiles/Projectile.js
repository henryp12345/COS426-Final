import { Mesh, SphereGeometry, MeshPhongMaterial, Vector3, Scene, Box3, BoxHelper, Box3Helper, PointLight } from "three";
// import Player from './components/objects/Player/Player';

class Projectile {
    constructor(position, direction, isSpecial, color) {
        var geo = new SphereGeometry(0.1, 3, 2);
        var mat = new MeshPhongMaterial({color: color});
        var mesh = new Mesh(geo, mat);
        mesh.position.copy(position)
        this.mesh = mesh;
        var velocity = direction.normalize().divideScalar(8);
        this.velocity = velocity;
        var damage = 1;
        this.damage = damage;
        this.boundingBox = new Box3();
        this.computeBoundingBox();
        this.mesh.name = 'projectile';
        if (isSpecial == true) {
            this.light = new PointLight(color, 0.5);
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

    checkPlayerCollision(scene, player) {
        // array to return, index 0 is hit confirm, 1 is death confirm
        let bools = [];
        bools.push(false);
        bools.push(false);
        player.computeBoundingBox();
        if (this.boundingBox.intersectsBox(player.boundingBox)) {
            // report contact
            bools[0] = true
            // reduce enemy hit's health, check for death
            bools[1] = player.reduceHealth(this.damage);

            // remove the projectile
            scene.remove(this.mesh);
            if (this.light != null) {
                scene.remove(this.light);
            }
        }
        return bools;
    }

    checkWallCollision(scene, player) {
        let length = scene.children.length;
        let currentBox = new Box3();
        for (let i = 0; i < length; i++) {
            if (scene.children[i] === player || scene.children[i].name == 'projectile' || scene.children[i].name == 'light' || scene.children[i].name == 'enemy') {
                continue;
            }
            this.computeBoundingBox();
            currentBox = new Box3().setFromObject(scene.children[i]);
            if (this.boundingBox.intersectsBox(currentBox)) {
                scene.remove(this.mesh);
                if (this.light != null) {
                    scene.remove(this.light);
                }
                return true;
            }
        }
        return false;
    }

    checkEnemyCollision(scene, enemy) {
        // array to return, index 0 is hit confirm, 1 is death confirm
        let bools = [];
        bools.push(false);
        bools.push(false);
        enemy.computeBoundingBox();
        if (this.boundingBox.intersectsBox(enemy.boundingBox)) {
            // report contact
            bools[0] = true
            // reduce enemy hit's health, check for death
            bools[1] = enemy.reduceHealth(this.damage);
            // remove the projectile
            scene.remove(this.mesh);
            if (this.light != null) {
                scene.remove(this.light);
            }
        }
        return bools;
    }

    computeBoundingBox() {
        this.boundingBox = new Box3().setFromObject(this.mesh);
    }
}
export default Projectile;