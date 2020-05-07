import * as Dat from 'dat.gui';
import { Scene, Color, BoxGeometry, MeshPhongMaterial, Mesh, Vector3, AmbientLight, PointLight } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

class CubeScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Adds lights to the scene
        var ambient = new AmbientLight(0x404040);
        var point = new PointLight(0x404040, 2, 0, 2);
        point.position.set(0, 0, -1);
        ambient.name = 'light';
        point.name = 'light';
        point.castShadow = true;
        this.add(ambient, point);

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        var geo = new BoxGeometry(1, 1, 0);
        var mat = new MeshPhongMaterial({color: 0x00ff00});
        var cube = new Mesh(geo, mat);
        cube.position.set(-1.0, 0, 0);
        this.add(cube);

    }
}

export default CubeScene;