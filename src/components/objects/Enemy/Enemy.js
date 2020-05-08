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

}

export default Enemy;