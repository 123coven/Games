const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let players = {};
let trashCans = [{ x: 300, y: 300 }, { x: 600, y: 400 }];

io.on('connection', (socket) => {
    const id = socket.id;
    players[id] = { x: Math.random() * 800, y: Math.random() * 600 };

    socket.emit('initialize', { id, players, trashCans });
    io.emit('stateUpdate', { players, trashCans });

    socket.on('move', (data) => {
        const player = players[id];
        switch (data.key) {
            case 'ArrowUp': player.y -= 10; break;
            case 'ArrowDown': player.y += 10; break;
            case 'ArrowLeft': player.x -= 10; break;
            case 'ArrowRight': player.x += 10; break;
        }

        // Check collision with trash cans
        trashCans.forEach(trashCan => {
            if (player.x < trashCan.x + 50 && player.x + 50 > trashCan.x &&
                player.y < trashCan.y + 50 && player.y + 50 > trashCan.y) {
                io.emit('message', `${id} has been put in a trash can!`);
            }
        });

        io.emit('stateUpdate', { players, trashCans });
    });

    socket.on('disconnect', () => {
        delete players[id];
        io.emit('stateUpdate', { players, trashCans });
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
