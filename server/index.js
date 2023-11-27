const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const {generateEmptyBoardArray, generateBoardIdArray} = require("./modules/resetFuncs");
const {checkHorizontal, checkVertical, checkDiagonal, checkDraw} = require("./modules/checkFuncs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://super-tictactoe-frontend.onrender.com/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://super-tictactoe-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

server.listen(PORT, () => {
    console.log("SERVER IS UP")
});

//TODO 3+ oyuncu bağlanınca ne olacak
// x's turn değişmiyor
// reset

const games = {}

io.on("connection", (socket) => {
    socket.on("join_room", async (room) => {
        const sockets = await io.in(room).fetchSockets();
        
        if (sockets.length < 2) {
            socket.join(room);
            if (sockets.length === 0) {
                games[room] = {
                    playerX: socket.id,
                    playerO: null,
                    turn: "X",
                    nextPlay: [],
                    game: generateEmptyBoardArray(),
                };
                     
                io.to(socket.id).emit("joined_room", "X");
            }
            else {
                // if (games[room].playerO === null) {  // If player disconnects and connects back
                //     games[room].playerO = socket.id;
                //     io.to(socket.id).emit("joined_room", "O");
                // }
                // else {
                //     games[room].playerX = socket.id;
                // }

                games[room].playerO = socket.id;
                io.to(socket.id).emit("joined_room", "O");
                io.to(room).emit("next_turn", {nextPlayer: "X", nextPlayFromServer: generateBoardIdArray()});
            }
            console.log(`${socket.id} joined ${room}`);
        }        
        const newSockets = await io.in(room).fetchSockets();
        console.log(`${newSockets.length} player(s) in ${room}`);
    });
    

    // lastPlay = [room, player, boardId, boxId, result]
    socket.on("play", ({ cliRoom, cliPlayer, cliBoardId, cliBoxId, cliResult }) => {
        if (games[cliRoom].turn === cliPlayer) {
            games[cliRoom].game = games[cliRoom].game.map(item => (
                item.id === cliBoardId ? item = cliResult : item
            ));

            io.to(cliRoom).emit("sync", {boardId: cliBoardId, result: cliResult})

            const winnerArray = games[cliRoom].game.map(item => item.winner);
            
            let winner = isOver(winnerArray, cliPlayer);
            if (winner !== null) {
                io.to(cliRoom).emit("game_over", winner);
            } else {
                prepareNextPlay(cliRoom, cliPlayer, cliBoxId);

                io.to(cliRoom).emit("next_turn", {nextPlayer: games[cliRoom].turn, nextPlayFromServer: games[cliRoom].nextPlay});
            }
        }
    })
});


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

function prepareNextPlay(room, lastPlayer, lastPlay) {    
    if (games[room].game[lastPlay].winner === null) games[room].nextPlay = [lastPlay];
    else {
        games[room].nextPlay = games[room].game.filter(item => item.winner === null).map(item => item.id);
    }

    games[room].turn === "X" ? games[room].turn = "O" : games[room].turn = "X";
}
