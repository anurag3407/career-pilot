import { Server } from 'socket.io';
import socketOptions from './socketOptions.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, socketOptions);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // --- Start Real-time Collaboration Logic ---
        socket.on('proposal:join', ({ proposalId }) => {
            socket.join(proposalId);
            console.log(`User ${socket.id} joined cooperative proposal room: ${proposalId}`);
        });

        socket.on('proposal:op', (data) => {
            // Broadcast operation to everyone else in the distinct room channel
            socket.to(data.proposalId).emit('proposal:op:broadcast', data);
        });
        // --- End Real-time Collaboration Logic ---

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
