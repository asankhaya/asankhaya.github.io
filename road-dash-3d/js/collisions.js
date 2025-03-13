import * as THREE from 'three';
import { roadWidth } from './config.js';

// Handle player collision with traffic
export function checkPlayerTrafficCollisions(player, traffic, scene) {
    const pRadius = 0.5;

    traffic.forEach((v) => {
        const dist = v.position.distanceTo(player.position);
        const vRadius = 0.7;
        if (dist < pRadius + vRadius) {
            player.health -= 0.5;
            player.speed *= 0.5;

            const pushVec = player.position.clone().sub(v.position).setY(0).normalize();
            pushVec.x += (Math.random() - 0.5) * 0.5;
            pushVec.z += (Math.random() - 0.5) * 0.5;
            pushVec.normalize();

            player.position.addScaledVector(pushVec, 0.2);
        }
    });
}

// Check collisions between AI bikes and traffic
export function checkAiBikeCollisions(aiBikes, traffic) {
    // Collisions with traffic - make AI more vulnerable
    aiBikes.forEach(ai => {
        if (ai.health <= 0) return;
        const aiRadius = 0.6; // Increased collision radius
        traffic.forEach(t => {
            const dist = t.position.distanceTo(ai.position);
            const tRadius = 0.8; // Increased collision radius
            if (dist < aiRadius + tRadius) {
                // Increased damage and speed reduction
                ai.health -= 1.5;
                ai.speed *= 0.4;
                
                // Add random slowdown chance (AI makes mistakes)
                if (Math.random() < 0.3) {
                    ai.speed *= 0.5; // Occasionally slow down even more
                }
                
                const pushVec = ai.position.clone().sub(t.position).setY(0).normalize();
                pushVec.x += (Math.random() - 0.5) * 0.7; // More random push
                pushVec.z += (Math.random() - 0.5) * 0.7;
                pushVec.normalize();
                ai.position.addScaledVector(pushVec, 0.3); // Stronger push
            }
        });
        if (ai.health < 0) {
            ai.health = 0;
            ai.speed = 0;
        }
    });

    // Collisions among AI themselves - make them more impactful
    for (let i = 0; i < aiBikes.length; i++) {
        const aiA = aiBikes[i];
        if (aiA.health <= 0) continue;
        for (let j = i + 1; j < aiBikes.length; j++) {
            const aiB = aiBikes[j];
            if (aiB.health <= 0) continue;

            const dist = aiA.position.distanceTo(aiB.position);
            const radiusSum = 0.6 + 0.6; // Increased collision radius
            if (dist < radiusSum) {
                // Increased penalties for collisions
                aiA.health -= 0.8;
                aiB.health -= 0.8;
                aiA.speed *= 0.6;
                aiB.speed *= 0.6;
                
                // Chance of critical collision that severely impacts both bikes
                if (Math.random() < 0.2) {
                    aiA.health -= 2;
                    aiB.health -= 2;
                    aiA.speed *= 0.3;
                    aiB.speed *= 0.3;
                }

                const pushVec = aiA.position.clone().sub(aiB.position).setY(0).normalize();
                pushVec.x += (Math.random() - 0.5) * 0.4;
                pushVec.z += (Math.random() - 0.5) * 0.4;
                pushVec.normalize();
                aiA.position.addScaledVector(pushVec, 0.2);
                aiB.position.addScaledVector(pushVec.negate(), 0.2);
            }
        }
    }
}

// Check vehicle-to-vehicle collisions among traffic
export function checkTrafficCollisions(traffic) {
    // Check each vehicle against others
    for (let i = 0; i < traffic.length; i++) {
        const vehicleA = traffic[i];
        for (let j = i + 1; j < traffic.length; j++) {
            const vehicleB = traffic[j];
            
            const dist = vehicleA.position.distanceTo(vehicleB.position);
            // Collision radius depends on vehicle type (approximated)
            const radiusA = 0.6;
            const radiusB = 0.6;
            
            if (dist < radiusA + radiusB) {
                // Calculate collision response
                const pushVec = vehicleA.position.clone().sub(vehicleB.position).normalize();
                
                // Apply pushback
                vehicleA.position.addScaledVector(pushVec, 0.2);
                vehicleB.position.addScaledVector(pushVec.negate(), 0.2);
                
                // Reduce speed on collision
                vehicleA.speed *= 0.8;
                vehicleB.speed *= 0.8;
                
                // Slightly adjust direction
                vehicleA.rotationY += (Math.random() - 0.5) * 0.1;
                vehicleB.rotationY += (Math.random() - 0.5) * 0.1;
            }
        }
    }
}

// Apply speed penalties for driving off-road
export function checkEdgeOfRoadPenalty(player, aiBikes) {
    // Check player
    const playerEdgeDistance = Math.abs(player.position.x) - (roadWidth * 0.4);
    
    if (playerEdgeDistance > 0) {
        // Player is close to/on the edge, apply speed penalty
        player.speed *= 0.95;
        
        // Shake the bike slightly to give feedback
        player.rotationY += (Math.random() - 0.5) * 0.02;
    }
    
    // Check AI bikes
    aiBikes.forEach(ai => {
        if (ai.health <= 0) return;
        
        const aiEdgeDistance = Math.abs(ai.position.x) - (roadWidth * 0.4);
        
        if (aiEdgeDistance > 0) {
            // AI is close to/on the edge, apply speed penalty
            ai.speed *= 0.95;
            
            // Add some steering adjustment to try to get back on road
            const steerDirection = ai.position.x > 0 ? 1 : -1;
            ai.rotationY += steerDirection * ai.steerSpeed * 0.5;
        }
    });
}
