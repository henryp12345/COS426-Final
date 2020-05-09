import * as THREE from 'three';
// import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './model.obj';
import MAT from './materials.mtl'
import {Flower} from 'objects';
import Projectile from '../Projectiles/Projectile';

class Enemy extends THREE.Group {
    constructor(parent, boss) {
        super();

        this.parent = parent;

        // This code loads the wizard mesh
        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.setResourcePath('src/components/objects/Enemy/');
        mtlLoader.load(MAT, (material) => {
            material.preload();
            loader.setMaterials(material).load(MODEL, (obj) => {
                this.add(obj);
            });
        });
        this.rotation.set(3 * Math.PI / 2, 0, 0);
        this.position.set(0, 3, -1.1);
        this.scale.set(3, 3, 3);

        // Sets initial properties
        this.isBoss = boss;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 10;
        var attack;
        // this.position.set(0, 3, 0);
        this.name = 'enemy'
        // boss attack patterns
        if (this.isBoss) {
            
        }
       
        let direction = this.position.clone();
        direction.x = Math.random() * 7 - 3.5;
        this.futurePosition = direction;
        let velocity = direction.clone();
        velocity.sub(this.position);
        velocity.normalize().multiplyScalar(0.1);
        this.velocity = velocity;

    }

    computeBoundingBox() {
        this.boundingBox = new THREE.Box3().setFromObject(this);
    }
    
    reduceHealth(damageValue) {
        this.health -= damageValue;
        if (this.health <= 0) {
            if (this.parent != null)
                this.parent.remove(this);
            return true;
        }
        return false;
    }

    attack(projectiles, player) {
        let shot = new Projectile(this.position, new THREE.Vector3(0, -1, 0), false, 0xff0000);
        if (this.parent != null) {
            projectiles.push(shot);
            this.parent.add(shot.mesh);
        }
    }

    bossSprayAttack(projectiles, player) {
        let direction = player.position.clone().sub(this.position);
        let axis = new THREE.Vector3(0, 0, 1);
        direction.applyAxisAngle(axis, -0.2 * Math.PI);
        let position = this.position.clone();
        for (let i = 0; i < 5; i++) {
            let projectile = new Projectile(position, direction.clone().applyAxisAngle(axis, 0.5 * Math.PI  * i / 5), false);
            projectiles.push(projectile);
            this.parent.add(projectile.mesh);
        }
    }

    bossAimedAttack(projectiles, player) {
        let direction = player.position.clone().sub(this.position);
        let projectile = new Projectile(this.position, direction, true, 0xff0000);
        projectiles.push(projectile);
        this.parent.add(projectile.mesh);
    }

    bossSpecialAttack(projectiles, player) {
        let direction = player.position.clone().sub(this.position);
        let projectile = new Projectile(this.position, direction, true, 0xff0000);
        projectile.mesh.geometry.scale(5, 5, 5);
        projectile.damage = projectile.damage * 5;
        projectiles.push(projectile);
        this.parent.add(projectile.mesh);
    }

    move() {
        if (Math.abs(this.position.x) + 0.05 >= Math.abs(this.futurePosition.x) && Math.abs(this.position.x) - 0.05 <= Math.abs(this.futurePosition.x)) {
            this.futurePosition.x = Math.random() * 7 - 3.5;
            let direction = this.futurePosition.clone().sub(this.position);
            direction.normalize().multiplyScalar(0.05);
            this.velocity = direction;
        }
        else {
            this.position.add(this.velocity);
        }
    }
}

export default Enemy;