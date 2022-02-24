const tttUtil = require("../util/tttUtil")
const User = require("../models/user")
const Game = require("../models/game")

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

playGame = async (req, res) => {
    console.log("Entered Game")
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    let board = req.body
    let winner = " "

    const username = req.session.username
    let currentUser = await User.findOne({username})

    if (!currentUser)
        return res.status(400).json({status: "ERROR"})

    if (board.grid === null)
        return res.json({grid: currentUser.board, winner, status: "OK"});

    // CHECK IF BOARD IS LEGAL (CHECK UNAUTHORIZED MOVE MADE)
    const isLegal = tttUtil.isBoardLegal(currentUser.board, board.grid)
    if (!isLegal)
        return res.json({grid: currentUser.board, winner, status: "ERROR"})

    // CHECKING WINNER AFTER USER INPUT
    let potentialWinner = tttUtil.checkWinner(board);
    if (potentialWinner !== " ") {
        winner = potentialWinner;
        // SAVE GAME STATE
        const GameWinner = await new Game({username, winner, grid: board.grid})
        await GameWinner.save()
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        await currentUser.save()
        return res.json({grid: currentUser.board, winner, status: "OK"});
    }

    // SERVER MAKING A MOVE
    for (let i = 0; i < board.grid.length; i++) {
        if (board.grid[i] === " ") {
            board.grid[i] = "X";
            break;
        }
    }

    // CHECKING WINNER AFTER BOT INPUT
    potentialWinner = tttUtil.checkWinner(board);
    if (potentialWinner !== " ") {
        winner = potentialWinner;
        // SAVE GAME STATE
        const GameWinner = await new Game({username, winner, grid: board.grid})
        await GameWinner.save()
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        await currentUser.save()
        return res.json({grid: currentUser.board, winner, status: "OK"});
    } else if (tttUtil.calculateRemainingSpace(board.grid) === 0) {
        // CHECKING IF A TIE
        // Save State
        const GameWinner = await new Game({username, winner, grid: board.grid})
        await GameWinner.save()
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        await currentUser.save()
        return res.json({grid: currentUser.board, winner: " ", status: "OK"});
    }


    currentUser.board = board.grid
    await currentUser.save()

    return res.json({grid: board.grid, winner, status: "OK"});
}

/**
 * @return - { status:"OK", games:[ {id:, start_date:}, …] }
 */
listGame = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const username = req.session.username
    if (!username)
        return res.json({status: "ERROR"})
    const games = await Game.find({username})
    if (!games)
        return res.json({status: "OK", games: []})
    const gameList = games.map(game => ({id: game._id, start_date: game.start_date}))
    return res.json({status: "OK", games: gameList})
}

getGame = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    const {id} = req.body
    const username = req.session.username
    if (!username)
        return res.json({status: "ERROR"})
    const games = await Game.findOne({username, _id: id})
    if (!games)
        return res.json({status: "ERROR"})
    return res.json({status: "OK", grid: games.grid, winner: games.winner})

}

getScore = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812")
    let humanWin = 0
    let serverWin = 0
    let tie = 0
    const username = req.session.username
    if (!username)
        return res.json({status: "ERROR"})
    const games = await Game.find({username})
    if (!games)
        return res.json({status: "OK", human: 0, wopr: 0, tie: 0})

    games.forEach(game => {
        if (game.winner === "O")
            humanWin++
        else if (game.winner === "X")
            serverWin++
        else
            tie++
    })

    return res.json({status: "OK", human: humanWin, wopr: serverWin, tie})
}

module.exports = {
    helloWorld,
    postName,
    playGame,
    getGame,
    getScore,
    listGame
}