import * as Dat from 'dat.gui';
import { Scene, Color, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

class CubeScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();


        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        var geo = new BoxGeometry(1, 1, 0);
        var mat = new MeshBasicMaterial({color: 0x00ff00});
        var cube = new Mesh(geo, mat);
        cube.position.set(-1.0, 0, 0);
        this.add(cube);

    }
}

export default CubeScene;