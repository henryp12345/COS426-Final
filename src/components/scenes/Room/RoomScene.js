import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends THREE.Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background to a nice color
        this.background = new THREE.Color(0x7ec0ee);
        
        // Initialize the texture loader
        const loader = new THREE.TextureLoader();

        // Add floor
        var floorGeo = new THREE.BoxGeometry(10, 12, 0.5);
        var floorMat = new THREE.MeshBasicMaterial({
            map: loader.load('textures/floor.jpg')
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.add(new THREE.Vector3(0, 0, 0.51));

        // Add walls
        var wallGeoSide = new THREE.BoxGeometry(0.5, 12, 10.0);
        var wallGeoFront = new THREE.BoxGeometry(12, 0.5, 10.0);

        var wallMat = new THREE.MeshBasicMaterial({
            map: loader.load('textures/wall.jpg')
        });
        var wallMatTransparent = new THREE.MeshPhongMaterial({
            color: 0x000000,
            opacity: 0,
            transparent: true
        });

        var leftWall = new THREE.Mesh(wallGeoSide, wallMat);
        leftWall.position.add(new THREE.Vector3(5, 0, 0));

        var rightWall = new THREE.Mesh(wallGeoSide, wallMat);
        rightWall.position.add(new THREE.Vector3(-5, 0, 0));

        var backWall = new THREE.Mesh(wallGeoFront, wallMatTransparent);
        backWall.position.add(new THREE.Vector3(0, -6, 0));

        var frontWall = new THREE.Mesh(wallGeoFront, wallMat);
        frontWall.position.add(new THREE.Vector3(0, 5.5, 0));

        this.add(floor);
        this.add(leftWall);
        this.add(rightWall);
        this.add(backWall);
        this.add(frontWall);
    }
}

export default SeedScene;