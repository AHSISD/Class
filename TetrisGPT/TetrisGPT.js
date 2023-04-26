const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 24;
const EMPTY_BLOCK = '#ccc';

let board = [];
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  for (let col = 0; col < COLS; col++) {
    board[row][col] = EMPTY_BLOCK;
  }
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawBlock(col, row, board[row][col]);
    }
  }
}

drawBoard();

let currentPiece = {
  x: 0,
  y: 0,
  blocks: [
    [1, 1],
    [1, 1]
  ]
};

function drawPiece() {
  currentPiece.blocks.forEach(function (row, dy) {
    row.forEach(function (value, dx) {
      if (value) {
        drawBlock(currentPiece.x + dx, currentPiece.y + dy, 'blue');
      }
    });
  });
}

function drawGhostPiece() {
  let ghostPiece = Object.assign({}, currentPiece);
  while (!collides(board, ghostPiece)) {
    ghostPiece.y++;
  }
  ghostPiece.y--;
  ghostPiece.blocks.forEach(function (row, dy) {
    row.forEach(function (value, dx) {
      if (value) {
        drawBlock(ghostPiece.x + dx, ghostPiece.y + dy, '#aaa');
      }
    });
  });
}

function dropPiece() {
  currentPiece.y += 1;
  if (collides(board, currentPiece)) {
    currentPiece.y -= 1;
    merge(board, currentPiece);
    currentPiece.y = 0;
    currentPiece.x = Math.floor(Math.random() * (COLS - currentPiece.blocks[0].length + 1));
    currentPiece.blocks = randomPiece();
  }
}

function collides(board, piece) {
  for (let row = 0; row < piece.blocks.length; row++) {
    for (let col = 0; col < piece.blocks[row].length; col++) {
      if (piece.blocks[row][col] && (board[piece.y + row] && board[piece.y + row][piece.x + col]) !== EMPTY_BLOCK) {
        return true;
      }
    }
  }
  return false;
}

function merge(board, piece) {
  piece.blocks.forEach(function (row, dy) {
    row.forEach(function (value, dx) {
      if (value) {
        board[piece.y + dy][piece.x + dx] = 'blue';
      }
    });
  });
}

function clearBoard() {
  board.forEach(function (row, y) {
    row.forEach(function (value, x) {
      board[y][x] = EMPTY_BLOCK;
    });
  });
}

function drop() {
  dropPiece();
  clearBoard();
  drawPiece();
  drawGhostPiece();
  drawBoard();
  setTimeout(drop, 1000);
}

function movePieceLeft() {
  currentPiece.x -= 1;
  if (collides(board, currentPiece)) {
    currentPiece.x += 1;
  }
}
  
function movePieceRight() {
  currentPiece.x += 1;
  if (collides(board, currentPiece)) {
    currentPiece.x -= 1;
  }
}

function rotatePiece() {
  let blocks = currentPiece.blocks;
  let newBlocks = [];
  for (let row = 0; row < blocks.length; row++) {
    newBlocks[row] = [];
    for (let col = 0; col < blocks.length; col++) {
      newBlocks[row][col] = blocks[blocks.length - col - 1][row];
    }
  }
  currentPiece.blocks = newBlocks;
  if (collides(board, currentPiece)) {
    currentPiece.blocks = blocks;
  }
}

function hardDrop() {
  while (!collides(board, currentPiece)) {
    currentPiece.y += 1;
  }
  currentPiece.y -= 1;
  dropPiece();
}

document.addEventListener('keydown', function (event) {
  if (event.code === 'ArrowLeft') {
    movePieceLeft();
  } else if (event.code === 'ArrowRight') {
    movePieceRight();
  } else if (event.code === 'ArrowUp') {
    rotatePiece();
  } else if (event.code === 'ArrowDown') {
    dropPiece();
  } else if (event.code === 'Space') {
    hardDrop();
  }
});

currentPiece.blocks = randomPiece();
drop();
currentPiece.blocks = randomPiece();

function randomPiece() {
  let pieces = [    [      [1, 1],
      [1, 1]
    ],
    [      [1, 1, 0],
      [0, 1, 1]
    ],
    [      [0, 1, 1],
      [1, 1, 0]
    ],
    [      [1, 1, 1, 1]
    ],
    [      [1, 1, 1],
      [0, 1, 0]
    ],
    [      [0, 1, 0],
      [1, 1, 1]
    ],
    [      [1, 0, 0],
      [1, 1, 1]
    ]
  ];
  let randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}

// add score counter
let score = 0;

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height - 50);
}

function updateScore(linesCleared) {
  if (linesCleared > 0) {
    if (linesCleared === 1) {
      score += 100;
    } else if (linesCleared === 2) {
      score += 250;
    } else if (linesCleared === 3) {
      score += 500;
    } else if (linesCleared === 4) {
      score += 1000;
    }
    drawScore();
  }
}

// check for lines cleared
function checkForLines() {
  let linesCleared = 0;
  for (let row = 0; row < ROWS; row++) {
    if (board[row].every(block => block !== EMPTY_BLOCK)) {
      board.splice(row, 1);
      board.unshift(new Array(COLS).fill(EMPTY_BLOCK));
      linesCleared++;
    }
  }
  updateScore(linesCleared);
}

// game over function
function gameOver() {
  clearInterval(intervalId);
  ctx.font = "48px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

// game loop
let intervalId = null;

function startGame() {
  clearBoard();
  score = 0;
  drawScore();
  currentPiece = {
    x: 0,
    y: 0,
    blocks: randomPiece()
  };
  intervalId = setInterval(function () {
    dropPiece();
    clearBoard();
    drawPiece();
    drawGhostPiece();
    drawBoard();
    checkForLines();
    if (collides(board, currentPiece)) {
      clearInterval(intervalId);
      gameOver();
    }
  }, 1000);
}

// start game on button press
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
function startGame() {
  // initialize the game board and current piece
  gameBoard = new Array(boardWidth * boardHeight).fill(0);
  currentPiece = { blocks: randomPiece(), x: 3, y: 0 };

  // set the game state to "playing"
  gameState = "playing";

  // set the timer interval to move the piece down every 500 milliseconds
  timer = setInterval(moveDown, 500);

  // hide the start button
  startButton.style.display = "none";
}

function startGame() {
  // reset the board
  board = new Board();
  
  // create a new piece and add it to the board
  currentPiece = new Piece(randomPiece());
  board.addPiece(currentPiece);

  // start the game loop
  gameLoopInterval = setInterval(gameLoop, GAME_LOOP_TIME);

  // hide the start button and show the pause button
  startButton.style.display = "none";
  pauseButton.style.display = "block";
}

// add event listener to pause button
pauseButton.addEventListener("click", pauseGame);

function pauseGame() {
  // pause the game loop
  clearInterval(gameLoopInterval);

  // hide the pause button and show the start button
  pauseButton.style.display = "none";
  startButton.style.display = "block";
}