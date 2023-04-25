const boardWidth = 10;
const boardHeight = 20;
const blockSize = 24;
const blockColors = ["red", "orange", "yellow", "green", "blue", "purple"];

let board = [];
let currentPiece;
let score = 0;

const shapes = [
  [[1,1,1],[0,1,0]],
  [[0,2,2],[2,2,0]],
  [[3,3,0],[0,3,3]],
  [[4,0,0],[4,4,4]],
  [[0,0,5],[5,5,5]],
  [[6,6],[6,6]],
  [[7,7,7,7]]
];

function newPiece() {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const piece = { shape: shape, x: Math.floor((boardWidth - shape[0].length) / 2), y: 0, color: blockColors[Math.floor(Math.random() * blockColors.length)] };
  currentPiece = piece;
  if (isColliding()) {
    gameOver();
  }
}

function isColliding() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        const boardX = currentPiece.x + x;
        const boardY = currentPiece.y + y;
        if (boardY >= board.length || boardX < 0 || boardX >= board[boardY].length || board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

function movePiece(dx, dy) {
  currentPiece.x += dx;
  currentPiece.y += dy;
  if (isColliding()) {
    currentPiece.x -= dx;
    currentPiece.y -= dy;
    if (dy > 0) {
      lockPiece();
    }
  }
}

function rotatePiece() {
  const rotatedPiece = [];
  for (let x = 0; x < currentPiece.shape[0].length; x++) {
    const newRow = [];
    for (let y = currentPiece.shape.length - 1; y >= 0; y--) {
      newRow.push(currentPiece.shape[y][x]);
    }
    rotatedPiece.push(newRow);
  }
  currentPiece.shape = rotatedPiece;
  if (isColliding()) {
    currentPiece.shape = shapes[shapes.indexOf(currentPiece.shape) - 1];
  }
}

function lockPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        const boardX = currentPiece.x + x;
        const boardY = currentPiece.y + y;
        board[boardY][boardX] = currentPiece.color;
      }
    }
  }
  checkRows();
  newPiece();
}

function checkRows() {
  for (let y = 0; y < board.length; y++) {
    if (board[y].every(block => block !== 0)) {
      board.splice(y, 1);
      board.unshift(new Array(boardWidth).fill(0));
      score += 10;
      updateScore();
    }
  }
}

function updateScore() {
  document.getElementById("score").textContent = score`
  ${score}`;
}

function gameOver() {
  clearInterval(intervalId);
  alert("Game Over");
}

function drawBoard() {
  const canvas = document.getElementById("tetris");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== 0) {
        context.fillStyle = board[y][x];
        context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        context.strokeStyle = "black";
        context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  }
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        context.fillStyle = currentPiece.color;
        context.fillRect((currentPiece.x + x) * blockSize, (currentPiece.y + y) * blockSize, blockSize, blockSize);
        context.strokeStyle = "black";
        context.strokeRect((currentPiece.x + x) * blockSize, (currentPiece.y + y) * blockSize, blockSize, blockSize);
      }
    }
  }
}

function gameLoop() {
  movePiece(0, 1);
  drawBoard();
}

function startGame() {
  board = new Array(boardHeight).fill().map(() => new Array(boardWidth).fill(0));
  score = 0;
  updateScore();
  newPiece();
  intervalId = setInterval(gameLoop, 500);
}

document.addEventListener("keydown", event => {
  switch (event.code) {
    case "ArrowLeft":
      movePiece(-1, 0);
      break;
    case "ArrowRight":
      movePiece(1, 0);
      break;
    case "ArrowDown":
      movePiece(0, 1);
      break;
    case "KeyZ":
      rotatePiece();
      break;
    case "Space":
      while (!isColliding()) {
        movePiece(0, 1);
      }
      lockPiece();
      break;
  }
});

startGame();
