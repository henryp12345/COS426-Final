/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, BoxGeometry, Mesh, MeshBasicMaterial, Box3, Plane, Raycaster,
		Vector2, SphereGeometry, CanvasTexture } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene, CubeScene, RoomScene } from 'scenes';
import Player from './components/objects/Player/Player';
import Projectile from './components/objects/Projectiles/Projectile';
import Enemy from './components/objects/Enemy/Enemy';


var div = document.createElement("DIV");
document.body.style.overflow = 'hidden';
document.body.style.margin = 0;
document.body.appendChild(div);

// Changing div style
div.style.backgroundImage = "linear-gradient(to bottom right, red, green, blue)";
div.style.display = 'block';

div.style.width = window.innerWidth + "px";
div.style.height = window.innerHeight + "px";

div.innerText = "Red Green Bullets"
div.style.fontFamily = "Verdana";
div.style.textAlign = "center";
div.style.fontSize = "40px";

// Adds a line break after the title
var newLine = document.createElement("br");
div.appendChild(newLine);

// Creates the instructions
var instructions = document.createElement("DIV");
instructions.style.fontFamily = "verdana";
instructions.style.fontSize = "20px";
instructions.style.position = "relative";
instructions.style.top = "75px";
instructions.innerText = "Dodge the red bullets and defeat all enemies to win\n" + 
						 "Use WASD to move your character\n" + 
						 "Left click to shoot\n" + 
						 "When the blue cube appears press the spacebar to unleash your special attack";

div.appendChild(instructions);

// Adds a line break after the instructions
div.appendChild(newLine);

