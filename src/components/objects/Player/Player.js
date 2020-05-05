import { Group, Sprite, SpriteMaterial, TextureLoader, Vector3, Vector2 } from 'three';

class Player {
    constructor() {
        var spriteMap = new TextureLoader().load( "textures/Sprites/Wizard.png" );
        var spriteMaterial = new SpriteMaterial( { map: spriteMap } );
        var sprite = new Sprite( spriteMaterial );
        this.sprite = sprite;
        var scale = 1;
        sprite.scale.set(scale, scale, 1);
        var boundingBox = {min: new Vector3(0, 0, 0), max: new Vector3(0, 0, 0)};
        this.boundingBox = boundingBox;
        this.computeBoundingBox();
    }

    computeBoundingBox(boundingBox) {
        var centerX = this.sprite.center.x;
        var centerY = this.sprite.center.y;
        var centerZ = this.sprite.center.z;
        this.boundingBox.min.x = centerX - this.scale / 2;
        this.boundingBox.min.y = centerY - this.scale / 2;
        this.boundingBox.min.z = centerZ;
        this.boundingBox.max.x = centerX + this.scale / 2;
        this.boundingBox.max.y = centerY + this.scale / 2;
        this.boundingBox.max.z = centerZ;
    }
}

export default Player;