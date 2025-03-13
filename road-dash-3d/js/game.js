import * as THREE from 'three';
import { keys } from './input.js';
import { setGameOver, getGameOver } from './main.js';
import { updateUI, updateScoreboard } from './ui.js';
import { createRoadSegment } from './environment.js';
import { 
    createBikeModel, 
    createAiBike, 
    createRandomStructure,
    createBillboard,
    createBigTree
} from './models.js';
import {
    segmentLength,
    roadWidth,
    sideWidth,
    forwardSegmentCount,
    backwardSegmentCount,
    trafficSpawnRate,
    healthPackSpawnRate,
    numAiBikes,
    aiNames,
    playerDefaults
} from './config.js';
import { 
    checkPlayerTrafficCollisions, 
    checkAiBikeCollisions, 
    checkTrafficCollisions, 
    checkEdgeOfRoadPenalty 
} from './collisions.js';
import { spawnTraffic, updateTraffic } from './traffic.js';
import { spawnHealthPack, updateHealthPacks } from './powerups.js';

// Game state
let scene, camera, renderer;
let animationId = null;
let roadSegments = [];
let traffic = [];
let trafficSpawnTimer = 0;
let healthPacks = [];
let healthPackSpawnTimer = 0;
let aiBikes = [];

// Player state
const player = {
    mesh: null,
    position: new THREE.Vector3(0, 0.5, 0),
    rotationY: 0,
    speed: 0,
    maxSpeed: playerDefaults.maxSpeed,
    accel: playerDefaults.accel,
    decel: playerDefaults.decel,
    steerSpeed: playerDefaults.steerSpeed,
    health: playerDefaults.health,
    distance: 0,
};

// Initialize the game
export function initGame(playerName) {
    // Determine if it's day or night based on real time
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;

    // Create scene
    scene = new THREE.Scene();
    
    if (isDay) {
        scene.background = new THREE.Color(0x88ccee);
        scene.fog = new THREE.Fog(0x88ccee, 10, 400);
    } else {
        scene.background = new THREE.Color(0x000022);
        scene.fog = new THREE.Fog(0x000022, 10, 200);
    }

    // Create sky dome
    const skyGeo = new THREE.SphereGeometry(800, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
        color: isDay ? 0x88ccee : 0x000022,
        side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 3, 12);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Add lighting
    const ambient = new THREE.AmbientLight(0xffffff, isDay ? 0.6 : 0.2);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, isDay ? 0.8 : 0.3);
    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    // Build road segments
    buildRoadSegments();

    // Create player's bike
    const bike = createBikeModel();
    scene.add(bike);
    player.mesh = bike;
    player.position.set(0, 0.5, 0);
    player.distance = 0;

    // Create AI bikes
    createAIBikes();

    // Initialize game variables
    restartGameVariables();

    // Add environment objects
    addEnvironmentObjects();

    // Start animation loop
    animate();
}

// Build initial road segments
function buildRoadSegments() {
    const middleSegment = createRoadSegment();
    middleSegment.position.z = 0;
    scene.add(middleSegment);
    roadSegments.push(middleSegment);

    let zPos = -segmentLength;
    for (let i = 0; i < forwardSegmentCount; i++) {
        const seg = createRoadSegment();
        seg.position.z = zPos;
        scene.add(seg);
        roadSegments.push(seg);
        zPos -= segmentLength;
    }

    zPos = segmentLength;
    for (let i = 0; i < backwardSegmentCount; i++) {
        const seg = createRoadSegment();
        seg.position.z = zPos;
        scene.add(seg);
        roadSegments.push(seg);
        zPos += segmentLength;
    }
}

// Add decorative objects to the environment
function addEnvironmentObjects() {
    // Add random structures
    for (let i = 0; i < 20; i++) {
        const deco = createRandomStructure();
        const side = Math.random() < 0.5 ? -1 : 1;
        const xPos = side * (roadWidth * 0.5 + sideWidth * 0.5 + Math.random() * 40);
        const zPos = (Math.random() - 0.5) * segmentLength * (forwardSegmentCount + backwardSegmentCount);
        deco.position.set(xPos, 0, zPos);
        scene.add(deco);
    }

    // Add billboards
    for (let i = 0; i < 8; i++) {
        const billboard = createBillboard();
        const side = Math.random() < 0.5 ? -1 : 1;
        const xPos = side * (roadWidth * 0.5 + sideWidth * 0.8 + Math.random() * 40);
        const zPos = (Math.random() - 0.5) * segmentLength * (forwardSegmentCount + backwardSegmentCount);
        billboard.position.set(xPos, 0, zPos);
        scene.add(billboard);
    }

    // Add big trees
    for (let i = 0; i < 10; i++) {
        const bigTree = createBigTree();
        const side = Math.random() < 0.5 ? -1 : 1;
        const xPos = side * (roadWidth * 0.5 + sideWidth + Math.random() * 20);
        const zPos = (Math.random() - 0.5) * segmentLength * (forwardSegmentCount + backwardSegmentCount);
        bigTree.position.set(xPos, 0, zPos);
        scene.add(bigTree);
    }
}

