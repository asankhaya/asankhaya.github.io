// Entry point for Road Dash 3D game
import { startGame, restart } from './main.js';
import { keys } from './input.js';

// Initialize the loading process
document.addEventListener('DOMContentLoaded', () => {
    console.log('Road Dash 3D initialized');
    
    // Setup event listeners for keys
    document.addEventListener('keydown', handleKeyDown);
    
    // Simulate loading resources
    let loadingProgress = 0;
    const loadingInterval = setInterval(() => {
        loadingProgress += Math.random() * 5;
        if (loadingProgress > 100) loadingProgress = 100;
        
        document.getElementById('loadingProgress').style.width = loadingProgress + '%';
        
        if (loadingProgress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                document.getElementById('loadingText').textContent = 'Starting game...';
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('startScreen').style.display = 'flex';
                }, 500);
            }, 300);
        }
    }, 100);
    
    // Add click event to start button
    document.getElementById('startButton').addEventListener('click', () => {
        startGame();
    });
});

// Handle key presses
function handleKeyDown(e) {
    // Update key states for game controls
    if (keys[e.code] !== undefined) {
        keys[e.code] = true;
    }
    
    // Start game on Enter from start screen
    if (e.code === 'Enter' && document.getElementById('startScreen').style.display === 'flex') {
        startGame();
    }
    
    // Restart game on Enter from game over screen
    if (e.code === 'Enter' && document.getElementById('gameOver').style.display === 'block') {
        restart();
    }
    
    // Process name input before game starts
    if (document.getElementById('startScreen').style.display === 'flex') {
        handleNameInput(e);
    }
}

// Handle player name input
function handleNameInput(e) {
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    let currentName = playerNameDisplay.textContent;
    
    // Don't process if modifier keys are pressed
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    if (e.code === 'Backspace') {
        // Handle backspace to remove last character
        currentName = currentName.slice(0, -1);
        if (currentName === '') currentName = 'Player';
    } else if (e.key.length === 1 && currentName.length < 15) {
        // Add character if it's a single character and not too long
        if (currentName === 'Player') currentName = '';
        currentName += e.key;
    }
    
    playerNameDisplay.textContent = currentName;
}
