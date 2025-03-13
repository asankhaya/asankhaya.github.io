import * as THREE from 'three';
import { roadWidth } from './config.js';
import { createHealthPack } from './models.js';

// Spawn a health pack in the game world
export function spawnHealthPack(scene, player, healthPacks) {
    if (!scene) return;
    
    const forwardDist = 30;
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotationY);
    const basePos = player.position.clone().addScaledVector(dir, forwardDist);

    basePos.x += (Math.random() - 0.5) * roadWidth * 0.8;
    basePos.y = 0.5;

    const mesh = createHealthPack();
    mesh.position.copy(basePos);
    scene.add(mesh);

    healthPacks.push({ mesh, position: basePos });
}

// Update health packs and handle pickups
export function updateHealthPacks(scene, player, healthPacks) {
    if (!scene) return;

    // Remove health packs that are too far away
    for (let i = healthPacks.length - 1; i >= 0; i--) {
        const hp = healthPacks[i];
        const dist = hp.position.distanceTo(player.position);
        if (dist > 600) {
            scene.remove(hp.mesh);
            healthPacks.splice(i, 1);
        }
    }
    
    checkHealthPackPickup(scene, player, healthPacks);
}

// Check if player collects any health packs
export function checkHealthPackPickup(scene, player, healthPacks) {
    const pRadius = 0.5;
    
    // Check if player collects health pack
    for (let i = healthPacks.length - 1; i >= 0; i--) {
        const hp = healthPacks[i];
        const dist = hp.position.distanceTo(player.position);
        if (dist < pRadius + 0.4) {
            player.health += 15;
            if (player.health > 100) player.health = 100;
            scene.remove(hp.mesh);
            healthPacks.splice(i, 1);
            
            // Could add a visual or audio effect for pickup here
        }
    }
}
