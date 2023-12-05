import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? "https://multiplayer-super-tictactoe.onrender.com" : 'http://localhost:3000';

export const socket = io(URL);
