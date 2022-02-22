const tttUtil = require("../util/tttUtil")

helloWorld = (req, res) => {
    res.send("Hello World")
}

postName = (req, res) => {
    const date = new Date();
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
}

playGame = (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
    let board = req.body;
    let winner = " ";

    // CHECKING WINNER AFTER USER INPUT
    let potentialWinner = tttUtil.checkWinner(board);
    if (potentialWinner !== " ") {
        winner = potentialWinner;
        return res.json({grid: board.grid, winner});
    }
    for (let i = 0; i < board.grid.length; i++) {
        if (board.grid[i] === " ") {
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
    potentialWinner = tttUtil.checkWinner(board);
    if (potentialWinner !== " ") {
        winner = potentialWinner;
        return res.json({grid: board.grid, winner});
    }
    res.json({grid: board.grid, winner});
}

module.exports = {
    helloWorld,
    postName,
    playGame
}