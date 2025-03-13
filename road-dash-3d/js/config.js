// Game configuration
export const segmentLength = 300;
export const roadWidth = 10;
export const sideWidth = 60;
export const forwardSegmentCount = 6;
export const backwardSegmentCount = 6;
export const trafficSpawnRate = 90;
export const healthPackSpawnRate = 600;
export const lanePositions = [-1.5, 1.5];

// AI racer names
export const aiNames = [
    "Speedster", "Burnout", "Viper", "Flash", 
    "Thunder", "Comet", "Turbo", "Velocity", 
    "Rocket", "Blaze", "Lightning", "Nitro",
    "Drift", "Bullet", "Racer", "Rush"
];

// Initial player bike configuration
export const playerDefaults = {
    maxSpeed: 0.3,
    accel: 0.0015,
    decel: 0.0005,
    steerSpeed: 0.015,
    health: 100
};

// Number of AI bikes
export const numAiBikes = 3;
