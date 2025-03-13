import { getGameStarted, getGameOver, setPlayerName } from './main.js';

// Key states
export const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Enter: false,
};

// Handle key down events
export function handleKeyDown(e) {
    if (keys[e.code] !== undefined) {
        keys[e.code] = true;
    }
}

// Handle key up events
export function handleKeyUp(e) {
    if (keys[e.code] !== undefined) {
        keys[e.code] = false;
    }
}
