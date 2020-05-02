import * as Dat from 'dat.gui';
import { Scene, Color, BoxGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();


        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        var geo = new BoxGeometry();
        var mat = new MeshBasicMaterial({color: 0x00ff00});
        var cube = new Mesh(geo, mat);
        // this.add(cube);
        var cube2 = new Mesh(geo, mat);
        cube2.position.add(new Vector3(-1.0, 0, 0));
        this.add(cube2);

    }

    // addToUpdateList(object) {
    //     this.state.updateList.push(object);
    // }

    // update(timeStamp) {
    //     const { rotationSpeed, updateList } = this.state;
    //     this.rotation.y = (rotationSpeed * timeStamp) / 10000;

    //     // Call update for each object in the updateList
    //     for (const obj of updateList) {
    //         obj.update(timeStamp);
    //     }
    // }
}

export default SeedScene;





// import * as Dat from 'dat.gui';
// import { Scene, Color, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
// import { Flower, Land } from 'objects';
// import { BasicLights } from 'lights';

// class CubeScene extends Scene {
//     constructor() {
//         // Call parent Scene() constructor
//         super();

//         // Init state
//         this.state = {
//             // gui: new Dat.GUI(), // Create GUI for scen
//         };

//         // Set background to a nice color
//         this.background = new Color(0x7ec0ee);

//         // Add meshes to scene
//         var geo = new BoxGeometry();
//         var mat = new MeshBasicMaterial({color: 0x00ff00});
//         var cube = new Mesh(geo, mat);
//         this.add(cube);

//         // Populate GUI
//         // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
//     }

//     // addToUpdateList(object) {
//     //     this.state.updateList.push(object);
//     // }

//     // update(timeStamp) {
//     //     const { rotationSpeed, updateList } = this.state;
//     //     this.rotation.y = (rotationSpeed * timeStamp) / 10000;

//     //     // Call update for each object in the updateList
//     //     for (const obj of updateList) {
//     //         obj.update(timeStamp);
//     //     }
//     // }
// }

// export default CubeScene;
