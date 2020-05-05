/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, BoxGeometry, Mesh, MeshBasicMaterial, Box3, Plane, Raycaster,
		Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, CubeScene, RoomScene } from 'scenes';
import Player from './components/objects/Player/Player';

// Initialize core ThreeJS components
// const scene = new SeedScene();
// const scene = new CubeScene();
const scene = new RoomScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, -10, -5);
// camera.position.set(0, 0, -10);
// camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Variables for keyboard controls
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

// Sets up the mouse position variables
var mouseX;
var mouseY;

// Sets up the player object
var EPS = 0.1
var geo = new BoxGeometry(0.5, 0.5, 0.5);
var mat = new MeshBasicMaterial({color: 0xdeadbeef});
// var player = new Mesh(geo, mat);
var player = new Player(); 
// player.geometry.computeBoundingBox();
scene.add(player.sprite);

// Add this to player class later
var direction = new Vector3(0, 1, 0);

const detectWallCollisions = (minPoint, maxPoint) => {
	let noCollisions = true;
    for (let i = 0; i < scene.children.length; i++) {
		if (scene.children[i] === player) {
			continue;
		}
		// player.geometry.computeBoundingBox();
		player.computeBoundingBox();
    	scene.children[i].geometry.computeBoundingBox();
		let minW = scene.children[i].localToWorld(scene.children[i].geometry.boundingBox.min.clone());
		let maxW = scene.children[i].localToWorld(scene.children[i].geometry.boundingBox.max.clone());
		let boxW = new Box3(minW, maxW);
		if (boxW.containsPoint(minPoint) || boxW.containsPoint(maxPoint)) {
			noCollisions = false;
		}
	}
	return noCollisions;
}
// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);

    var minPoint;
    var maxPoint;
    var noCollisions = true;
    // var max = player.localToWorld(player.geometry.boundingBox.max.clone());
	// var min = player.localToWorld(player.geometry.boundingBox.min.clone());
	var max = player.sprite.localToWorld(player.boundingBox.max.clone());
    var min = player.sprite.localToWorld(player.boundingBox.min.clone());
    if (leftPressed) {
    	minPoint = new Vector3(max.x + 0.1, min.y, max.z);
    	maxPoint = new Vector3(max.x + 0.1, max.y, max.z);
		noCollisions = detectWallCollisions(minPoint, maxPoint);
		if (noCollisions) {
	    	player.translateX(0.1);
		}
    }
    if (rightPressed) {
    	minPoint = new Vector3(min.x - 0.1, min.y, max.z);
    	maxPoint = new Vector3(min.x - 0.1, max.y, max.z);
    	noCollisions = detectWallCollisions(minPoint, maxPoint);
		if (noCollisions) {
	    	player.translateX(-0.1);
		}
    }
    if (upPressed) {
    	minPoint = new Vector3(min.x, max.y + 0.1, max.z);
    	maxPoint = new Vector3(max.x, max.y + 0.1, max.z);
    	noCollisions = detectWallCollisions(minPoint, maxPoint);
    	if (noCollisions) {
    		player.translateY(0.1);
    	}
    }
    if (downPressed) {
    	minPoint = new Vector3(min.x, min.y - 0.1, max.z);
    	maxPoint = new Vector3(max.x, min.y - 0.1, max.z);
    	noCollisions = detectWallCollisions(minPoint, maxPoint);
    	if (noCollisions) {
    		player.translateY(-0.1);
    	}
    }
    // let temp = player.position.clone().sub(new Vector3(0, 10, 5));
    // camera.position.set(temp.x, temp.y, temp.z);
    // camera.lookAt(player.position.clone());
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

const mousemoveHandler = (event) => {
	// var plane = new Plane(new Vector3(0, 0, 1), 0);
	// var raycaster = new Raycaster();
	// var intersection = new Vector3();

	// mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
	// mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// raycaster.setFromCamera(new Vector2(mouseX, mouseY), camera);
	// raycaster.ray.intersectPlane(plane, intersection);

	// // player.position.x = intersection.x;
	// // player.position.y = intersection.y;
	// let newDir = new Vector3(intersection.x, intersection.y, -1000);
	// let angle = direction.angleTo(newDir);

	// let temp = direction.multiplyScalar(-1);
	// let angle2 = direction.angleTo(newDir);

	// // player.rotateZ(angle);
	// player.lookAt(newDir);
	// direction =  newDir;
}

const mousedownHandler = (event) => {
	// player.position.y = mouseY;
	// console.log(mouseX, mouseY, player.position);
	// console.log(player.worldToLocal(new Vector3(mouseX, mouseY, 0)));
	// player.position.x = -mouseX;
	// player.rotateZ(Math.PI / 4);
	// player.lookAt(new Vector3(0, 1, 0));
}

// Moves whole scene
const keydownHandler = (event) => {
	if (event.key == "s") {
		downPressed = true;
	}
	if (event.key == "w") {
		upPressed = true;
	}
	if (event.key == "d") {
		rightPressed = true;
	}
	if (event.key == "a") {
		leftPressed = true;
	}
};
const keyupHandler = (event) => {
	if (event.key == "s") {
		downPressed = false;
	}
	if (event.key == "w") {
		upPressed = false;
	}
	if (event.key == "d") {
		rightPressed = false;
	}
	if (event.key == "a") {
		leftPressed = false;
	}
};
window.addEventListener('keydown', keydownHandler, false);
window.addEventListener('keyup', keyupHandler, false);
window.addEventListener('mousedown', mousedownHandler, false);
window.addEventListener('mousemove', mousemoveHandler, false);
