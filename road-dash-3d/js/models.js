import * as THREE from 'three';

// Create road texture
export function createRoadTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
}

// Generate a random color
export function randomColor() {
    const r = Math.floor(50 + Math.random() * 205);
    const g = Math.floor(50 + Math.random() * 205);
    const b = Math.floor(50 + Math.random() * 205);
    return new THREE.Color(`rgb(${r},${g},${b})`);
}

// Create player's bike model
export function createBikeModel() {
    const group = new THREE.Group();

    const frameGeo = new THREE.BoxGeometry(0.3, 0.3, 1.2);
    const frameMat = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 0.25, 0);
    group.add(frame);

    const tankGeo = new THREE.BoxGeometry(0.25, 0.2, 0.3);
    const tankMat = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 0.45, -0.2);
    group.add(tank);

    const seatGeo = new THREE.BoxGeometry(0.25, 0.1, 0.2);
    const seatMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.45, 0.2);
    group.add(seat);

    const forkGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const forkMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const fork = new THREE.Mesh(forkGeo, forkMat);
    fork.position.set(0, 0.3, -0.6);
    fork.rotation.x = Math.PI / 2;
    group.add(fork);

    const handleGeo = new THREE.BoxGeometry(0.6, 0.05, 0.05);
    const handleMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0.5, -0.6);
    group.add(handle);

    const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });

    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(0, 0, -0.6);
    group.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeo, wheelMat);
    backWheel.rotation.z = Math.PI / 2;
    backWheel.position.set(0, 0, 0.6);
    group.add(backWheel);

    const riderGeo = new THREE.BoxGeometry(0.25, 0.5, 0.2);
    const riderMat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const riderMesh = new THREE.Mesh(riderGeo, riderMat);
    riderMesh.position.set(0, 0.8, 0.15);
    group.add(riderMesh);

    return group;
}

// Create AI bike model
export function createAiBike() {
    const group = new THREE.Group();

    const frameGeo = new THREE.BoxGeometry(0.3, 0.3, 1.2);
    // Generate a random bike color
    const bikeColor = new THREE.Color(
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7
    );
    const frameMat = new THREE.MeshPhongMaterial({ color: bikeColor });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 0.25, 0);
    group.add(frame);

    const tankGeo = new THREE.BoxGeometry(0.25, 0.2, 0.3);
    const tankMat = new THREE.MeshPhongMaterial({ color: bikeColor.clone().multiplyScalar(0.8) });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 0.45, -0.2);
    group.add(tank);

    const seatGeo = new THREE.BoxGeometry(0.25, 0.1, 0.2);
    const seatMat = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.45, 0.2);
    group.add(seat);

    const forkGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const forkMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const fork = new THREE.Mesh(forkGeo, forkMat);
    fork.position.set(0, 0.3, -0.6);
    fork.rotation.x = Math.PI / 2;
    group.add(fork);

    const handleGeo = new THREE.BoxGeometry(0.6, 0.05, 0.05);
    const handleMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0.5, -0.6);
    group.add(handle);

    const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });

    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(0, 0, -0.6);
    group.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeo, wheelMat);
    backWheel.rotation.z = Math.PI / 2;
    backWheel.position.set(0, 0, 0.6);
    group.add(backWheel);

    // AI rider with a different color jacket
    const riderColor = new THREE.Color(
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7
    );
    const riderGeo = new THREE.BoxGeometry(0.25, 0.5, 0.2);
    const riderMat = new THREE.MeshPhongMaterial({ color: riderColor });
    const riderMesh = new THREE.Mesh(riderGeo, riderMat);
    riderMesh.position.set(0, 0.8, 0.15);
    group.add(riderMesh);

    return group;
}

// Create car model
export function createCar() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(1.2, 0.4, 2.2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: randomColor() });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.2;
    group.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x333333 });

    for (let i = 0; i < 4; i++) {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI / 2;
        const xOff = i < 2 ? 0.5 : -0.5;
        const zOff = i % 2 === 0 ? 0.7 : -0.7;
        w.position.set(xOff, 0, zOff);
        group.add(w);
    }

    return group;
}

// Create truck model
export function createTruck() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(1.5, 0.6, 3);
    const bodyMat = new THREE.MeshPhongMaterial({ color: randomColor() });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.3;
    group.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    for (let i = 0; i < 4; i++) {
        const w = new THREE.Mesh(wheelGeo, wheelMat);
        w.rotation.z = Math.PI / 2;
        const xOff = i < 2 ? 0.7 : -0.7;
        const zOff = i % 2 === 0 ? 1.0 : -1.0;
        w.position.set(xOff, 0, zOff);
        group.add(w);
    }

    return group;
}

// Create health pack model
export function createHealthPack() {
    const packGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const packMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(packGeo, packMat);
}

// Create tree model
export function createTree() {
    const group = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 8);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1;
    group.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(1, 2, 8);
    const leavesMat = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 2;
    group.add(leaves);

    return group;
}

// Create big tree model
export function createBigTree() {
    const group = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    group.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMat = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 3;
    group.add(leaves);

    return group;
}

