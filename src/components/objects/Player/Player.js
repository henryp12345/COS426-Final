import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './model.obj';
import MAT from './materials.mtl'
import {Flower} from 'objects';

class Player extends THREE.Group{
    constructor(parent) {
        super();

        // Load object
        var cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        var mat = new THREE.MeshBasicMaterial({color: 0xdeadbeef});
        var cube = new THREE.Mesh(cubeGeo, mat);
        // cube.position.add(new THREE.Vector3(0.5, 0, 0));
        // cube.translateX(0.5);

        var cylGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
        var cylinder = new THREE.Mesh(cylGeo, mat);
        cylinder.position.add(new THREE.Vector3(1.0, 0, 0));
        cylinder.rotateZ(Math.PI / 2);
        this.add(cube);
        this.computeBoundingBox();
        // const loader = new OBJLoader();
        // const mtlLoader = new MTLLoader();
        // this.name = 'wizard';
        // mtlLoader.setResourcePath('src/components/objects/Wizard/');
        // mtlLoader.load(MAT, (material) => {
        //     material.preload();
        //     loader.setMaterials(material).load(MODEL, (obj) => {
        //         this.add(obj);
        //     });
        // });

        // parent.addToUpdateList(this);
    }

    computeBoundingBox() {
        // this.boundingBox = new THREE.Box3().setFromObject(this);
        let children = this.children;
        let boundingBoxes = [];
        // Stores all the child bounding boxes in an array
        for (let i = 0; i < children.length; i++) {
            children[i].geometry.computeBoundingBox();
            boundingBoxes.push(children[i].geometry.boundingBox);
        }
        
        // Computes the bounding box containing all the bounding boxes
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let minZ = Number.MAX_VALUE;

        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        let maxZ = Number.MIN_VALUE;
        for (let i = 0; i < boundingBoxes.length; i++) {
            // let currentMin = this.localToWorld(boundingBoxes[i].min.clone());
            // let currentMax = this.localToWorld(boundingBoxes[i].max.clone());
            let currentMin = boundingBoxes[i].min.clone();
            let currentMax = boundingBoxes[i].max.clone();

            // Computes the global min
            if (currentMin.x < minX) {
                minX = currentMin.x;
            }
            if (currentMin.y < minY) {
                minY = currentMin.y;
            }
            if (currentMin.z < minZ) {
                minZ = currentMin.z;
            }

            // Computes the global max
            if (currentMax.x > maxX) {
                maxX = currentMax.x;
            }
            if (currentMax.y > maxY) {
                maxY = currentMax.y;
            }
            if (currentMax.z > maxZ) {
                maxZ = currentMax.z;
            }
        }
        let minVec = new THREE.Vector3(minX, minY, minZ);
        let maxVec = new THREE.Vector3(maxX, maxY, maxZ);
        this.boundingBox = new THREE.Box3(minVec, maxVec); 
    }
    

}

export default Player;