function handleResize() {
    if (!camera || !renderer) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

export function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer && document.getElementById('gameContainer').contains(renderer.domElement)) {
        document.getElementById('gameContainer').removeChild(renderer.domElement);
    }
    window.removeEventListener('resize', handleResize);
}

// Create AI bikes
function createAIBikes() {
    aiBikes = [];
    
    for (let i = 0; i < numAiBikes; i++) {
        const aiBikeMesh = createAiBike();
        scene.add(aiBikeMesh);
        aiBikeMesh.position.set((i+1)*1.5, 0.5, -(i*10));
        
        // Vary the AI bike capabilities to give player better chance
        const maxSpeedVariation = 0.9 + (Math.random() * 0.15); // 0.9-1.05 multiplier
        const accelVariation = 0.85 + (Math.random() * 0.25);   // 0.85-1.1 multiplier
        
        // Get a random name
        const aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
        
        aiBikes.push({
            mesh: aiBikeMesh,
            position: new THREE.Vector3((i+1)*1.5, 0.5, -(i*10)),
            rotationY: 0,
            speed: 0,
            maxSpeed: playerDefaults.maxSpeed * maxSpeedVariation,
            accel: playerDefaults.accel * accelVariation,
            decel: playerDefaults.decel,
            steerSpeed: playerDefaults.steerSpeed,
            health: playerDefaults.health,
            distance: 0,
            aggressiveness: Math.random(), // Used for collision behavior
            consistency: Math.random(),    // Used for random steering events
            name: aiName
        });
    }
}

// Reset game variables
export function restartGameVariables() {
    setGameOver(false);
    
    // Clear traffic
    traffic.forEach((v) => {
        scene.remove(v.mesh);
    });
    traffic = [];
    trafficSpawnTimer = 0;
    
    // Clear health packs
    healthPacks.forEach((hp) => {
        scene.remove(hp.mesh);
    });
    healthPacks = [];
    healthPackSpawnTimer = 0;
    
    // Reset player
    player.position.set(0, 0.5, 0);
    player.speed = 0;
    player.rotationY = 0;
    player.health = playerDefaults.health;
    player.distance = 0;
    
    updateUI(0, 0, playerDefaults.health);
    
    // Reset AI bikes
    aiBikes.forEach((ai) => {
        scene.remove(ai.mesh);
    });
    
    createAIBikes();
}

// Restart the game
export function restartGame() {
    restartGameVariables();
}

// Main game update loop
function updateGame() {
    if (getGameOver()) return;

    updatePlayer();
    updateAIBikes();
    updateCamera();
    updateRoadSegments();
    handleTraffic();
    handleHealthPacks();
    handleCollisions();
    updateGameUI();
}

function updatePlayer() {
    if (keys.ArrowUp) {
        player.speed += player.accel;
        if (player.speed > player.maxSpeed) player.speed = player.maxSpeed;
    } else if (keys.ArrowDown) {
        player.speed -= player.accel * 1.5;
        if (player.speed < -player.maxSpeed * 0.3) player.speed = -player.maxSpeed * 0.3;
    } else {
        if (player.speed > 0) {
            player.speed -= player.decel;
            if (player.speed < 0) player.speed = 0;
        } else if (player.speed < 0) {
            player.speed += player.decel;
            if (player.speed > 0) player.speed = 0;
        }
    }

    if (player.speed < -player.maxSpeed * 0.3) player.speed = -player.maxSpeed * 0.3;

    if (keys.ArrowLeft) {
        player.rotationY += player.steerSpeed;
    } else if (keys.ArrowRight) {
        player.rotationY -= player.steerSpeed;
    }

    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotationY);
    player.position.addScaledVector(dir, player.speed);

    if (player.position.x > roadWidth * 0.5) player.position.x = roadWidth * 0.5;
    else if (player.position.x < -roadWidth * 0.5) player.position.x = -roadWidth * 0.5;

    player.mesh.position.copy(player.position);
    player.mesh.rotation.set(0, -player.rotationY, 0);

    if (keys.ArrowLeft) {
        player.mesh.rotation.z = 0.1;
    } else if (keys.ArrowRight) {
        player.mesh.rotation.z = -0.1;
    } else {
        player.mesh.rotation.z = 0;
    }

    player.distance += player.speed;
}

