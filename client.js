const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let players = {};
let playerId;
let trashCans = [];

const socket = io();

// Handle server data
socket.on('initialize', (data) => {
    playerId = data.id;
    players = data.players;
    trashCans = data.trashCans;
});

socket.on('stateUpdate', (gameState) => {
    players = gameState.players;
    trashCans = gameState.trashCans;
    drawGame();
});

window.addEventListener('keydown', (e) => {
    socket.emit('move', { key: e.key });
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let id in players) {
        const player = players[id];
        ctx.fillStyle = id === playerId ? 'blue' : 'red';
        ctx.fillRect(player.x, player.y, 50, 50);
    }
    trashCans.forEach(trashCan => {
        ctx.fillStyle = 'green';
        ctx.fillRect(trashCan.x, trashCan.y, 50, 50);
    });
}
