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
        this.position.set(0, 6, -1.1);
        this.scale.set(3, 3, 3);

        // Sets initial properties
        this.isBoss = boss;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 10;
        // Draws the health bar only if the enemy is the boss
        if (this.isBoss) {
            this.healthBar = [];
            let fraction = 1 / this.health;
            let geo = new THREE.BoxGeometry(fraction, fraction, 0.2);
            let mat = new THREE.MeshBasicMaterial({color: 0xFF0000});
            for (let i = 0; i < this.health; i++) {
                let currentCube = new THREE.Mesh(geo, mat);
                currentCube.position.set(-5 + (fraction * i), -3, -4.5);
                this.healthBar.push(currentCube);
                this.parent.add(currentCube);
            }
        }
        var attack;
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
        let prevHealth = this.health;
        this.health -= damageValue;
        for (let i = prevHealth - 1; i >= this.health; i--) {
            this.parent.remove(this.healthBar[i]);
        }
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
            let projectile = new Projectile(position, direction.clone().applyAxisAngle(axis, 0.5 * Math.PI  * i / 5), false, 0xff0000);
            projectiles.push(projectile);
            this.parent.add(projectile.mesh);
        }
    }

    bossAimedAttack(projectiles, player) {
        let direction = player.position.clone().sub(this.position);
        let projectile = new Projectile(this.position, direction, false, 0xff0000);
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
        this.parent.add(projectile.light);
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