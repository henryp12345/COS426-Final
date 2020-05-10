import * as THREE from 'three';
// import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './model.obj';
import MAT from './materials.mtl'
import {Flower} from 'objects';
import Projectile from '../Projectiles/Projectile';

class Player extends THREE.Group {
    constructor(parent) {
        super();

        this.parent = parent;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 10;

        // Draws the health bar for the player
        this.healthBar = [];
        let fraction = 1 / this.health;
        let geo = new THREE.BoxGeometry(fraction, fraction, 0.2);
        let mat = new THREE.MeshBasicMaterial({color: 0x228b22});
        for (let i = 0; i < this.health; i++) {
            let currentCube = new THREE.Mesh(geo, mat);
            currentCube.position.set(5 - (fraction * i), -3, -4.5);
            this.healthBar.push(currentCube);
            this.parent.add(currentCube);
        }

        // Creates the indicator for the special attack
        let specialGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        let specialMat = new THREE.MeshBasicMaterial({color: 0x0000FF});
        this.indicator = new THREE.Mesh(specialGeo, specialMat);
        this.indicator.position.set(5, -3, -4.1);

        // This code presumably loads the wizard mesh
        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        this.name = 'wizard';
        mtlLoader.setResourcePath('src/components/objects/Player/');
        mtlLoader.load(MAT, (material) => {
            material.preload();
            loader.setMaterials(material).load(MODEL, (obj) => {
                this.add(obj);
            });
        });
        this.rotation.set(3 * Math.PI / 2, Math.PI, 0);
        this.scale.set(3, 3, 3);
        this.position.set(0, -3.5, -1.1);
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
        if (this.health <= 0 && this.parent != null) {
            this.parent.remove(this);
            return true;
        }
        return false;
    }

    specialAttack(projectiles, scene) {
        let direction = new THREE.Vector3(0.8, 1, 0);
        let position = this.position.clone();
        let color = 0xdeadbeef;
        let axis = new THREE.Vector3(0, 0, 1);
        for (let i = 0; i < 10; i++) {
            var projectile;
            if (i == 5 || i == 6) {
                projectile = new Projectile(position, direction.clone().applyAxisAngle(axis, 0.5 * Math.PI  * i / 11), true, 0x228b22);
            } else {
                projectile = new Projectile(position, direction.clone().applyAxisAngle(axis, 0.5 * Math.PI  * i / 11), false, 0x228b22);
            }
            console.log(direction.clone().applyAxisAngle(axis, 0.5 * Math.PI  * i / 10));
            projectile.damage = 2 * projectile.damage;
            projectiles.push(projectile);
            scene.add(projectile.mesh);
            if (projectile.light != null) {
                scene.add(projectile.light);
            }
        }
        this.parent.remove(this.indicator);
    }

}

export default Player;