function updateAIBikes() {
    aiBikes.forEach(ai => {
        if (ai.health <= 0) return;

        // Normal acceleration
        ai.speed += ai.accel;
        if (ai.speed > ai.maxSpeed) ai.speed = ai.maxSpeed;

        // Hamper if too far ahead
        const pDist = player.distance;
        if (ai.distance - pDist > 100) {
            // If AI is way ahead (100m+), severely hamper them
            ai.speed *= 0.85;
        } else if (ai.distance - pDist > 50) {
            // If AI is moderately ahead (50-100m), moderately hamper them
            ai.speed *= 0.92;
        } else if (ai.distance - pDist > 25) {
            // Even at shorter distances, apply some hampering
            ai.speed *= 0.97;
        }

        // Random steering for more human-like behavior
        if (Math.random() < 0.03) {
            const turnDir = Math.random() < 0.5 ? 1 : -1;
            ai.rotationY += turnDir * ai.steerSpeed * (0.5 + Math.random() * 0.5);
            
            // Occasional steering mistakes
            if (Math.random() < 0.2) {
                ai.rotationY += turnDir * ai.steerSpeed * 2;
                ai.speed *= 0.85; // Slow down during sharp turns
            }
        }

        // Movement
        const dir = new THREE.Vector3(0, 0, -1);
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), ai.rotationY);
        ai.position.addScaledVector(dir, ai.speed);

        if (ai.position.x > roadWidth * 0.5) ai.position.x = roadWidth * 0.5;
        else if (ai.position.x < -roadWidth * 0.5) ai.position.x = -roadWidth * 0.5;

        ai.mesh.position.copy(ai.position);
        ai.mesh.rotation.set(0, -ai.rotationY, 0);

        ai.distance += ai.speed;
    });
}

function updateCamera() {
    if (camera) {
        const camOffset = new THREE.Vector3(0, 4, 12);
        camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotationY);
        camera.position.copy(player.position.clone().add(camOffset));
        const lookAtPos = player.position.clone();
        lookAtPos.y += 1;
        camera.lookAt(lookAtPos);
    }
}

function updateRoadSegments() {
    const playerZ = player.position.z;

    // Find min and max segment positions
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let seg of roadSegments) {
        const z = seg.position.z;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    }

    // Add new segment if player goes beyond the minimum segment
    if (playerZ < minZ - segmentLength) {
        const seg = createRoadSegment();
        seg.position.z = minZ - segmentLength;
        roadSegments.push(seg);
        scene.add(seg);

        // Remove furthest segment in the opposite direction
        let maxZseg = null;
        let maxVal = -Infinity;
        for (let s of roadSegments) {
            if (s.position.z > maxVal) {
                maxZseg = s;
                maxVal = s.position.z;
            }
        }
        if (maxZseg) {
            scene.remove(maxZseg);
            const idx = roadSegments.indexOf(maxZseg);
            if (idx >= 0) roadSegments.splice(idx, 1);
        }
    }

    // Add new segment if player goes beyond the maximum segment
    if (playerZ > maxZ + segmentLength) {
        const seg = createRoadSegment();
        seg.position.z = maxZ + segmentLength;
        roadSegments.push(seg);
        scene.add(seg);

        // Remove furthest segment in the opposite direction
        let minZseg = null;
        let minVal = Infinity;
        for (let s of roadSegments) {
            if (s.position.z < minVal) {
                minVal = s.position.z;
                minZseg = s;
            }
        }
        if (minZseg) {
            scene.remove(minZseg);
            const idx = roadSegments.indexOf(minZseg);
            if (idx >= 0) roadSegments.splice(idx, 1);
        }
    }
}

function handleTraffic() {
    trafficSpawnTimer++;
    if (trafficSpawnTimer >= trafficSpawnRate) {
        spawnTraffic(scene, player, aiBikes, traffic);
        trafficSpawnTimer = 0;
    }
    updateTraffic(scene, player, traffic);
    checkTrafficCollisions(traffic);
}

function handleHealthPacks() {
    healthPackSpawnTimer++;
    if (healthPackSpawnTimer >= healthPackSpawnRate) {
        spawnHealthPack(scene, player, healthPacks);
        healthPackSpawnTimer = 0;
    }
    updateHealthPacks(scene, player, healthPacks);
}

function handleCollisions() {
    checkPlayerTrafficCollisions(player, traffic, scene);
    checkAiBikeCollisions(aiBikes, traffic);
    checkEdgeOfRoadPenalty(player, aiBikes);

    // Check player health
    if (player.health < 0) player.health = 0;
    if (player.health <= 0) {
        setGameOver(true);
        document.getElementById('gameOver').style.display = 'block';
    }
}

function updateGameUI() {
    // Update UI
    const displayedSpeed = Math.floor((player.speed / player.maxSpeed) * 100);
    updateUI(displayedSpeed, Math.floor(player.distance), Math.floor(player.health));

    // Update scoreboard
    const scoreboardData = [];
    scoreboardData.push({ name: document.getElementById('playerNameDisplay').textContent, distance: player.distance });
    
    aiBikes.forEach((ai) => {
        scoreboardData.push({ name: ai.name, distance: ai.distance });
    });

    scoreboardData.sort((a, b) => b.distance - a.distance);
    updateScoreboard(scoreboardData);
}
