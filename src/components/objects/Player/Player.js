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


        // var cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        // var mat = new THREE.MeshPhongMaterial({color: 0xdeadbeef});
        // var cube = new THREE.Mesh(cubeGeo, mat);
        // this.parent = parent;
        // var cylGeo = new THREE.CylinderGeometry(0.2,0.2,0.4);
        // var cylinder = new THREE.Mesh(cylGeo, mat);
        // cylinder.position.set(0.4, 0, 0);
        // cylinder.rotateZ(Math.PI / 2);
        // this.add(cube, cylinder);

        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 100;

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
        if (this.health <= 0) {
            this.parent.remove(this);
            return true;
        }
        return false;
    }

    specialAttack(projectiles, scene) {
        let direction = new THREE.Vector3(1, 0, 1.12);
        let position = this.position.clone();
        let color = 0xdeadbeef;
        let axis = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < 10; i++) {
            let projectile = new Projectile(position, direction.applyAxisAngle(axis, 2 * Math.PI / 10 * i), true, color);
            projectile.damage = 2 * projectile.damage;
            projectiles.push(projectile);
            scene.add(projectile.mesh);
        }
    }

}

export default Player;