import * as THREE from 'three';
// import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './model.obj';
import MAT from './materials.mtl'
import {Flower} from 'objects';

class Player extends THREE.Group {
    constructor(parent) {
        super();

        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 10;

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
        this.health -= damageValue;
        if (this.health <= 0 && this.parent != null) {
            this.parent.remove(this);
            return true;
        }
        return false;
    }

}

export default Player;