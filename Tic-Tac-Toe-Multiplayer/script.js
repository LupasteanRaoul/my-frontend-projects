// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
    apiKey: "AIzaSyCwVqJLn2uiPsdDsvDX3eywyVp-6_gcyWI",
    authDomain: "tic-tac-toe-multiplayer-9c961.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-multiplayer-9c961-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tic-tac-toe-multiplayer-9c961",
    storageBucket: "tic-tac-toe-multiplayer-9c961.firebasestorage.app",
    messagingSenderId: "711843674854",
    appId: "1:711843674854:web:8c470fdd91c0841d945927",
    measurementId: "G-9TCHMSCWM2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===== GAME STATE VARIABLES =====
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'ai'; // 'ai', 'local', 'online'
let aiDifficulty = 'medium'; // 'easy', 'medium', 'hard'
let scores = { X: 0, O: 0, draw: 0 };
let aiThinking = false;

// Online multiplayer variables
let currentRoomId = null;
let playerId = null;
let isHost = false;
let playerSymbol = 'X';
let opponentConnected = false;
let currentRoomData = null;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

// DOM Elements
const boardElement = document.getElementById('board');
const statusMessage = document.getElementById('statusMessage');
const currentModeElement = document.getElementById('currentMode');
const currentPlayerElement = document.getElementById('currentPlayer');
const aiThinkingElement = document.getElementById('ai-thinking');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');
const resetBtn = document.getElementById('reset-btn');
const scoreResetBtn = document.getElementById('score-reset-btn');
const aiControls = document.getElementById('ai-controls');

// Mode buttons
const modeButtons = document.querySelectorAll('.mode-btn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Online elements
const onlineControls = document.querySelector('.online-controls');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const roomCodeInput = document.getElementById('roomCodeInput');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomStatus = document.getElementById('roomStatus');
const roomInfo = document.querySelector('.room-info');

// ===== GAME INITIALIZATION =====
function initGame() {
    loadScores();
    setupBoard();
    setupEventListeners();
    updateGameStatus();
    updateScoreDisplay();
}

// ===== BOARD SETUP =====
function setupBoard() {
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        
        // Add current cell content
        if (gameBoard[i]) {
            cell.textContent = gameBoard[i];
            cell.classList.add(gameBoard[i].toLowerCase());
        }
        
        boardElement.appendChild(cell);
    }
    updateHints();
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Mode selection
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            changeGameMode(mode);
        });
    });
    
    // Difficulty selection
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            setAiDifficulty(difficulty);
        });
    });
    
    // Action buttons
    resetBtn.addEventListener('click', resetGame);
    scoreResetBtn.addEventListener('click', resetScores);
    
    // Online buttons
    createRoomBtn.addEventListener('click', createRoom);
    joinRoomBtn.addEventListener('click', joinRoom);
    leaveRoomBtn.addEventListener('click', leaveRoom);
}

// ===== GAME MODE MANAGEMENT =====
function changeGameMode(mode) {
    // Update UI
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update mode display
    const modeText = mode === 'ai' ? 'VS AI' : 
                     mode === 'local' ? '2 Players Local' : 
                     'Online Multiplayer';
    currentModeElement.textContent = modeText;
    
    // Show/hide AI controls
    if (mode === 'ai') {
        aiControls.style.display = 'block';
    } else {
        aiControls.style.display = 'none';
    }
    
    // Show/hide online controls
    if (mode === 'online') {
        onlineControls.style.display = 'block';
    } else {
        onlineControls.style.display = 'none';
        // Leave room if we're in online mode
        if (currentRoomId) {
            leaveRoom();
        }
    }
    
    // Update game mode
    gameMode = mode;
    
    // Reset game for new mode
    resetGame();
}

// ===== AI DIFFICULTY =====
function setAiDifficulty(difficulty) {
    aiDifficulty = difficulty;
    
    // Update UI
    difficultyButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

// ===== GAME LOGIC =====
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '' || aiThinking) {
        return;
    }
    
    // Handle different game modes
    if (gameMode === 'online') {
        handleOnlineMove(index);
        return;
    }
    
    // AI and Local modes
    if (gameMode === 'ai' && currentPlayer === 'O') {
        return; // AI's turn, player can't click
    }
    
    makeMove(index, currentPlayer);
    checkGameStatus();
    
    if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
        aiThinking = true;
        aiThinkingElement.style.display = 'flex';
        setTimeout(() => {
            makeAiMove();
            aiThinking = false;
            aiThinkingElement.style.display = 'none';
            checkGameStatus();
        }, 600);
    }
}

function handleOnlineMove(index) {
    if (!currentRoomId || !gameActive || gameBoard[index] !== '') {
        return;
    }
    
    // Check if it's this player's turn
    if (currentRoomData && currentRoomData.currentPlayer !== playerSymbol) {
        statusMessage.textContent = "Wait for opponent's turn!";
        return;
    }
    
    sendMoveToFirebase(index, playerSymbol);
}

