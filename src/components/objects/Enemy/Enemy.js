import * as THREE from 'three';
// import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './model.obj';
import MODEL1 from './Enemy1/model.obj'
import MODEL2 from './Enemy2/smeyeball.obj'
import MAT from './materials.mtl'
import MAT1 from './Enemy1/materials.mtl'
import MAT2 from './Enemy2/smeyeball.mtl'
import Projectile from '../Projectiles/Projectile';

class Enemy extends THREE.Group {
    constructor(parent, boss, wave1, wave2, position) {
        super();

        this.parent = parent;
        this.health = 10;
        if (wave1) {
            const loader = new OBJLoader();
            const mtlLoader = new MTLLoader();
            mtlLoader.setResourcePath('src/components/objects/Enemy/Enemy1');
            mtlLoader.load(MAT1, (material) => {
                material.preload();
                loader.setMaterials(material).load(MODEL1, (obj) => {
                    this.add(obj);
                });
            });
            this.position.set(position.x, position.y, position.z);
            if (this.position.x > 0) {
                this.rotation.set(3 * Math.PI / 2, 0, 0);
            } else {
                this.rotation.set(3 * Math.PI / 2, Math.PI, 0);
            }

            this.scale.set(2, 2, 2);
            this.health = 5;
            this.direction = new THREE.Vector3(0, 1, 0);
        }
        else if (wave2) {
            const loader = new OBJLoader();
            const mtlLoader = new MTLLoader();
            mtlLoader.setResourcePath('src/components/objects/Enemy/');
            mtlLoader.load(MAT2, (material) => {
                material.preload();
                loader.setMaterials(material).load(MODEL2, (obj) => {
                    this.add(obj);
                });
            });
            this.rotation.set(3 * Math.PI / 2, 0, 0);
            this.position.set(position.x, position.y, position.z);
            this.scale.set(3, 3, 3);
        }
        else if (boss) {
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
            this.position.set(position.x, position.y, position.z);
            this.scale.set(3, 3, 3);
            this.direction = new THREE.Vector3(0, 1, 0);
        }

        // Draws the health bar only if the enemy is the boss
        if (boss) {
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

        // Sets initial properties
        this.isBoss = boss;
        this.wave1 = wave1;
        this.wave2 = wave2;
        this.direction = new THREE.Vector3(0, 1, 0);
        
        this.name = 'enemy'
        
        if (this.wave1) {
            let direction = this.position.clone();
            direction.y = Math.random() * 6;
            this.futurePosition = direction;
            let velocity = direction.clone();
            velocity.sub(this.position);
            velocity.normalize().multiplyScalar(0.1);
            this.velocity = velocity;
        }
        else {
            let direction = this.position.clone();
            direction.x = Math.random() * 7 - 3.5;
            this.futurePosition = direction;
            let velocity = direction.clone();
            velocity.sub(this.position);
            velocity.normalize().multiplyScalar(0.1);
            this.velocity = velocity;
        }

    }

    computeBoundingBox() {
        this.boundingBox = new THREE.Box3().setFromObject(this);
    }
    
    reduceHealth(damageValue) {
        let prevHealth = this.health;
        this.health -= damageValue;
        if (this.isBoss) {
            for (let i = prevHealth - 1; i >= this.health; i--) {
                this.parent.remove(this.healthBar[i]);
            }
        }
        if (this.health <= 0) {
            if (this.parent != null)
                this.parent.remove(this);
            return true;
        }
        return false;
    }

    attack(projectiles, player) {
        if (this.wave1) {
            let aim = new THREE.Vector3(1, 1, 0);
            let axis = new THREE.Vector3(0 , 0 , 1);
            for (let i = 0; i < 4; i++) {
                let shot = new Projectile(this.position, aim.clone().applyAxisAngle(axis, i * 0.5 * Math.PI), false, 0xff0000);
                if (this.parent != null) {
                    projectiles.push(shot);
                    this.parent.add(shot.mesh);
                }
            }
        }
        else if (this.wave2) {
            let shot = new Projectile(this.position, new THREE.Vector3(0, -1, 0), false, 0xff0000);
            if (this.parent != null) {
                projectiles.push(shot);
                this.parent.add(shot.mesh);
            }
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
        if (this.wave1) {
            if (Math.abs(this.position.y) + 0.05 >= Math.abs(this.futurePosition.y) && Math.abs(this.position.y) - 0.05 <= Math.abs(this.futurePosition.y)) {
                this.futurePosition.y = Math.random() * 6 - 1;
                let direction = this.futurePosition.clone().sub(this.position);
                direction.normalize().multiplyScalar(0.05);
                this.velocity = direction;
                
            }
            else {
                this.position.add(this.velocity);
            }
        }
        else {
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
}

export default Enemy;