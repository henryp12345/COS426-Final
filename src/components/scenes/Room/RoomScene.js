import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import wood from './wood.jpg';
import wall from './wall.jpg';

class SeedScene extends THREE.Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background to a nice color
        this.background = new THREE.Color(0x7ec0ee);
        
        // Initialize the texture loader
        const loader = new THREE.TextureLoader();

        // Add floor
        var floorGeo = new THREE.BoxGeometry(20, 24, 0.5);
        var floorMat = new THREE.MeshPhongMaterial({
            map: loader.load(wood)
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.add(new THREE.Vector3(0, 0, 1));

        // Add walls
        var wallGeoSide = new THREE.BoxGeometry(0.5, 24, 10.0);
        var wallGeoFront = new THREE.BoxGeometry(24, 0.5, 10.0);

        var wallMat = new THREE.MeshPhongMaterial({
            map: loader.load(wall)
        });
        var wallMatTransparent = new THREE.MeshPhongMaterial({
            color: 0x000000,
            opacity: 0,
            transparent: true
        });

        var leftWall = new THREE.Mesh(wallGeoSide, wallMat);
        leftWall.position.add(new THREE.Vector3(10, 0, 0));

        var rightWall = new THREE.Mesh(wallGeoSide, wallMat);
        rightWall.position.add(new THREE.Vector3(-10, 0, 0));

        var backWall = new THREE.Mesh(wallGeoFront, wallMatTransparent);
        backWall.position.add(new THREE.Vector3(0, -6, 0));

        var frontWall = new THREE.Mesh(wallGeoFront, wallMat);
        frontWall.position.add(new THREE.Vector3(0, 11, 0));

        // Lights
        var ambient = new THREE.AmbientLight(0x404040);
        ambient.name = 'light';
        var leftBack = new THREE.PointLight(0x404040, 0.5, 0, 2);
        leftBack.position.set(4.0, 4.0, -2);
        leftBack.name = 'light';
        var leftFront = new THREE.PointLight(0x404040, 0.5, 0, 2);
        leftFront.position.set(4.0, -4.0, -2);
        leftFront.name = 'light';
        var rightBack = new THREE.PointLight(0x404040, 0.5, 0, 2);
        rightBack.position.set(-4.0, -4.0, -2);
        rightBack.name = 'light';
        var rightFront = new THREE.PointLight(0x404040, 0.5, 0, 2);
        rightFront.position.set(-4.0, 4.0, -2);
        rightFront.name = 'light';

        this.add( ambient, leftBack, rightBack, leftFront, rightFront);

        this.add(floor);
        this.add(leftWall);
        this.add(rightWall);
        this.add(backWall);
        this.add(frontWall);
    }
}

export default SeedScene;
