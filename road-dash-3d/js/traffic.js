import * as THREE from 'three';
import { lanePositions } from './config.js';
import { createCar, createTruck, createAiBike } from './models.js';

// Spawn traffic in the game world
export function spawnTraffic(scene, player, aiBikes, traffic) {
    if (!scene) return;

    // Spawn more traffic in front of AI bikes to challenge them
    const spawnNearAI = Math.random() < 0.4; // 40% chance to spawn near AI bikes
    
    let basePos, targetRotationY;
    
    if (spawnNearAI && aiBikes.length > 0) {
        // Pick a random AI bike that's ahead of the player
        const aheadAIs = aiBikes.filter(ai => ai.distance > player.distance);
        
        if (aheadAIs.length > 0) {
            const targetAI = aheadAIs[Math.floor(Math.random() * aheadAIs.length)];
            const forwardDist = Math.random() < 0.7 ? 20 : -10; // Mostly in front of AI
            
            const aiDir = new THREE.Vector3(0, 0, -1);
            aiDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetAI.rotationY);
            basePos = targetAI.position.clone().addScaledVector(aiDir, forwardDist);
            targetRotationY = targetAI.rotationY + (forwardDist > 0 ? Math.PI : 0);
        } else {
            // Fallback to standard spawning
            const forwardDist = Math.random() < 0.5 ? 30 : -30;
            const dir = new THREE.Vector3(0, 0, -1);
            dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotationY);
            basePos = player.position.clone().addScaledVector(dir, forwardDist);
            targetRotationY = player.rotationY + (forwardDist > 0 ? Math.PI : 0);
        }
    } else {
        // Standard spawning around player
        const forwardDist = Math.random() < 0.5 ? 30 : -30;
        const dir = new THREE.Vector3(0, 0, -1);
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotationY);
        basePos = player.position.clone().addScaledVector(dir, forwardDist);
        targetRotationY = player.rotationY + (forwardDist > 0 ? Math.PI : 0);
    }

    // Random lane position
    const lane = lanePositions[Math.floor(Math.random() * lanePositions.length)];
    basePos.x = lane;
    basePos.y = 0.5;

    const rand = Math.random();
    let mesh;
    let speed = 0.05 + Math.random() * 0.07;

    if (rand < 0.33) {
        mesh = createCar();
    } else if (rand < 0.66) {
        mesh = createTruck();
        speed *= 0.5;
    } else {
        mesh = createAiBike();
    }

    mesh.position.copy(basePos);
    scene.add(mesh);

    // Add the new traffic object to the array
    traffic.push({
        mesh,
        position: basePos,
        rotationY: targetRotationY,
        speed,
    });
}

// Update traffic positions and remove those too far away
export function updateTraffic(scene, player, traffic) {
    if (!scene) return;

    traffic.forEach((v) => {
        const dir = new THREE.Vector3(0, 0, -1);
        dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotationY);
        v.position.addScaledVector(dir, v.speed);

        let bestLane = lanePositions[0];
        let bestDist = Math.abs(v.position.x - bestLane);
        for (let i = 1; i < lanePositions.length; i++) {
            const d = Math.abs(v.position.x - lanePositions[i]);
            if (d < bestDist) {
                bestLane = lanePositions[i];
                bestDist = d;
            }
        }
        const dx = bestLane - v.position.x;
        v.position.x += dx * 0.02;

        v.mesh.position.copy(v.position);
        v.mesh.rotation.y = v.rotationY;
    });

    // Remove traffic that's too far away
    for (let i = traffic.length - 1; i >= 0; i--) {
        const v = traffic[i];
        const dist = v.position.distanceTo(player.position);
        if (dist > 600) {
            scene.remove(v.mesh);
            traffic.splice(i, 1);
        }
    }
}
