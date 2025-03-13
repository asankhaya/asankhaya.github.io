// Main game state management
import { initGame, restartGame } from './game.js';

// Global state
let gameStarted = false;
let gameOver = false;
let playerName = "Player";

// DOM elements
const startButton = document.getElementById('startButton');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start button click event
    if (startButton) {
        startButton.addEventListener('click', () => {
            startGame();
        });
    }
});

// Start the game
export function startGame() {
    gameStarted = true;
    if (startScreen) {
        startScreen.style.display = 'none';
    }
    
    // Show game UI elements
    document.getElementById('speedDial').style.display = 'flex';
    document.getElementById('distanceDisplay').style.display = 'block';
    document.getElementById('healthDisplay').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'block';
    document.getElementById('controlHints').style.display = 'block';
    
    // Initialize the game with player name
    initGame(playerName);
}

// Restart the game after game over
export function restart() {
    if (gameOver) {
        gameOverScreen.style.display = 'none';
        restartGame();
        gameOver = false;
    }
}

// Getters and setters for game state
export function getGameStarted() {
    return gameStarted;
}

export function getGameOver() {
    return gameOver;
}

export function setGameOver(value) {
    gameOver = value;
    if (value && gameOverScreen) {
        gameOverScreen.style.display = 'block';
    }
}

export function getPlayerName() {
    return playerName;
}

export function setPlayerName(name) {
    playerName = name;
    if (playerNameDisplay) {
        playerNameDisplay.textContent = name;
    }
}
