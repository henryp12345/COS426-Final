import { Group, Sprite, SpriteMaterial, TextureLoader, Vector3, Vector2, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './flower.gltf';

class Player extends Group{
    constructor(parent) {
        super();
        this.items;

        // Load object
        const loader = new GLTFLoader();
        this.name = 'flower';
        loader.load(MODEL, (gltf) => {
        this.add(gltf.scene);
        });
        
    }

    computeBoundingBoxes() {
        let children = this.children();
        let boundingBoxes = [];
        for (i = 0; i < children.length; i++) {
            boundingBoxes.push(children[i].geometries)
        }
    }
    

}

export default Player;