import { Mesh, SphereGeometry, MeshBasicMaterial, Vector3 } from "three";

class Projectile {
    contructor() {
        var geo = new SphereGeometry(1, 8, 6);
        var mat = new MeshBasicMaterial({color: 0xdeadbeef});
        var mesh = new Mesh(geo, mat);
        this.mesh = mesh;
        var velocity = new Vector3(1, 0, 0);
        this.velocity = velocity;
    }
}
export default Projectile;