function makeMove(index, player) {
    gameBoard[index] = player;
    
    // Update UI
    const cell = boardElement.children[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    // Switch player
    currentPlayer = player === 'X' ? 'O' : 'X';
    
    updateBoardUI();
    updateGameStatus();
}

function checkGameStatus() {
    const winner = checkWinner();
    if (winner) {
        handleWin(winner.winner, winner.pattern);
        return;
    }
    
    if (checkDraw()) {
        handleDraw();
        return;
    }
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]) {
            return {
                winner: gameBoard[a],
                pattern: pattern
            };
        }
    }
    return null;
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function handleWin(winner, pattern) {
    gameActive = false;
    scores[winner]++;
    
    // Highlight winning cells
    if (pattern) {
        pattern.forEach(index => {
            boardElement.children[index].classList.add('win');
        });
    }
    
    statusMessage.textContent = `Player ${winner} Wins!`;
    saveScores();
    updateScoreDisplay();
    
    // Update online room
    if (gameMode === 'online' && currentRoomId) {
        updateRoomWinner(winner);
    }
}

function handleDraw() {
    gameActive = false;
    scores.draw++;
    
    statusMessage.textContent = "It's a Draw!";
    saveScores();
    updateScoreDisplay();
    
    // Update online room
    if (gameMode === 'online' && currentRoomId) {
        updateRoomWinner('draw');
    }
}

// ===== AI LOGIC =====
function makeAiMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    
    let moveIndex;
    
    switch (aiDifficulty) {
        case 'easy':
            moveIndex = getEasyAiMove();
            break;
        case 'medium':
            moveIndex = getMediumAiMove();
            break;
        case 'hard':
            moveIndex = getHardAiMove();
            break;
        default:
            moveIndex = getMediumAiMove();
    }
    
    if (moveIndex !== -1) {
        makeMove(moveIndex, 'O');
    }
}

function getEasyAiMove() {
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            availableMoves.push(i);
        }
    }
    return availableMoves.length > 0 ? 
        availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
}

function getMediumAiMove() {
    // Try to win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const board = gameBoard;
        
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
    }
    
    // Try to block player
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const board = gameBoard;
        
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
    }
    
    // Take center
    if (gameBoard[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => gameBoard[corner] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return getEasyAiMove();
}

function getHardAiMove() {
    return minimax(gameBoard, 'O').index;
}

function minimax(board, player) {
    const availableMoves = board.map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    // Check terminal states
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

function checkWinnerForBoard(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// ===== ONLINE MULTIPLAYER FUNCTIONS =====
function generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function createRoom() {
    currentRoomId = generateRoomCode();
    playerId = generatePlayerId();
    isHost = true;
    playerSymbol = 'X';
    opponentConnected = false;
    
    // Create room in Firebase
    database.ref('rooms/' + currentRoomId).set({
        host: playerId,
        playerX: playerId,
        playerO: null,
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        status: 'waiting',
        winner: null,
        createdAt: Date.now(),
        lastUpdate: Date.now()
    });
    
    // Listen to room updates
    listenToRoom();
    
    // Update UI
    roomCodeDisplay.textContent = currentRoomId;
    roomStatus.textContent = 'Waiting for opponent...';
    roomInfo.style.display = 'block';
    statusMessage.textContent = 'Room created! Share the code with your friend.';
    
    return currentRoomId;
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        alert('Please enter a room code!');
        return;
    }
    
    currentRoomId = roomCode;
    playerId = generatePlayerId();
    isHost = false;
    
    const roomRef = database.ref('rooms/' + roomCode);
    
    roomRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            alert('Room not found!');
            return;
        }
        
        const room = snapshot.val();
        
        if (room.status === 'playing' && room.playerO) {
            alert('Room is full!');
            return;
        }
        
        playerSymbol = 'O';
        
        roomRef.update({
            playerO: playerId,
            status: 'playing',
            lastUpdate: Date.now()
        });
        
        // Listen to room updates
        listenToRoom();
        
        // Update UI
        roomCodeDisplay.textContent = currentRoomId;
        roomStatus.textContent = 'Connected! Game starting...';
        roomInfo.style.display = 'block';
        statusMessage.textContent = 'Joined room! Waiting for host to start...';
        
        opponentConnected = true;
    }).catch(error => {
        console.error('Error joining room:', error);
        alert('Error joining room!');
    });
}

function listenToRoom() {
    const roomRef = database.ref('rooms/' + currentRoomId);
    
    roomRef.on('value', snapshot => {
        if (!snapshot.exists()) {
            // Room was deleted
            if (gameMode === 'online') {
                alert('Room was closed by host!');
                leaveRoom();
            }
            return;
        }
        
        const room = snapshot.val();
        currentRoomData = room;
        
        // Update game board
        if (room.board && JSON.stringify(room.board) !== JSON.stringify(gameBoard)) {
            gameBoard = [...room.board];
            updateBoardUI();
            updateHints();
        }
        
        // Update current player
        if (room.currentPlayer && room.currentPlayer !== currentPlayer) {
            currentPlayer = room.currentPlayer;
            updateGameStatus();
        }
        
        // Check for winner
        if (room.winner && gameActive) {
            gameActive = false;
            if (room.winner === 'draw') {
                handleDraw();
            } else {
                handleWin(room.winner);
            }
        }
        
        // Update status
        updateRoomStatus(room);
    });
}

