import * as THREE from 'three';
import { roadWidth, segmentLength, sideWidth } from './config.js';
import { createRoadTexture, createRandomStructure, createTree, createPlants } from './models.js';

// Create a road segment with decorations
export function createRoadSegment() {
    const group = new THREE.Group();

    // Add a river on random segments - 20% chance
    const hasRiver = Math.random() < 0.2;
    
    const roadGeom = new THREE.PlaneGeometry(roadWidth, segmentLength);
    const roadTex = createRoadTexture();
    roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 6);
    const roadMat = new THREE.MeshPhongMaterial({ map: roadTex });
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.z = -segmentLength * 0.5;
    group.add(roadMesh);

    const sideGeom = new THREE.PlaneGeometry(sideWidth, segmentLength);
    const grassMat = new THREE.MeshPhongMaterial({ color: 0x228b22 });

    const leftMesh = new THREE.Mesh(sideGeom, grassMat);
    leftMesh.rotation.x = -Math.PI / 2;
    leftMesh.position.set(-roadWidth * 0.5 - sideWidth * 0.5, 0, -segmentLength * 0.5);
    group.add(leftMesh);

    const rightMesh = new THREE.Mesh(sideGeom, grassMat);
    rightMesh.rotation.x = -Math.PI / 2;
    rightMesh.position.set(roadWidth * 0.5 + sideWidth * 0.5, 0, -segmentLength * 0.5);
    group.add(rightMesh);

    // Add crossroad
    const crossRoadGeom = new THREE.PlaneGeometry(30, 4);
    const crossRoadMat = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const crossRoadMesh = new THREE.Mesh(crossRoadGeom, crossRoadMat);
    crossRoadMesh.rotation.x = -Math.PI / 2;
    crossRoadMesh.rotation.z = Math.PI / 2;
    crossRoadMesh.position.set(0, 0.01, -segmentLength * 0.5);
    group.add(crossRoadMesh);

    // Add light poles along the road
    for (let i = 0; i < 4; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const zPos = -segmentLength * 0.25 * (Math.floor(i/2) + 1);
        
        const lightPoleGeo = new THREE.BoxGeometry(0.1, 2, 0.1);
        const lightPoleMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const lightPole = new THREE.Mesh(lightPoleGeo, lightPoleMat);
        lightPole.position.set(side * (roadWidth * 0.5 - 0.5), 1, zPos);
        group.add(lightPole);

        const lightGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMat = new THREE.MeshPhongMaterial({ 
            color: 0xffffaa,
            emissive: 0xffffaa,
            emissiveIntensity: 0.5
        });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(side * (roadWidth * 0.5 - 0.5), 1.9, zPos);
        group.add(light);
    }

    // Add river if needed
    if (hasRiver) {
        const riverWidth = 15 + Math.random() * 10;
        const riverLength = segmentLength * 0.7;
        const riverGeom = new THREE.PlaneGeometry(riverWidth, riverLength);
        const riverMat = new THREE.MeshPhongMaterial({ 
            color: 0x3498db,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const riverMesh = new THREE.Mesh(riverGeom, riverMat);
        riverMesh.rotation.x = -Math.PI / 2;
        
        // Decide which side the river appears on
        const riverSide = Math.random() < 0.5 ? -1 : 1;
        const riverDist = roadWidth * 0.5 + sideWidth * 0.7 + riverWidth * 0.3;
        riverMesh.position.set(riverSide * riverDist, 0.05, -segmentLength * 0.5);
        group.add(riverMesh);
        
        // Add bridge elements if river crosses road
        if (Math.random() < 0.3) {
            const bridgeGeom = new THREE.BoxGeometry(roadWidth + 4, 0.3, 15);
            const bridgeMat = new THREE.MeshPhongMaterial({ color: 0x5D4037 });
            const bridge = new THREE.Mesh(bridgeGeom, bridgeMat);
            bridge.position.set(0, 0.3, -segmentLength * 0.3);
            group.add(bridge);
            
            // Bridge railings
            const railingGeom = new THREE.BoxGeometry(roadWidth + 4, 0.5, 0.3);
            const railingMat = new THREE.MeshPhongMaterial({ color: 0x8D6E63 });
            const railing1 = new THREE.Mesh(railingGeom, railingMat);
            railing1.position.set(0, 0.6, -segmentLength * 0.3 - 7);
            group.add(railing1);
            
            const railing2 = new THREE.Mesh(railingGeom, railingMat);
            railing2.position.set(0, 0.6, -segmentLength * 0.3 + 7);
            group.add(railing2);
        }
    }

    // Add distant mountains in the background
    if (Math.random() < 0.5) {
        const mountainCount = 2 + Math.floor(Math.random() * 3);
        const mountainSide = Math.random() < 0.5 ? -1 : 1;
        
        for (let i = 0; i < mountainCount; i++) {
            const mountainHeight = 40 + Math.random() * 60;
            const mountainWidth = 30 + Math.random() * 30;
            
            const mountainGeom = new THREE.ConeGeometry(mountainWidth, mountainHeight, 5);
            const mountainMat = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(0x4B5320).lerp(new THREE.Color(0x808080), Math.random() * 0.5),
                flatShading: true
            });
            
            const mountain = new THREE.Mesh(mountainGeom, mountainMat);
            const mountainDist = 100 + Math.random() * 100;
            const offsetZ = -segmentLength * 0.5 - Math.random() * 50;
            const offsetX = mountainSide * (roadWidth * 0.5 + sideWidth + mountainDist + i * 20);
            
            mountain.position.set(offsetX, mountainHeight * 0.5 - 10, offsetZ);
            mountain.rotation.y = Math.random() * Math.PI;
            group.add(mountain);
        }
    }

    // More decorative elements
    for(let i = 0; i < 5; i++){
        const deco = createRandomStructure();
        const side = Math.random() < 0.5 ? -1 : 1;
        deco.position.set(
            side * (roadWidth * 0.5 + Math.random() * sideWidth * 0.7),
            0,
            -segmentLength * 0.5 + -Math.random() * segmentLength
        );
        group.add(deco);
    }

    // More trees and plants
    for(let i = 0; i < 12; i++){
        const isTree = Math.random() < 0.7;
        let element;
        
        if (isTree) {
            element = createTree();
        } else {
            element = createPlants();
        }
        
        const localZ = -(Math.random() * segmentLength);
        const localX = (Math.random() < 0.5 ? -1 : 1) * (roadWidth * 0.5 + Math.random() * 60);
        element.position.set(localX, 0, localZ);
        group.add(element);
    }

    return group;
}
