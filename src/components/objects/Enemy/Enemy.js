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
        var cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        var mat = new THREE.MeshPhongMaterial({color: 0xdeadbeef});
        var cube = new THREE.Mesh(cubeGeo, mat);
        cube.position.set(-0.4, 0, 0)
        var cylGeo = new THREE.CylinderGeometry(0.2,0.2,0.4);
        var cylinder = new THREE.Mesh(cylGeo, mat);
        cylinder.position.set(0, 0, 0);
        cylinder.rotateZ(Math.PI / 2);
        this.add(cube, cylinder);
        this.boss = boss;
        this.direction = new THREE.Vector3(0, 1, 0);
        this.health = 10;
        var attack;
        this.position.set(0, 3, 0);
        this.name = 'enemy'
        // boss attack patterns
        if (this.boss) {
            
        }
        

        // This code presumably loads the wizard mesh
        // const loader = new OBJLoader();
        // const mtlLoader = new MTLLoader();
        // this.name = 'wizard';
        // mtlLoader.setResourcePath('src/components/objects/Player/');
        // mtlLoader.load(MAT, (material) => {
        //     material.preload();
        //     loader.setMaterials(material).load(MODEL, (obj) => {
        //         this.add(obj);
        //     });
        // });
        // console.log(parent);
        // parent.addToUpdateList(this);
    }

    computeBoundingBox() {
        this.boundingBox = new THREE.Box3().setFromObject(this);
    }
    
    reduceHealth(damageValue) {
        this.health -= damageValue;
        if (this.health <= 0) {
            console.log(this);
            if (this.parent != null)
                this.parent.remove(this);
            return true;
        }
        return false;
    }

    attack(projectiles, player) {
        let shot = new Projectile(this.position, new THREE.Vector3(0, -1, 0));
        projectiles.push(shot);
        this.parent.add(shot.mesh);
    }

}

export default Enemy;