function sendMoveToFirebase(index, player) {
    if (!currentRoomId || !gameActive) return;
    
    const roomRef = database.ref('rooms/' + currentRoomId);
    
    roomRef.once('value').then(snapshot => {
        const room = snapshot.val();
        if (!room) return;
        
        // Check if it's player's turn
        if (room.currentPlayer !== player) return;
        
        // Check if cell is empty
        if (room.board[index] !== '') return;
        
        const newBoard = [...room.board];
        newBoard[index] = player;
        
        const nextPlayer = player === 'X' ? 'O' : 'X';
        
        // Check for winner
        let winner = checkWinnerForBoard(newBoard);
        let isDraw = newBoard.every(cell => cell !== '') && !winner;
        
        roomRef.update({
            board: newBoard,
            currentPlayer: nextPlayer,
            winner: winner || (isDraw ? 'draw' : null),
            status: winner || isDraw ? 'finished' : 'playing',
            lastUpdate: Date.now()
        });
    }).catch(error => console.error('Error sending move:', error));
}

function updateRoomWinner(winner) {
    if (!currentRoomId) return;
    
    const roomRef = database.ref('rooms/' + currentRoomId);
    roomRef.update({
        winner: winner,
        status: 'finished',
        lastUpdate: Date.now()
    });
}

function updateRoomStatus(room) {
    if (!room) return;
    
    let statusText = '';
    if (room.status === 'waiting') {
        statusText = 'Waiting for opponent...';
    } else if (room.status === 'playing') {
        if (room.playerX && room.playerO) {
            statusText = 'Game in progress';
        } else {
            statusText = 'Waiting for opponent...';
        }
    } else if (room.status === 'finished') {
        statusText = 'Game finished!';
    }
    
    roomStatus.textContent = statusText;
}

function leaveRoom() {
    if (!currentRoomId) return;
    
    const roomRef = database.ref('rooms/' + currentRoomId);
    
    if (isHost) {
        // Host leaves - delete room
        roomRef.remove();
    } else {
        // Player leaves - remove from room
        roomRef.update({
            playerO: null,
            status: 'waiting',
            lastUpdate: Date.now()
        });
    }
    
    // Clean up
    currentRoomId = null;
    playerId = null;
    isHost = false;
    playerSymbol = 'X';
    opponentConnected = false;
    currentRoomData = null;
    
    // Update UI
    roomInfo.style.display = 'none';
    roomCodeInput.value = '';
    
    // Reset game
    if (gameMode === 'online') {
        resetGame();
    }
}

// ===== UI UPDATES =====
function updateBoardUI() {
    const cells = boardElement.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = gameBoard[i];
        cells[i].className = 'cell';
        if (gameBoard[i]) {
            cells[i].classList.add(gameBoard[i].toLowerCase());
        }
    }
}

function updateHints() {
    const cells = boardElement.children;
    for (let i = 0; i < cells.length; i++) {
        let hint = cells[i].querySelector('.hint');
        
        // Remove old hint
        if (hint) {
            hint.remove();
        }
        
        // Add new hint if cell is empty and game is active
        if (gameBoard[i] === '' && gameActive) {
            hint = document.createElement('span');
            hint.className = `hint hint-${currentPlayer.toLowerCase()}`;
            hint.innerHTML = currentPlayer === 'X' ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="far fa-circle"></i>';
            cells[i].appendChild(hint);
        }
    }
}

function updateGameStatus() {
    currentPlayerElement.textContent = currentPlayer;
    
    if (!gameActive) return;
    
    if (gameMode === 'online') {
        if (currentRoomData && currentRoomData.currentPlayer === playerSymbol) {
            statusMessage.textContent = "Your turn!";
        } else {
            statusMessage.textContent = "Opponent's turn...";
        }
    } else if (gameMode === 'ai') {
        if (currentPlayer === 'O') {
            statusMessage.textContent = "AI's Turn";
        } else {
            statusMessage.textContent = "Your Turn (X)";
        }
    } else {
        statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function updateScoreDisplay() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.draw;
}

// ===== GAME CONTROL =====
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    aiThinking = false;
    aiThinkingElement.style.display = 'none';
    
    // Clear online room state if needed
    if (gameMode === 'online' && currentRoomId && isHost) {
        const roomRef = database.ref('rooms/' + currentRoomId);
        roomRef.update({
            board: ['', '', '', '', '', '', '', '', ''],
            currentPlayer: 'X',
            winner: null,
            status: 'playing',
            lastUpdate: Date.now()
        });
    }
    
    setupBoard();
    updateGameStatus();
}

function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    localStorage.removeItem('ticTacToeScores');
    updateScoreDisplay();
}

// ===== LOCAL STORAGE =====
function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
}

function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

// ===== INITIALIZE GAME =====
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});