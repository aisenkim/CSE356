const tttUtil = require("../util/tttUtil");
const User = require("../models/user");
const Game = require("../models/game");

helloWorld = (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
    res.send("Hello World");
};

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
};

playGame = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
    // let board = req.body
    let winner = " ";
    let {move} = req.body; // INTEGER INDEX OF MOVE MADE BY A HUMAN USER

    const username = req.session.username;
    let currentUser = await User.findOne({username});

    // Make a game if gameid doesn't exist in the session
    let game = await Game.findOne({id: currentUser.boardId});
    if (!game) {
        game = new Game({
            id: currentUser.boardId,
            username,
            grid: currentUser.board,
            winner,
        });
    }

    if (!currentUser) return res.json({status: "ERROR"});

    if (move === null) {
        return res.json({grid: currentUser.board, winner: null, status: "OK"});
    } else if (move === undefined) {
        return res.json({grid: currentUser.board, winner: null, status: "ERROR"});
    }

    move = parseInt(move);
    // OUT OF BOUNDS ERROR
    if (move < 0 || move > 8)
        return res.json({grid: currentUser.board, winner: null, status: "ERROR"});

    // CHECK IF BOARD IS LEGAL (CHECK UNAUTHORIZED MOVE MADE)
    const isLegal = tttUtil.isMoveLegal(currentUser.board, move);
    if (!isLegal) {

        return res.json({grid: currentUser.board, winner: null, status: "ERROR"});
    }

    // // ADD USER'S MOVE TO THE GRID IF MOVE IS LEGAL
    currentUser.board[move] = "X";

    // CHECKING WINNER AFTER USER INPUT
    let potentialWinner = tttUtil.checkWinner(currentUser.board);
    if (potentialWinner !== " ") {

        winner = potentialWinner;
        // SAVE GAME STATE
        // const GameWinner = await new Game({username, grid: currentUser.board, winner})
        // await GameWinner.save()
        game.grid = currentUser.board;
        game.winner = winner;
        await game.save();

        const userWinnerBoard = currentUser.board
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        currentUser.boardId = Math.random().toString(36).slice(2); // assign new boardId for next game
        await currentUser.save();
        return res.json({grid: userWinnerBoard, winner, status: "OK"});
    }

    // SERVER MAKING A MOVE
    for (let i = 0; i < currentUser.board.length; i++) {
        if (currentUser.board[i] === " ") {
            currentUser.board[i] = "O";

            break;
        }
    }

    // CHECKING WINNER AFTER BOT INPUT
    potentialWinner = tttUtil.checkWinner(currentUser.board);
    if (potentialWinner !== " ") {

        winner = potentialWinner;
        // SAVE GAME STATE
        // const gameId = req.session.gameId
        // let savedGame = Game.findOne({id: gameId})
        // const GameWinner = await new Game({username, grid: currentUser.board, winner})
        // await GameWinner.save()
        game.grid = currentUser.board
        game.winner = winner
        await game.save()
        const botWinnerBoard = currentUser.board
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        currentUser.boardId = Math.random().toString(36).slice(2); // assign new boardId for next game
        await currentUser.save();
        return res.json({grid: botWinnerBoard, winner, status: "OK"});
    } else if (tttUtil.calculateRemainingSpace(currentUser.board) === 0) {
        // CHECKING IF A TIE
        // Save State

        // const GameWinner = await new Game({username, grid: currentUser.board, winner})
        // await GameWinner.save()
        game.grid = currentUser.board;
        game.winner = winner;
        await game.save();

        const tieBoard = currentUser.board;
        currentUser.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        currentUser.boardId = Math.random().toString(36).slice(2); // assign new boardId for next game
        await currentUser.save();
        return res.json({grid: tieBoard, winner: winner, status: "OK"});
    }

    await currentUser.save();

    game.grid = currentUser.board;
    await game.save();


    return res.json({status: "OK", grid: currentUser.board, winner: null});
};

/**
 * @return - { status:"OK", games:[ {id:, start_date:}, ???] }
 */
listGame = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");

    const username = req.session.username;
    if (!username) {

        return res.json({status: "ERROR"});
    }
    const games = await Game.find({username});
    //  const games = await Game.find()
    if (!games) {

        return res.json({status: "OK", games: []});
    }

    const gameList = games.map((game) => {
        return {id: game.id, start_date: game.start_date};
    });

    return res.json({status: "OK", games: gameList});
};

getGame = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");

    const {id} = req.body;
    const username = req.session.username;
    if (!username) return res.json({status: "ERROR"});
    const games = await Game.findOne({username, id: id});
    if (!games) return res.json({status: "ERROR"});
    return res.json({status: "OK", grid: games.grid, winner: games.winner});
};

getScore = async (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
    let humanWin = 0;
    let serverWin = 0;
    let tie = 0;
    const username = req.session.username;
    if (!username) return res.json({status: "ERROR"});
    const games = await Game.find({username});
    if (!games) return res.json({status: "OK", human: 0, wopr: 0, tie: 0});

    games.forEach((game) => {
        if (game.winner === "O") humanWin++;
        else if (game.winner === "X") serverWin++;
        else tie++;
    });

    return res.json({status: "OK", human: humanWin, wopr: serverWin, tie});
};

getPlay = (req, res) => {
    res.set("X-CSE356", "61f9c246ca96e9505dd3f812");
    res.send("in /ttt/play");
};

module.exports = {
    helloWorld,
    postName,
    playGame,
    getGame,
    getScore,
    listGame,
    getPlay,
};
