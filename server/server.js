const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows any origin (like your Vercel frontend) to connect
        methods: ["GET", "POST"]
    }
});

// Express is only used for the HTTP server needed by Socket.io now.

// Track live connections
let liveVisitors = 0;

io.on('connection', (socket) => {
    liveVisitors++;
    
    // Broadcast updated count to all clients
    io.emit('visitorCountUpdate', liveVisitors);
    
    socket.on('disconnect', () => {
        liveVisitors--;
        io.emit('visitorCountUpdate', liveVisitors);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
