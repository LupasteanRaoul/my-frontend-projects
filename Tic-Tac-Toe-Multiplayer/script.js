// Game state
let gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true,
    gameMode: 'player', // 'player' or 'ai'
    aiDifficulty: 'medium', // 'easy', 'medium', 'hard'
    scores: { X: 0, O: 0, draw: 0 },
    aiThinking: false
  };
  
  // Winning combinations
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  // DOM elements
  const boardElement = document.getElementById('board');
  const statusElement = document.getElementById('status');
  const aiThinkingElement = document.getElementById('ai-thinking');
  const scoreXElement = document.getElementById('scoreX');
  const scoreOElement = document.getElementById('scoreO');
  const scoreDrawElement = document.getElementById('scoreDraw');
  const resetBtn = document.getElementById('reset-btn');
  const scoreResetBtn = document.getElementById('score-reset-btn');
  
  // Mode buttons
  const modePlayerBtn = document.getElementById('mode-player');
  const modeAiBtn = document.getElementById('mode-ai');
  const aiControls = document.getElementById('ai-controls');
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  
  // Initialize game
  function initGame() {
    loadScores();
    setupBoard();
    setupEventListeners();
    updateStatus();
    updateScoreDisplay();
  }
 
// ===== GAME MODE MANAGEMENT =====

// Initialize game mode
function initGameModes() {
  // Mode selector buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          const mode = this.dataset.mode;
          changeGameMode(mode);
      });
  });
  
  // Online controls
  document.getElementById('createRoomBtn').addEventListener('click', createRoomHandler);
  document.getElementById('joinRoomBtn').addEventListener('click', joinRoomHandler);
  document.getElementById('leaveRoomBtn').addEventListener('click', leaveRoomHandler);
  
  // Initialize with AI mode
  changeGameMode('ai');
}

// Change game mode
function changeGameMode(mode) {
  // Update active button
  document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  // Update mode display
  document.getElementById('currentMode').textContent = 
      mode === 'ai' ? 'VS AI' : 
      mode === 'local' ? '2 Players Local' : 
      'Online Multiplayer';
  
  // Update global mode
  if (window.firebaseFunctions) {
      window.firebaseFunctions.setGameMode(mode);
  }
  
  // Show/hide online controls
  const onlineControls = document.querySelector('.online-controls');
  if (mode === 'online') {
      onlineControls.style.display = 'block';
  } else {
      onlineControls.style.display = 'none';
      
      // Leave room if in online mode
      if (window.firebaseFunctions && window.firebaseFunctions.leaveRoom) {
          window.firebaseFunctions.leaveRoom();
      }
  }
  
  // Reset game for new mode
  resetGame();
}

// Online room handlers
function createRoomHandler() {
  if (window.firebaseFunctions && window.firebaseFunctions.createRoom) {
      const roomCode = window.firebaseFunctions.createRoom();
      alert(`Room created! Code: ${roomCode}\nShare this code with your friend!`);
  }
}

function joinRoomHandler() {
  const roomCode = document.getElementById('roomCodeInput').value.trim();
  if (!roomCode) {
      alert('Please enter a room code!');
      return;
  }
  
  if (window.firebaseFunctions && window.firebaseFunctions.joinRoom) {
      window.firebaseFunctions.joinRoom(roomCode);
  }
}

function leaveRoomHandler() {
  if (window.firebaseFunctions && window.firebaseFunctions.leaveRoom) {
      window.firebaseFunctions.leaveRoom();
      document.querySelector('.room-info').style.display = 'none';
  }
}

// ===== MODIFY EXISTING GAME LOGIC =====

// Modify your existing cell click handler to support all modes
function handleCellClick(index) {
  // Check if cell is already occupied
  if (gameBoard[index] !== '') return;
  
  // Check if game is over
  if (checkWinner() || isBoardFull()) return;
  
  const gameMode = window.firebaseFunctions ? window.firebaseFunctions.getGameMode() : 'ai';
  
  // Handle different game modes
  if (gameMode === 'ai') {
      // Your existing AI logic
      gameBoard[index] = currentPlayer;
      updateBoard();
      
      if (!checkWinner() && !isBoardFull()) {
          // AI's turn
          setTimeout(makeAIMove, 500);
      }
      
  } else if (gameMode === 'local') {
      // Local 2 players
      gameBoard[index] = currentPlayer;
      updateBoard();
      
      if (!checkWinner() && !isBoardFull()) {
          // Switch player
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          updateGameStatus();
      }
      
  } else if (gameMode === 'online') {
      // Online multiplayer
      const playerSymbol = window.firebaseFunctions.getCurrentPlayerSymbol();
      
      // Only allow move if it's this player's turn
      // (You'll need to implement turn checking based on Firebase data)
      gameBoard[index] = playerSymbol;
      
      // Send move to Firebase
      if (window.firebaseFunctions.sendMoveToFirebase) {
          window.firebaseFunctions.sendMoveToFirebase(index, playerSymbol);
      }
      
      updateBoard();
  }
  
  // Check for winner
  const winner = checkWinner();
  if (winner) {
      handleWin(winner);
  } else if (isBoardFull()) {
      handleDraw();
  }
}

