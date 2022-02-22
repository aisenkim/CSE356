const express = require("express");
const cors = require("cors");
//const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(bodyParser.text())
app.use(express.json());

app.get("/", (req, res) => {
  //res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
  res.send("Hello World");
});

app.post("/ttt/", (req, res) => {
  const date = new Date();
  //res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
  const html = `
    <html lang="en">
    <head>
    <link rel="stylesheet" href="index.css" />
      </head>
      <body>
        <div class="box">
          <div>
            <h1>Hello ${req.body.name}, ${date}</h1>
            <h1 id="title">Welcome to Tic-Tac-Toe</h1>
            <form action="/ttt/" method="post">
              <label for="name" class="label-name">Name:</label>
              <input type="text" id="name" name="name" />
              <input type="submit" value="Submit" class="button" />
            </form>
          </div>
        </div>
        <div class="game-board" id="board">
          <div class="game-block" id="0"></div>
          <div class="game-block" id="1"></div>
          <div class="game-block" id="2"></div>
          <div class="game-block" id="3"></div>
          <div class="game-block" id="4"></div>
          <div class="game-block" id="5"></div>
          <div class="game-block" id="6"></div>
          <div class="game-block" id="7"></div>
          <div class="game-block" id="8"></div>
        </div>
        <script src="index.js"></script>
      </body>
    </html>
	`;
  res.send(html);
  //res.send(`Hello ${req.body.name}, ${date}`);
});

app.post("/ttt/play", (req, res) => {
  //res.send("Sent from the server /ttt/play");
  res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
  let board = req.body;
  let winner = " ";
  //   let altered = 0;
  // CHECKING WINNER AFTER USER INPUT
  let potentialWinner = checkWinner(board);
  if (potentialWinner != " ") {
    winner = potentialWinner;
    return res.json({ grid: board.grid, winner });
  }
  for (let i = 0; i < board.grid.length; i++) {
    if (board.grid[i] == " ") {
      board.grid[i] = "X";
      altered = 1;
      break;
    }
  }

  //   // CHECK IF LAST INPUT WAS BOT AND GAME IS OVER
  //   const remainigSpace = calculateRemainingSpace(board);

  // IF NO MORE INPUT IS POSSIBLE AND NO WINNER...
  //   if (altered == 0) {
  //     board.winner = "Q"; // GAME OVER
  //     return res.json(board);
  //   }

  // CHECKING WINNER AFTER BOT INPUT
  potentialWinner = checkWinner(board);
  if (potentialWinner != " ") {
    winner = potentialWinner;
    return res.json({ grid: board.grid, winner });
  }
  res.json({ grid: board.grid, winner });
});

const checkWinner = (board) => {
  let winner = " ";
  const grid = board.grid;
  // HORIZONTAL
  if (grid[0] == grid[1] && grid[1] == grid[2]) winner = grid[0];
  else if (grid[3] == grid[4] && grid[4] == grid[5]) winner = grid[3];
  else if (grid[6] == grid[7] && grid[7] == grid[8]) winner = grid[6];
  // VERTICAL
  else if (grid[0] == grid[3] && grid[3] == grid[6]) winner = grid[0];
  else if (grid[1] == grid[4] && grid[4] == grid[7]) winner = grid[1];
  else if (grid[2] == grid[5] && grid[5] == grid[8]) winner = grid[2];
  // DIAGONAL
  else if (grid[0] == grid[4] && grid[4] == grid[8]) winner = grid[0];
  else if (grid[2] == grid[4] && grid[4] == grid[6]) winner = grid[2];
  return winner;
};

// const calculateRemainingSpace = (board) => {
//   let spaceRemaining = 0;
//   for (let i = 0; i < board.grid.length; i++) {
//     if (board.grid[i] == " ") spaceRemaining++;
//   }
//   return spaceRemaining;
// };

app.listen(port, () => {
  console.log(`Example App For Deploying Nginx SSL on port: ${port}`);
});