// Creates the start button and adds it to the screen
var startButton = document.createElement("BUTTON");
startButton.innerText = "Start Game";
startButton.style.fontFamily = "verdana";
startButton.style.fontSize = "20px";
startButton.style.position = "relative";
startButton.style.top = "250px";
startButton.style.width = "200px";
startButton.style.height = "100px";
startButton.style.borderRadius = "12px";
startButton.style.backgroundColor = "mediumseagreen";
div.appendChild(startButton);
startButton.onclick = function() {
	// Removes the div element so the canvas can show up
	div.parentNode.removeChild(div);

	// Initialize core ThreeJS components
	// const scene = new SeedScene();
	// const scene = new CubeScene();
	const scene = new RoomScene();
	const camera = new PerspectiveCamera();
	const renderer = new WebGLRenderer({ antialias: true });

	// Set up camera
	camera.position.set(0, -10, -5);

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
	controls.enableZoom = false;
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
	var isLoss = true;
	var end = false;

	// Sets up the player object
	var EPS = 0.1;
	var player = new Player(scene); 
	player.computeBoundingBox();
	scene.add(player);

	// Sets up the Main Enemy
	var boss = new Enemy(scene, true);
	boss.computeBoundingBox();
	scene.add(boss);

	// Enemies array;
	var enemies = [];
	enemies.push(boss)

	// Frame counter for projectile spacing
	var frame = 0;
	// Frame counter for special attack
	var special = 0;
	// Projectile array;
	var friendlyProjectiles = [];
	var enemyProjectiles = [];
	var toKeep = [];


	const endGame = (isLoss) => {
		// Removes all event handlers
		window.removeEventListener("keydown", keydownHandler);
		window.removeEventListener("keyup", keyupHandler);
		window.removeEventListener("mousedown", mousedownHandler);

		// Removes all objects from the scene
		while(scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}

		// Removes the canvas from the page
		canvas.parentNode.removeChild(canvas);


		// Creates a new div element and styles it appropriately
		var div = document.createElement("DIV");

		// Borders
		div.style.width = "300px";
		div.style.height = "200px";

		// Text styling
		div.style.textAlign = "center";
		div.style.fontFamily = "verdana";
		div.style.fontWeight = "bold";
		div.style.fontSize = "30px";

		// Position on screen
		div.style.top = "50%";
		div.style.left = "35%";
		div.style.position = "absolute";

		// Creates the instructions
		var instructions = document.createElement("P");
		instructions.innerText = "hi";

		// Creates a button to reset the game
		var button = document.createElement("BUTTON");

		// Text and functionality
		button.innerText = "Main menu";
		button.onclick = function() {location.reload()};

		// Alignment ant styling
		button.style.textAlign = "center";
		button.style.fontFamily = "verdana"
		button.style.fontSize = "20px";
		button.style.position = "absolute";
		button.style.top = "90%";
		button.style.left = "41%";
		button.style.width = "150px";
		button.style.height = "50px";
		button.style.borderRadius = "12px";

		// Adds the elements to the window
		document.body.appendChild(div);
		document.body.appendChild(button);

		// Puts the correct text in the element based on the player winning or losing
		if (isLoss) {
			div.innerText = "You Lost";
			button.style.backgroundColor = "orangered";
			document.body.style.backgroundColor = "red";
		} else {
			div.innerText = "You Win!";
			button.style.backgroundColor = "mediumseagreen";
			document.body.style.backgroundColor = "green";
		}
	}

	const detectWallCollisions = (dir) => {
		let noCollisions = true;
	    for (let i = 0; i < scene.children.length; i++) {
	    	// Skips over the children in the scene that are the player, other projectiles, or lights
			if (scene.children[i] === player || scene.children[i].name == 'projectile' || scene.children[i].name == 'light') {
				continue;
			}
			// Computes the bounding box of the object to check collisions with
			var sceneBox;
			player.computeBoundingBox();
			if (scene.children[i] === boss) {
				boss.computeBoundingBox();
				sceneBox = boss.boundingBox;
			}
			else {
				scene.children[i].geometry.computeBoundingBox();
				sceneBox = new Box3().setFromObject(scene.children[i]);
			}
	    	
			// Adds a small offset to the bounding box of the player for better collision detection
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
		frame++;
		if (special < 500) {
			special++;
		} else if (special == 500){
			scene.add(player.indicator);
			// console.log("here");
		}

		// update enemy position
		// enemies attack
		for (let i = 0; i < enemies.length; i++) {
			enemies[i].move();
			// limiting rate of fire
			if (frame % 45 == 0) {

			}
			if (enemies[i].isBoss) {
				if ((frame - 15) % 45 == 0) {
					enemies[i].bossAimedAttack(enemyProjectiles, player);
				}
				if (frame % 45 == 0) {
					enemies[i].bossSprayAttack(enemyProjectiles, player);
				}
				if (frame % 400 == 0) {
					enemies[i].bossSpecialAttack(enemyProjectiles, player);
				}

			}
			if (frame > 150000) {
				frame = 0;
			}
		}

	    // Updates friendly projectiles and removes the ones that have collided with walls or the boss
		let temp = [];
		let death;
		for (let i = 0; i < friendlyProjectiles.length; i++) {
			let enemyHit = false;
			// move projectile
			friendlyProjectiles[i].updatePosition();
			// check for enemies hit/killed
			for (let j = 0; j < enemies.length; j++) {
				death = friendlyProjectiles[i].checkEnemyCollision(scene, enemies[j]);
				if (death[1]) {
					// If boss is dead, end the game
					if (enemies[j].isBoss) {
						endGame(false);
					}
					// if enemy died, remove it from the enemies array
					enemies.splice(i, 1);
					enemyHit = true;
					break;
				} else if (death[0]) {
					enemyHit = true;
					break;
				}
			}
			if (!friendlyProjectiles[i].checkWallCollision(scene, player) && !enemyHit) {
				toKeep.push(i);
			}
		}
		// Removes projectiles that collided with something
		for (let i = 0; i < toKeep.length; i++) {
			temp.push(friendlyProjectiles[toKeep[i]]);
		}
		friendlyProjectiles = temp;
		toKeep = [];

		// Updates enemy projectiles and removes the ones that have collided with walls or the player
		temp = [];
		for (let i = 0; i < enemyProjectiles.length; i++) {
			enemyProjectiles[i].updatePosition();
			death = enemyProjectiles[i].checkPlayerCollision(scene, player);
			if (death[1]) {
				// If the player died, end the game
				endGame(true);
			}
			else if (death[0]) {
				continue;
			} else if (!enemyProjectiles[i].checkWallCollision(scene, player)) {
				toKeep.push(i);
			}
		}
		for (let i = 0; i < toKeep.length; i++) {
			temp.push(enemyProjectiles[toKeep[i]]);
		}
		enemyProjectiles = temp;
		toKeep = [];

	    var minPoint;
	    var maxPoint;
		var noCollisions = true;
	    if (leftPressed) {
			noCollisions = detectWallCollisions('left');
			if (noCollisions) {
				player.translateX(-0.1);
			}
	    }
	    if (rightPressed) {
	    	noCollisions = detectWallCollisions('right');
			if (noCollisions) {
				player.translateX(0.1);
			}
	    }
	    if (upPressed) {
	    	noCollisions = detectWallCollisions('up');
	    	if (noCollisions) {
	    		player.translateZ(-0.1);
	    	}
	    }
	    if (downPressed) {
	    	noCollisions = detectWallCollisions('down');
	    	if (noCollisions) {
	    		player.translateZ(0.1);
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


	const mousedownHandler = (event) => {
		mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera(new Vector2(mouseX, mouseY), camera);
		raycaster.ray.intersectPlane(plane, intersection);

		let mousePos = new Vector3(intersection.x, intersection.y);

		let position = player.position.clone();
		var projectile = new Projectile(position, mousePos.sub(position), false, 0x228b22);
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
		if (event.key == " " && special == 500) {
			player.specialAttack(friendlyProjectiles, scene);
			special = 0;
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
};