// Update game board from Firebase
function updateGameBoardFromFirebase(board) {
  gameBoard = [...board];
  updateBoard();
}

// Update current player from Firebase
function updateCurrentPlayerFromFirebase(player) {
  currentPlayer = player;
  updateGameStatus();
}

// Check winner from Firebase
function checkWinnerFromFirebase(winner) {
  if (winner && winner !== 'draw') {
      handleWin(winner);
  } else if (winner === 'draw') {
      handleDraw();
  }
}

// Expose functions to global scope for Firebase
window.updateGameBoard = updateGameBoardFromFirebase;
window.updateCurrentPlayer = updateCurrentPlayerFromFirebase;
window.checkWinnerFromFirebase = checkWinnerFromFirebase;
window.checkWinnerFunction = checkWinner;

// ===== INITIALIZE EVERYTHING =====
// Call this when your game loads
document.addEventListener('DOMContentLoaded', function() {
  // Your existing initialization code...
  
  // Add mode initialization
  initGameModes();
  
  // Initialize Firebase functions
  if (typeof firebase !== 'undefined') {
      console.log('Firebase loaded successfully!');
  }
});

  // Setup the game board
  function setupBoard() {
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        
        // Add visual hint for next move
        const hint = document.createElement('span');
        hint.className = `hint hint-${gameState.currentPlayer.toLowerCase()}`;
        hint.innerHTML = gameState.currentPlayer === 'X' ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="far fa-circle"></i>';
        cell.appendChild(hint);
        
        boardElement.appendChild(cell);
    }
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Mode buttons
    modePlayerBtn.addEventListener('click', () => {
        setGameMode('player');
        resetGame();
    });
    
    modeAiBtn.addEventListener('click', () => {
        setGameMode('ai');
        resetGame();
    });
    
    // Difficulty buttons
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setDifficulty(btn.dataset.difficulty);
        });
    });
    
    // Action buttons
    resetBtn.addEventListener('click', resetGame);
    scoreResetBtn.addEventListener('click', resetScores);
  }
  
  // Set game mode
  function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // Update UI
    if (mode === 'player') {
        modePlayerBtn.classList.add('active');
        modeAiBtn.classList.remove('active');
        aiControls.style.display = 'none';
    } else {
        modePlayerBtn.classList.remove('active');
        modeAiBtn.classList.add('active');
        aiControls.style.display = 'block';
    }
  }
  
  // Set AI difficulty
  function setDifficulty(difficulty) {
    gameState.aiDifficulty = difficulty;
    
    // Update UI
    difficultyBtns.forEach(btn => {
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
  }
  
  // Handle cell click
  function handleCellClick(index) {
    // Check if move is valid
    if (!gameState.gameActive || 
        gameState.board[index] !== '' || 
        gameState.aiThinking ||
        (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O')) {
        return;
    }
    
    // Make the move
    makeMove(index, gameState.currentPlayer);
    
    // Check for game end
    const winner = checkWinner();
    if (winner) {
        handleWin(winner);
        return;
    }
    
    if (checkDraw()) {
        handleDraw();
        return;
    }
    
    // Switch player
    switchPlayer();
    
    // If AI's turn, make AI move
    if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
        makeAiMove();
    }
  }
  
  // Make a move on the board
  function makeMove(index, player) {
    gameState.board[index] = player;
    
    // Update UI
    const cell = boardElement.children[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    // Remove hint
    const hint = cell.querySelector('.hint');
    if (hint) {
        hint.remove();
    }
    
    // Add hints to empty cells
    updateHints();
  }
  
  // Update hints on empty cells
  function updateHints() {
    const cells = boardElement.children;
    for (let i = 0; i < cells.length; i++) {
        if (gameState.board[i] === '') {
            let hint = cells[i].querySelector('.hint');
            if (!hint) {
                hint = document.createElement('span');
                hint.className = `hint hint-${gameState.currentPlayer.toLowerCase()}`;
                cells[i].appendChild(hint);
            }
            hint.innerHTML = gameState.currentPlayer === 'X' ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="far fa-circle"></i>';
        }
    }
  }
  
  // Switch current player
  function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
  
  // Make AI move
  function makeAiMove() {
    if (!gameState.gameActive) return;
    
    // Show thinking indicator
    gameState.aiThinking = true;
    aiThinkingElement.style.display = 'block';
    
    // AI makes move after delay
    setTimeout(() => {
        let aiMove;
        
        switch (gameState.aiDifficulty) {
            case 'easy':
                aiMove = getEasyAiMove();
                break;
            case 'medium':
                aiMove = getMediumAiMove();
                break;
            case 'hard':
                aiMove = getHardAiMove();
                break;
            default:
                aiMove = getMediumAiMove();
        }
        
        if (aiMove !== -1) {
            makeMove(aiMove, 'O');
            
            // Check for game end
            const winner = checkWinner();
            if (winner) {
                handleWin(winner);
                gameState.aiThinking = false;
                aiThinkingElement.style.display = 'none';
                return;
            }
            
            if (checkDraw()) {
                handleDraw();
                gameState.aiThinking = false;
                aiThinkingElement.style.display = 'none';
                return;
            }
            
            switchPlayer();
        }
        
        gameState.aiThinking = false;
        aiThinkingElement.style.display = 'none';
    }, 500);
  }
  
  // Easy AI: Random move
  function getEasyAiMove() {
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (gameState.board[i] === '') {
            availableMoves.push(i);
        }
    }
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return -1;
  }
  
  // Medium AI: Try to win or block
  function getMediumAiMove() {
    // Try to win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const board = gameState.board;
        
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
    }
    
    // Try to block player
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const board = gameState.board;
        
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
    }
    
    // Take center if available
    if (gameState.board[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => gameState.board[corner] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return getEasyAiMove();
  }
  
  // Hard AI: Minimax algorithm
  function getHardAiMove() {
    const result = minimax(gameState.board, 'O');
    return result.index;
  }
  
  function minimax(board, player) {
    const availableMoves = board.map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    // Check for terminal state
    const winner = checkWinnerForBoard(board);
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };
    
    const moves = [];
    
    for (let move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = player;
        
        const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
        moves.push({
            index: move,
            score: result.score
        });
    }
    
    // Choose best move
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    
    return bestMove;
  }
  
  // Check winner for a specific board state (for minimax)
  function checkWinnerForBoard(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
  }
  
  // Check for winner
  function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            return {
                winner: gameState.board[a],
                pattern: pattern
            };
        }
    }
    return null;
  }
  
  // Check for draw
  function checkDraw() {
    return gameState.board.every(cell => cell !== '');
  }
  
  // Handle win
  function handleWin(winnerInfo) {
    gameState.gameActive = false;
    gameState.scores[winnerInfo.winner]++;
    
    // Highlight winning cells
    winnerInfo.pattern.forEach(index => {
        boardElement.children[index].classList.add('win');
    });
    
    // Update status
    statusElement.textContent = `Player ${winnerInfo.winner} Wins!`;
    
    saveScores();
    updateScoreDisplay();
  }
  
  // Handle draw
  function handleDraw() {
    gameState.gameActive = false;
    gameState.scores.draw++;
    
    statusElement.textContent = "It's a Draw!";
    
    saveScores();
    updateScoreDisplay();
  }
  
  // Reset game
  function resetGame() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    gameState.aiThinking = false;
    aiThinkingElement.style.display = 'none';
    
    // Clear board UI
    const cells = boardElement.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].className = 'cell';
        cells[i].classList.remove('x', 'o', 'win');
    }
    
    // Re-add hints
    updateHints();
    updateStatus();
  }
  
  // Reset scores
  function resetScores() {
    gameState.scores = { X: 0, O: 0, draw: 0 };
    localStorage.removeItem('ticTacToeScores');
    updateScoreDisplay();
  }
  
  // Update status display
  function updateStatus() {
    if (!gameState.gameActive) return;
    
    if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'O') {
        statusElement.textContent = "AI's Turn";
    } else {
        statusElement.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
  }
  
  // Update score display
  function updateScoreDisplay() {
    scoreXElement.textContent = gameState.scores.X;
    scoreOElement.textContent = gameState.scores.O;
    scoreDrawElement.textContent = gameState.scores.draw;
  }
  
  // Load scores from localStorage
  function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        gameState.scores = JSON.parse(savedScores);
    }
  }
  
  // Save scores to localStorage
  function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(gameState.scores));
  }
  
  // Initialize the game when page loads
  document.addEventListener('DOMContentLoaded', initGame);