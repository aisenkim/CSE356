const checkWinner = (grid) => {
    let winner = " ";
    // HORIZONTAL
    if (grid[0] === grid[1] && grid[1] === grid[2]) winner = grid[0];
    else if (grid[3] === grid[4] && grid[4] === grid[5]) winner = grid[3];
    else if (grid[6] === grid[7] && grid[7] === grid[8]) winner = grid[6];
    // VERTICAL
    else if (grid[0] === grid[3] && grid[3] === grid[6]) winner = grid[0];
    else if (grid[1] === grid[4] && grid[4] === grid[7]) winner = grid[1];
    else if (grid[2] === grid[5] && grid[5] === grid[8]) winner = grid[2];
    // DIAGONAL
    else if (grid[0] === grid[4] && grid[4] === grid[8]) winner = grid[0];
    else if (grid[2] === grid[4] && grid[4] === grid[6]) winner = grid[2];
    return winner;
};

const isMoveLegal = (usersBoard, move) => {

  for (let i = 0; i <usersBoard.length; i++) {
    if(i === move && usersBoard[i] !== " ")
      return false
  }

    return true
}

const calculateRemainingSpace = (board) => {
  let spaceRemaining = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === " ") spaceRemaining++;
  }
  return spaceRemaining;
};

module.exports = {
   checkWinner,
   isMoveLegal,
    calculateRemainingSpace
}