// const url = "http://194.113.75.49/ttt/play";
const url = "http://localhost:3000/ttt/play";

let board = {
  grid: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
};

const postBoard = (event) => {
  for (let i = 0; i < board.grid.length; i++) {
    if (i == event.target.id) {
      if (board.grid[i] != " ") {
        return;
      }

      board.grid[i] = "O";
      break;
    }
  }

  let fetchPost = {
    method: "POST",
    headers: {
      //"Content-Type": "text/plain",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(board),
  };

  fetch(url, fetchPost)
    .then((response) => response.json())
    .then((data) => {
      board.grid = data.grid;
      // update the div
      let gameBoardDiv = document.getElementById("board");
      for (let i = 0; i < board.grid.length; i++) {
        gameBoardDiv.children[i].innerHTML = board.grid[i];
      }
      if (data.winner != " ") {
        const titleTag = document.getElementById("title");
        if (data.winner == "Q") {
          titleTag.innerHTML = `The game is tied`;
        } else {
          titleTag.innerHTML = `Winner is: ${data.winner}`;
        }
      }
    });
};

const outerDiv = document.querySelectorAll("div.game-board");

// ADDING ONCLICK LISTENER
for (let i = 0; i < outerDiv.length; i++) {
  outerDiv[i].onclick = postBoard;
}
