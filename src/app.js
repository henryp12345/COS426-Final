/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

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
var upPressed = true;
var downPressed = true;

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    if (leftPressed) {
    	scene.position.add(new Vector3(0.1, 0, 0));
    }
    if (rightPressed) {
    	scene.position.add(new Vector3(-0.1, 0, 0));
    }
    if (upPressed) {
    	scene.position.add(new Vector3(0, 0.1, 0));
    }
    if (downPressed) {
    	scene.position.add(new Vector3(0, -0.1, 0));
    }
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

// Moves whole scene
const moveObject = (event) => {
	// console.log(scene);
	if (event.key == "ArrowDown") {
		downPressed = true;
	}
	if (event.key == "ArrowUp") {
		upPressed = true;
	}
	if (event.key == "ArrowRight") {
		rightPressed = true;
	}
	if (event.key == "ArrowLeft") {
		leftPressed = true;
	}
};
const keyupHandler = (event) => {
	if (event.key == "ArrowDown") {
		downPressed = false;
	}
	if (event.key == "ArrowUp") {
		upPressed = false;
	}
	if (event.key == "ArrowRight") {
		rightPressed = false;
	}
	if (event.key == "ArrowLeft") {
		leftPressed = false;
	}
};
window.addEventListener('keydown', moveObject, false);
window.addEventListener('keyup', keyupHandler, false);
