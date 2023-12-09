import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? "https://multiplayer-super-tictactoe.onrender.com" : 'http://localhost:3000';

export const socket = io(URL, {
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in ms)
    reconnectionDelayMax: 5000, // Maximum delay for reconnection attempts
    randomizationFactor: 0.5 // Randomization factor for reconnection attempts
  });
