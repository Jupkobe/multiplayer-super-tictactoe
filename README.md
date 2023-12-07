![super-tictactoe-logo](https://github.com/Jupkobe/multiplayer-super-tictactoe/assets/84783072/ae4c0559-f318-44c6-89ba-1ceaf6a46a25)
# Super Tic-Tac-Toe

Super TicTacToe is an enhanced version of the classic TicTacToe game, offering a more challenging and strategic gameplay experience. This game is designed to be played by two players on a grid of 3x3 boards, adding an extra layer of complexity and excitement to the traditional TicTacToe.

![gameplay](https://github.com/Jupkobe/multiplayer-super-tictactoe/assets/84783072/52594aef-1f1f-4412-bbde-fcabd1f3f920)

## Features
- Create a room with custom symbol
- Joining a room with custom URL or room ID
- Multiple room capability
- Invite URL generation


## How to Play
### To try online
Go to [sxox.onrender.com](https://sxox.onrender.com). Wait couple of seconds for server to start. Then invite a friend and enjoy!
 

### To run the game on your local
1. Run this command in client folder:
`npm run dev`

2. Run this command in server folder:
`npm run start`

3. Once server started, you can create or join a room.

## Technical Details
### Frontend
I used Vite.js with TailwindCSS for the frontend and React-Router for invite URL generations.

### Backend
I used Express.js and Socket.io for WebSocket configuration and Cors for handling outer header requests.

## Contributing
Contributions are welcome! If you have suggestions for improvements or would like to report any issues, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
