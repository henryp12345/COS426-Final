/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, BoxGeometry, Mesh, MeshBasicMaterial, Box3, Plane, Raycaster,
		Vector2, SphereGeometry, BoxHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, CubeScene, RoomScene } from 'scenes';
import Player from './components/objects/Player/Player';
import Projectile from './components/objects/Projectiles/Projectile';
import Enemy from './components/objects/Enemy/Enemy';

// Initialize core ThreeJS components
// const scene = new SeedScene();
const scene = new CubeScene();
// const scene = new RoomScene();
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
controls.enableRotate = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Variables for keyboard controls
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

// Sets up the variables for mouse controls
var plane = new Plane(new Vector3(0, 0, 1), 0);
var raycaster = new Raycaster();
var intersection = new Vector3();
var mouseX;
var mouseY;

// Sets up the player object
var EPS = 0.1
var geo = new BoxGeometry(0.5, 0.5, 0.5);
var mat = new MeshBasicMaterial({color: 0xdeadbeef});
var player = new Player(scene); 
player.computeBoundingBox();
scene.add(player);

// Sets up the Main Enemy
var boss = new Enemy(scene);
boss.computeBoundingBox();
scene.add(boss);

// Enemies array;
var enemies = [];
enemies.push(boss)

// let boxHelper = new BoxHelper(scene.children[0]);
// let boxHelper = new BoxHelper();
// boxHelper.setFromObject(scene.children[0]);
// scene.add(boxHelper);

// Projectile array;
var friendlyProjectiles = [];
var enemyProjectiles = [];
var toRemove = [];


const detectWallCollisions = (dir) => {
	let noCollisions = true;
    for (let i = 0; i < scene.children.length; i++) {
		if (scene.children[i] === player || scene.children[i].name == 'projectile') {
			continue;
		}
		let sceneBox;
		player.computeBoundingBox();
		if (scene.children[i] === boss) {
			boss.computeBoundingBox();
			sceneBox = boss.boundingBox;
		}
		else {
			scene.children[i].geometry.computeBoundingBox();
			sceneBox = new Box3().setFromObject(scene.children[i]);
		}
    	

		
		let playerBox = player.boundingBox.clone();
		if (dir == 'left') {
			playerBox.max.add(new Vector3(0.1, 0, 0));
		} else if (dir == 'right') {
			playerBox.min.add(new Vector3(-0.1, 0, 0));
		} else if (dir ==  'up') {
			playerBox.max.add(new Vector3(0, 0.1, 0));
		} else if (dir == 'down') {
			playerBox.min.add(new Vector3(0, -0.1, 0));
		}

		if (sceneBox.intersectsBox(playerBox)) {
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

    // Updates friendly projectiles and removes the ones that have collided with walls or the boss
	let temp = [];
	let tempEnemies = [];
	let death;
	for (let i = 0; i < friendlyProjectiles.length; i++) {
		friendlyProjectiles[i].updatePosition();
		for (let j = 0; j < enemies.length; j++) {
			death = friendlyProjectiles[i].checkEnemyCollision(scene, enemies[i]);
			if (death) {
				enemies.splice(i, 1);
				break;
			}
		}
		toRemove.push(death);
		if (death) {
			continue;
		}
		toRemove[i] = friendlyProjectiles[i].checkWallCollision(scene, player);
	}
	for (let i = 0; i < toRemove.length; i++) {
		if (!toRemove[i]) {
			temp.push(friendlyProjectiles[i]);
		}
	}
	friendlyProjectiles = temp;
	toRemove = [];

	temp = [];
	for (let i = 0; i < enemyProjectiles.length; i++) {
		enemyProjectiles[i].updatePosition();
		toRemove.push(enemyProjectiles[i].checkPlayerCollision(player));
		toRemove[i] = enemyProjectiles[i].checkWallCollision(scene, player);
	}
	for (let i = 0; i < toRemove.length; i++) {
		if (!toRemove[i]) {
			temp.push(enemyProjectiles[i]);
		}
	}
	enemyProjectiles = temp;
	toRemove = [];

    var minPoint;
    var maxPoint;
	var noCollisions = true;
    if (leftPressed) {
		noCollisions = detectWallCollisions('left');
		if (noCollisions) {
			player.translateX(0.1);
		}
    }
    if (rightPressed) {
    	noCollisions = detectWallCollisions('right');
		if (noCollisions) {
			player.translateX(-0.1);
		}
    }
    if (upPressed) {
    	noCollisions = detectWallCollisions('up');
    	if (noCollisions) {
    		player.translateY(0.1);
    	}
    }
    if (downPressed) {
    	noCollisions = detectWallCollisions('down');
    	if (noCollisions) {
    		player.translateY(-0.1);
    	}
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

const mousemoveHandler = (event) => {
	// mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
	// mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// raycaster.setFromCamera(new Vector2(mouseX, mouseY), camera);
	// raycaster.ray.intersectPlane(plane, intersection);

	// let xDiff = player.direction.x - intersection.x;
	// let yDiff = player.direction.y - intersection.y;
	// let angle = Math.atan(yDiff, xDiff);
	// let newDir = new Vector3(intersection.x, intersection.y, 0);
	// let angle = direction.angleTo(newDir);

	// let temp = direction.multiplyScalar(-1);
	// let angle2 = direction.angleTo(newDir);

	// player.rotateZ(angle);
	// player.mesh.lookAt(intersection);
	// player.direction =  new Vector3(intersection.x, intersection.y, 0);
}

const mousedownHandler = (event) => {
	mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera(new Vector2(mouseX, mouseY), camera);
	raycaster.ray.intersectPlane(plane, intersection);

	let mousePos = new Vector3(intersection.x, intersection.y);

	let position = player.position.clone();
	var projectile = new Projectile(position, mousePos.sub(position));
	friendlyProjectiles.push(projectile);
	scene.add(projectile.mesh);
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
