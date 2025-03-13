// UI related functions for Road Dash 3D game

// Update the game UI elements with current stats
export function updateUI(speed, distance, health) {
    document.getElementById('speedDial').textContent = `${speed} km/h`;
    document.getElementById('distanceDisplay').textContent = `Distance: ${distance} m`;
    document.getElementById('healthDisplay').textContent = `Health: ${health}`;
}

// Update the scoreboard with player and AI positions
export function updateScoreboard(scoreboardData) {
    const leaderboardContent = document.getElementById('leaderboardContent');
    leaderboardContent.innerHTML = '';
    
    scoreboardData.forEach((s, idx) => {
        const entry = document.createElement('div');
        entry.textContent = `${idx + 1}. ${s.name}: ${Math.floor(s.distance)} m`;
        
        // Highlight player's entry
        if (idx === 0 && s.name === document.getElementById('playerNameDisplay').textContent) {
            entry.style.color = '#ffff00'; // Yellow highlight for player
        }
        
        leaderboardContent.appendChild(entry);
    });
}
