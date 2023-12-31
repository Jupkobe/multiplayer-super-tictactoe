const http = require("http");
const express = require("express");
const {generateEmptyBoardArray, generateBoardIdArray} = require("./modules/resetFuncs");
const {checkHorizontal, checkVertical, checkDiagonal, checkDraw} = require("./modules/checkFuncs");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }, 
  connectionStateRecovery: {
    maxDisconnectionDuration: 5000,
    skipMiddlewares: true,
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("SERVER IS UP")
});

// RASTGELE MODU

const games = {}
const players = {}

io.on("connection", (socket) => {
    socket.on("username-selection", (username) => {
        const usernameList = Object.values(players).map(item => item.username);

        if (usernameList.includes(username)) {
            socket.emit("error", "Username already exists!");
        } else {
            players[socket.id] = {id: socket.id, roomId: null, symbol: null, username};
            socket.emit("username-selected", username);
        }
    })

    socket.on("create-room", (selection) => {
        const roomId = socket.id.slice(0, 5);
        createRoom(roomId);
        console.log("Room created:", roomId);

        socket.join(roomId);
        players[socket.id].roomId = roomId;
        const player = players[socket.id];
        games[roomId].players.push(player.username);

        switch (selection) {
            case "X":
                setPlayerX(roomId, player);
                break;
            case "O":
                setPlayerO(roomId, player);
                break;
            default:
                if (Math.random() * 2 > 1) setPlayerX(roomId, player);
                else setPlayerO(roomId, player); 
        }
        console.log(`${player.username} joined ${roomId}`);

        socket.emit("joined-room", {roomId});
        socket.emit("invite-friend");
    });

    socket.on("join-room", async (roomId) => {
        const sockets = await io.in(roomId).fetchSockets();

        if (sockets.length === 0) {
            socket.emit("error", "Room not found!");
        }
        else if (sockets.length === 2) {
            socket.emit("error", "Room is full!");
        }
        else {
            socket.join(roomId);
            players[socket.id].roomId = roomId;
            const player = players[socket.id];
            games[roomId].players.push(player.username);
            
            if (games[roomId].playerX === null) setPlayerX(roomId, player);
            else setPlayerO(roomId, player);

            console.log(`${player.username} joined ${roomId}`);

            socket.emit("joined-room", {roomId});

            if (games[roomId].winner) {
                socket.emit("game-over", games[roomId].winner);
            } else {
                io.to(roomId).emit("game-ready");
                io.to(roomId).emit("next-turn", {turn: games[roomId].playerX, nextPlayFromServer: generateBoardIdArray()});
            }
        }
    });

    socket.on("disconnect", async () => {
        const player = players[socket.id];

        if (!player) return;

        const roomId = player.roomId;
        const sockets = await io.in(roomId).fetchSockets();

        if (roomId && (sockets.length > 0)) {
            console.log(`${player.username} disconnected from ${roomId}`);

            if (!games[roomId].winner) {
                let winner;
        
                if (games[roomId].playerX.id === socket.id) winner = games[roomId].playerO.username;
                else winner = games[roomId].playerX.username;
        
                games[roomId].winner = winner;
                io.to(roomId).emit("game-over", winner);
                console.log(`${winner} won in ${roomId}`);
            }

            if (games[roomId].playerX.id === socket.id) games[roomId].playerX = null;
            else games[roomId].playerO = null; 
        }
        else if (sockets.length === 0) {
            delete games[roomId];
            console.log(`${roomId} deleted`);
        }

        delete players[socket.id];
    })

    // lastPlay = [room, player, boardId, boxId, result]
    socket.on("play", ({ cliRoomId, cliPlayer, cliBoardId, cliBoxId, cliResult }) => {
        if (games[cliRoomId].turn === cliPlayer) {
            games[cliRoomId].game = games[cliRoomId].game.map(item => (
                item.boardId === cliBoardId ? item = cliResult : item
            ));

            const client = players[socket.id];
            console.log(`${client.username} played ${cliBoardId}x${cliBoxId} in ${cliRoomId}`);

            io.to(cliRoomId).emit("sync", {boardId: cliBoardId, result: cliResult, lastPlay: [cliBoardId, cliBoxId]})

            const winnerArray = games[cliRoomId].game.map(item => item.winner);
            
            let winner = isOver(winnerArray, cliPlayer);
            if (winner !== null) {
                let winnerUsername;
                if (winner === "O") winnerUsername = games[cliRoomId].playerO.username;
                else winnerUsername = games[cliRoomId].playerX.username;

                games[cliRoomId].winner = winnerUsername;
                io.to(cliRoomId).emit("game-over", winnerUsername);
                console.log(`${winnerUsername} won in ${cliRoomId}`);
            } else {
                prepareNextPlay(cliRoomId, cliBoxId);

                if (cliPlayer === "X") {
                    io.to(cliRoomId).emit("next-turn", {turn: games[cliRoomId].playerO, nextPlayFromServer: games[cliRoomId].nextPlay});
                } else {
                    io.to(cliRoomId).emit("next-turn", {turn: games[cliRoomId].playerX, nextPlayFromServer: games[cliRoomId].nextPlay});
                }
            }
        }
    });

    socket.on("reset-request", (roomId) => {
        if (games[roomId].reset && socket.id !== games[roomId].reset) {
            const player = players[socket.id];
            console.log(`${player.username} requested reset in ${roomId} (2/2)`);

            io.to(roomId).emit("reset-count", 2);
            const prevX = games[roomId].playerX;
            const prevO = games[roomId].playerO;

            createRoom(roomId);
            setPlayerO(roomId, prevX);
            setPlayerX(roomId, prevO);
            
            io.to(roomId).emit("reset");
            io.to(roomId).emit("game-ready");
            io.to(roomId).emit("next-turn", {turn: games[roomId].playerX, nextPlayFromServer: generateBoardIdArray()});
        }
        else if (!games[roomId].reset) {
            games[roomId].reset = socket.id;
            const player = players[socket.id];
            
            io.to(roomId).emit("reset-count", 1);
            console.log(`${player.username} requested reset in ${roomId} (1/2)`);
        }
    })
});

function createRoom(roomId) {    
    games[roomId] = {
        playerX: null,
        playerO: null,
        turn: "X",
        lastPlay: [],
        nextPlay: [],
        players: [],
        winner: null,
        game: generateEmptyBoardArray(),
        reset: null,
    };
}

function setPlayerX(roomId, player) {
    player.symbol = "X";
    io.to(player.id).emit("set-symbol", "X");
    games[roomId].playerX = player;
}

function setPlayerO(roomId, player) {
    player.symbol = "O";
    io.to(player.id).emit("set-symbol", "O");
    games[roomId].playerO = player;
}

function isOver(board, player) {        
    if (checkHorizontal(board) || checkVertical(board) || checkDiagonal(board)) {
        return player;
    }
    else if (board.every(item => item !== null)) {
        const xCount = board.filter(item => item === "X").length;
        const oCount = board.filter(item => item === "O").length;
        if (xCount > oCount) return "X";
        else if (oCount > xCount) return "O";
        else return "DRAW";
    }
    return null;
};

function prepareNextPlay(room, lastPlay) {    
    if (games[room].game[lastPlay].winner === null) games[room].nextPlay = [lastPlay];
    else {
        games[room].nextPlay = games[room].game.filter(item => item.winner === null).map(item => item.boardId);
    }

    games[room].turn === "X" ? games[room].turn = "O" : games[room].turn = "X";
}