// Create house model
export function createHouse() {
    const group = new THREE.Group();
    const houseBodyGeo = new THREE.BoxGeometry(3, 2, 3);
    const houseBodyMat = new THREE.MeshPhongMaterial({ color: 0xc19a6b });
    const houseBody = new THREE.Mesh(houseBodyGeo, houseBodyMat);
    houseBody.position.y = 1;
    group.add(houseBody);

    const roofGeo = new THREE.ConeGeometry(2, 1, 4);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0x8b0000 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.5;
    group.add(roof);

    return group;
}

// Create shop model
export function createShop() {
    const group = new THREE.Group();

    const shopBodyGeo = new THREE.BoxGeometry(5, 2, 3);
    const shopBodyMat = new THREE.MeshPhongMaterial({ color: 0xa9a9a9 });
    const shopBody = new THREE.Mesh(shopBodyGeo, shopBodyMat);
    shopBody.position.y = 1;
    group.add(shopBody);

    const signGeo = new THREE.BoxGeometry(3, 0.5, 0.1);
    const signMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2, 1.6);
    group.add(sign);

    return group;
}

// Create mall model
export function createMall() {
    const group = new THREE.Group();

    const mallBodyGeo = new THREE.BoxGeometry(8, 4, 5);
    const mallBodyMat = new THREE.MeshPhongMaterial({ color: 0x8888aa });
    const mallBody = new THREE.Mesh(mallBodyGeo, mallBodyMat);
    mallBody.position.y = 2;
    group.add(mallBody);

    for (let i = 0; i < 3; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const pillarMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(-2 + i * 2, 1.5, 2.5);
        group.add(pillar);
    }

    return group;
}

// Create shrub model
export function createShrub() {
    const group = new THREE.Group();
    const bushGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const bushMat = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const bush = new THREE.Mesh(bushGeo, bushMat);
    bush.position.y = 0.5;
    group.add(bush);
    return group;
}

// Create billboard model
export function createBillboard() {
    const group = new THREE.Group();

    const boardGeo = new THREE.BoxGeometry(4, 2, 0.1);
    const boardMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 2;
    group.add(board);

    for (let i = 0; i < 2; i++) {
        const poleGeo = new THREE.BoxGeometry(0.1, 2, 0.1);
        const poleMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(i === 0 ? -1.5 : 1.5, 1, 0);
        group.add(pole);
    }

    return group;
}

// Create plants (bushes, flowers, etc.)
export function createPlants() {
    const group = new THREE.Group();
    
    // Random plant type
    const plantType = Math.floor(Math.random() * 3);
    
    if (plantType === 0) {
        // Bush cluster
        const bushCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < bushCount; i++) {
            const size = 0.3 + Math.random() * 0.4;
            const bushGeo = new THREE.SphereGeometry(size, 8, 8);
            const bushMat = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(0x228B22).lerp(new THREE.Color(0x006400), Math.random() * 0.5)
            });
            const bush = new THREE.Mesh(bushGeo, bushMat);
            bush.position.set(
                (Math.random() - 0.5) * 1.5,
                size,
                (Math.random() - 0.5) * 1.5
            );
            group.add(bush);
        }
    } else if (plantType === 1) {
        // Flowers
        const flowerCount = 4 + Math.floor(Math.random() * 5);
        const flowerColors = [0xFF1493, 0xFFFF00, 0xFF6347, 0x9932CC, 0xFF4500];
        
        for (let i = 0; i < flowerCount; i++) {
            const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
            const stemMat = new THREE.MeshPhongMaterial({ color: 0x228B22 });
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 0.15;
            
            const flowerGeo = new THREE.SphereGeometry(0.07, 8, 8);
            const flowerMat = new THREE.MeshPhongMaterial({ 
                color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
            });
            const flower = new THREE.Mesh(flowerGeo, flowerMat);
            flower.position.y = 0.35;
            
            const flowerGroup = new THREE.Group();
            flowerGroup.add(stem);
            flowerGroup.add(flower);
            flowerGroup.position.set(
                (Math.random() - 0.5) * 1.2,
                0,
                (Math.random() - 0.5) * 1.2
            );
            group.add(flowerGroup);
        }
    } else {
        // Tall grass
        const grassCount = 6 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < grassCount; i++) {
            const height = 0.2 + Math.random() * 0.3;
            const grassGeo = new THREE.CylinderGeometry(0.02, 0, height, 8);
            const grassMat = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color(0x9B9B00).lerp(new THREE.Color(0x228B22), Math.random() * 0.5)
            });
            const grass = new THREE.Mesh(grassGeo, grassMat);
            grass.position.set(
                (Math.random() - 0.5) * 1.2,
                height / 2,
                (Math.random() - 0.5) * 1.2
            );
            grass.rotation.y = Math.random() * Math.PI;
            grass.rotation.x = (Math.random() - 0.5) * 0.2;
            group.add(grass);
        }
    }
    
    return group;
}

// Select a random structure
export function createRandomStructure() {
    const rand = Math.random();
    if (rand < 0.2) return createHouse();
    else if (rand < 0.4) return createShop();
    else if (rand < 0.6) return createMall();
    else if (rand < 0.8) return createShrub();
    else return createBillboard();
}
