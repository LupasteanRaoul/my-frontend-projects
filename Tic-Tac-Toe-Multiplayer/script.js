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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===== GAME STATE VARIABLES =====
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'ai';
let aiDifficulty = 'medium';
let aiThinking = false;
let moveCount = 0;

// Current user (mandatory)
let currentUserName = '';

// Player names for display
let playerXName = 'Player X';
let playerOName = 'AI';

// Timer state
let timerEnabled = false;
let timerInterval = null;
let timerValue = 30;
const TIMER_DURATION = 30;

// Online state
let roomId = null;
let playerId = null;
let playerSymbol = 'X';
let isHost = false;
let roomListener = null;
let rematchRequestedBy = null;
let lastProcessedRematchState = null;

// Scores and stats (LOCAL per player - not shared in online mode)
let scores = JSON.parse(localStorage.getItem('ttt_scores')) || { X: 0, O: 0, draw: 0 };
let stats = JSON.parse(localStorage.getItem('ttt_stats')) || {
    totalWins: 0, totalLosses: 0, totalDraws: 0, hardAiWins: 0,
    perfectWins: 0, maxStreak: 0, currentStreak: 0, onlineWins: 0,
    quickWins: 0, comebackWins: 0, gamesPlayed: 0
};
let unlockedAchievements = JSON.parse(localStorage.getItem('ttt_achievements')) || [];
let gameHistory = JSON.parse(localStorage.getItem('ttt_history')) || [];
let soundEnabled = localStorage.getItem('ttt_sound') !== 'false';

// Audio context
let audioContext = null;

// Winning patterns
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Achievements (LOCAL only - per device)
const ACHIEVEMENTS = [
    { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: 'fa-trophy', color: '#fbbf24', check: (s) => s.totalWins >= 1 },
    { id: 'five_wins', name: 'Rising Star', description: 'Win 5 games', icon: 'fa-star', color: '#f472b6', check: (s) => s.totalWins >= 5 },
    { id: 'ten_wins', name: 'Champion', description: 'Win 10 games', icon: 'fa-crown', color: '#a78bfa', check: (s) => s.totalWins >= 10 },
    { id: 'twenty_wins', name: 'Legend', description: 'Win 20 games', icon: 'fa-fire', color: '#f97316', check: (s) => s.totalWins >= 20 },
    { id: 'ai_slayer', name: 'AI Slayer', description: 'Beat Hard AI', icon: 'fa-robot', color: '#22d3ee', check: (s) => s.hardAiWins >= 1 },
    { id: 'ai_master', name: 'AI Master', description: 'Beat Hard AI 5 times', icon: 'fa-bolt', color: '#4ade80', check: (s) => s.hardAiWins >= 5 },
    { id: 'perfect_game', name: 'Perfect Strategy', description: 'Win without opponent getting 2 in a row', icon: 'fa-bullseye', color: '#ec4899', check: (s) => s.perfectWins >= 1 },
    { id: 'streak_3', name: 'Hot Streak', description: 'Win 3 games in a row', icon: 'fa-fire-flame-curved', color: '#ef4444', check: (s) => s.maxStreak >= 3 },
    { id: 'streak_5', name: 'Unstoppable', description: 'Win 5 games in a row', icon: 'fa-medal', color: '#eab308', check: (s) => s.maxStreak >= 5 },
    { id: 'online_win', name: 'Global Player', description: 'Win an online match', icon: 'fa-globe', color: '#06b6d4', check: (s) => s.onlineWins >= 1 },
    { id: 'quick_win', name: 'Speed Demon', description: 'Win in 5 moves or less', icon: 'fa-clock', color: '#8b5cf6', check: (s) => s.quickWins >= 1 },
    { id: 'comeback', name: 'Comeback King', description: 'Win after opponent had 2 in a row', icon: 'fa-heart', color: '#f43f5e', check: (s) => s.comebackWins >= 1 },
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if user already has a name saved
    const savedName = localStorage.getItem('ttt_current_user');
    if (savedName) {
        currentUserName = savedName;
        showMainGame();
    }
    
    // Enter key for name input
    document.getElementById('initialNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitInitialName();
        }
    });
    
    // Enter key for room input
    document.getElementById('roomInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinRoom();
        }
    });
    
    // Player O name change listener
    document.getElementById('playerOName').addEventListener('change', () => {
        const oName = document.getElementById('playerOName').value.trim();
        if (oName) {
            playerOName = oName;
            updateScoreLabels();
        }
    });
});

// ===== NAME ENTRY =====
function submitInitialName() {
    const nameInput = document.getElementById('initialNameInput');
    const name = nameInput.value.trim();
    const errorEl = document.getElementById('nameError');
    
    if (!name) {
        errorEl.style.display = 'block';
        nameInput.focus();
        return;
    }
    
    errorEl.style.display = 'none';
    currentUserName = name;
    localStorage.setItem('ttt_current_user', name);
    
    // Update leaderboard with this player
    updateLeaderboardEntry();
    
    showMainGame();
}

function showMainGame() {
    document.getElementById('nameEntryModal').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('currentUserName').textContent = currentUserName;
    
    // Set player X name to current user
    playerXName = currentUserName;
    
    initBoard();
    updateUI();
    renderAchievements();
    renderHistory();
    loadLeaderboard();
}

function initBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.dataset.testid = `cell-${i}`;
        cell.addEventListener('click', () => handleCellClick(i));
        cell.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleCellClick(i);
        });
        boardEl.appendChild(cell);
    }
    updateBoardUI();
}

// ===== LEADERBOARD =====
function updateLeaderboardEntry() {
    if (!currentUserName) return;
    
    const leaderboardRef = database.ref('leaderboard/' + sanitizeKey(currentUserName));
    leaderboardRef.once('value').then(snap => {
        if (!snap.exists()) {
            // Create new entry
            leaderboardRef.set({
                name: currentUserName,
                wins: 0,
                bestStreak: 0,
                gamesPlayed: 0,
                lastUpdated: Date.now()
            });
        }
    }).catch(err => {
        console.log('Leaderboard access error - check Firebase rules');
    });
}

function updateLeaderboardStats(won, currentStreak) {
    if (!currentUserName) return;
    
    const leaderboardRef = database.ref('leaderboard/' + sanitizeKey(currentUserName));
    leaderboardRef.once('value').then(snap => {
        const data = snap.val() || { wins: 0, bestStreak: 0, gamesPlayed: 0 };
        const updates = {
            name: currentUserName,
            wins: (data.wins || 0) + (won ? 1 : 0),
            bestStreak: Math.max(data.bestStreak || 0, currentStreak),
            gamesPlayed: (data.gamesPlayed || 0) + 1,
            lastUpdated: Date.now()
        };
        leaderboardRef.set(updates);
    });
}

function sanitizeKey(name) {
    // Firebase keys can't contain . $ # [ ] /
    return name.replace(/[.$#\[\]\/]/g, '_');
}

function loadLeaderboard() {
    database.ref('leaderboard').orderByChild('wins').limitToLast(50).on('value', snap => {
        const data = snap.val();
        renderLeaderboards(data);
    }, err => {
        console.log('Leaderboard load error - check Firebase rules');
        document.getElementById('winsLeaderboard').innerHTML = '<p class="leaderboard-empty">Unable to load leaderboard. Check Firebase rules.</p>';
        document.getElementById('streakLeaderboard').innerHTML = '<p class="leaderboard-empty">Unable to load leaderboard. Check Firebase rules.</p>';
    });
}

function renderLeaderboards(data) {
    if (!data) {
        document.getElementById('winsLeaderboard').innerHTML = '<p class="leaderboard-empty">No players yet. Be the first!</p>';
        document.getElementById('streakLeaderboard').innerHTML = '<p class="leaderboard-empty">No players yet. Be the first!</p>';
        return;
    }
    
    const players = Object.values(data);
    
    // Sort by wins (descending)
    const byWins = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0));
    renderLeaderboardList('winsLeaderboard', byWins, 'wins');
    
    // Sort by best streak (descending)
    const byStreak = [...players].sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0));
    renderLeaderboardList('streakLeaderboard', byStreak, 'bestStreak');
}

function renderLeaderboardList(elementId, players, scoreField) {
    const container = document.getElementById(elementId);
    
    if (players.length === 0) {
        container.innerHTML = '<p class="leaderboard-empty">No players yet. Be the first!</p>';
        return;
    }
    
    container.innerHTML = players.map((player, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'normal';
        const isCurrentUser = player.name === currentUserName;
        const scoreValue = player[scoreField] || 0;
        const scoreLabel = scoreField === 'wins' ? 'wins' : 'streak';
        
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}" data-testid="leaderboard-item-${rank}">
                <div class="leaderboard-rank ${rankClass}">${rank}</div>
                <span class="leaderboard-name">${escapeHtml(player.name)}</span>
                <span class="leaderboard-score">${scoreValue} ${scoreLabel}</span>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    const chevron = document.getElementById('leaderboardChevron');
    const show = container.style.display === 'none';
    container.style.display = show ? 'block' : 'none';
    chevron.className = show ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
}

function switchLeaderboardTab(tab) {
    document.querySelectorAll('.leaderboard-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.getElementById('leaderboardWins').style.display = tab === 'wins' ? 'block' : 'none';
    document.getElementById('leaderboardStreak').style.display = tab === 'streak' ? 'block' : 'none';
}

// ===== SCORE LABELS =====
function updateScoreLabels() {
    document.getElementById('scoreXLabel').textContent = `${playerXName} Wins`;
    document.getElementById('scoreOLabel').textContent = `${playerOName} Wins`;
}

// ===== TIMER =====
function toggleTimer() {
    timerEnabled = !timerEnabled;
    const btn = document.getElementById('timerBtn');
    btn.classList.toggle('active', timerEnabled);
    
    if (timerEnabled) {
        document.getElementById('timerDisplay').style.display = 'flex';
        startTimer();
    } else {
        document.getElementById('timerDisplay').style.display = 'none';
        stopTimer();
    }
}

function startTimer() {
    if (!timerEnabled || !gameActive) return;
    stopTimer();
    timerValue = TIMER_DURATION;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timerValue--;
        updateTimerDisplay();
        
        if (timerValue <= 0) {
            handleTimerExpired();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    timerValue = TIMER_DURATION;
    updateTimerDisplay();
    if (timerEnabled && gameActive) {
        startTimer();
    }
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    const valueEl = document.getElementById('timerValue');
    valueEl.textContent = timerValue;
    
    display.classList.remove('warning', 'critical');
    if (timerValue <= 5) {
        display.classList.add('critical');
    } else if (timerValue <= 10) {
        display.classList.add('warning');
    }
}

function handleTimerExpired() {
    stopTimer();
    playSound('lose');
    
    if (gameMode === 'ai' && currentPlayer === 'X') {
        handleWin('O', null);
    } else if (gameMode === 'local') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateUI();
        startTimer();
    } else if (gameMode === 'online') {
        const loser = currentPlayer;
        const winner = loser === 'X' ? 'O' : 'X';
        
        if (currentPlayer === playerSymbol) {
            database.ref('rooms/' + roomId).update({
                winner: winner,
                status: 'finished',
                winReason: 'timeout'
            });
        }
    }
}

// ===== GAME MODE =====
function changeGameMode(mode) {
    if (roomId) leaveRoom();
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    gameMode = mode;
    document.getElementById('modeDisplay').textContent = 
        mode === 'ai' ? 'VS AI' : mode === 'local' ? '2 Players' : 'Online';
    
    document.getElementById('aiControls').style.display = mode === 'ai' ? 'flex' : 'none';
    document.getElementById('onlineControls').style.display = mode === 'online' ? 'block' : 'none';
    document.getElementById('playerOSetup').style.display = mode === 'local' ? 'block' : 'none';
    
    // Reset player names based on mode
    playerXName = currentUserName;
    if (mode === 'ai') {
        playerOName = 'AI';
    } else if (mode === 'local') {
        playerOName = document.getElementById('playerOName').value.trim() || 'Player O';
    } else {
        playerOName = 'Opponent';
    }
    
    updateScoreLabels();
    resetGame();
}

function setAiDifficulty(diff) {
    aiDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diff);
    });
}

// ===== CELL CLICK HANDLER =====
function handleCellClick(index) {
    if (!gameActive || board[index] !== '' || aiThinking) return;
    
    if (gameMode === 'online') {
        if (!roomId || currentPlayer !== playerSymbol) return;
        sendOnlineMove(index);
        return;
    }
    
    if (gameMode === 'local') {
        // Validate Player O name for local mode
        const oName = document.getElementById('playerOName').value.trim();
        if (!oName) {
            alert('Please enter Player O name before playing!');
            document.getElementById('playerOName').focus();
            return;
        }
        playerOName = oName;
        updateScoreLabels();
    }
    
    if (gameMode === 'ai' && currentPlayer === 'O') return;
    
    makeMove(index, currentPlayer);
}

function makeMove(index, player) {
    board[index] = player;
    moveCount++;
    playSound('move');
    updateBoardUI();
    
    if (timerEnabled) {
        resetTimer();
    }
    
    const winner = checkWinner();
    if (winner) {
        handleWin(winner.winner, winner.pattern);
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        handleDraw();
        return;
    }
    
    currentPlayer = player === 'X' ? 'O' : 'X';
    updateUI();
    
    // AI move
if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
    aiThinking = true;
    updateBoardUI();
    updateUI();
    setTimeout(() => {
        const move = getAiMove();
        if (move !== -1) makeMove(move, 'O');
        aiThinking = false;
        updateBoardUI();
        updateUI();
    }, 600);
}
}

// ===== WINNER CHECK =====
function checkWinner() {
    for (const pattern of WIN_PATTERNS) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], pattern };
        }
    }
    return null;
}

function handleWin(winner, pattern) {
    gameActive = false;
    stopTimer();
    scores[winner]++;
    
    // Highlight winning cells
    if (pattern) {
        pattern.forEach(i => {
            document.querySelectorAll('.cell')[i].classList.add('winning');
        });
    }
    
    stats.gamesPlayed++;
    const historyEntry = { 
        date: new Date().toISOString(), 
        mode: gameMode, 
        difficulty: aiDifficulty, 
        result: winner, 
        moves: moveCount,
        playerX: playerXName,
        playerO: playerOName
    };
    
    let playerWon = false;
    
    if (gameMode === 'ai' && winner === 'X') {
        playerWon = true;
        stats.totalWins++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        if (aiDifficulty === 'hard') stats.hardAiWins++;
        if (moveCount <= 5) stats.quickWins++;
        playSound('win');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        checkAchievements(); // Only check for the winner
    } else if (gameMode === 'ai' && winner === 'O') {
        stats.totalLosses++;
        stats.currentStreak = 0;
        playSound('lose');
    } else if (gameMode === 'online') {
        if (winner === playerSymbol) {
            playerWon = true;
            stats.totalWins++;
            stats.onlineWins++;
            stats.currentStreak++;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
            if (moveCount <= 5) stats.quickWins++;
            playSound('win');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            checkAchievements(); // Only check for the winner
        } else {
            stats.totalLosses++;
            stats.currentStreak = 0;
            playSound('lose');
        }
    } else if (gameMode === 'local') {
        // In local mode, whoever won gets the achievement check
        if (winner === 'X') {
            playerWon = true;
            stats.totalWins++;
            stats.currentStreak++;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
            checkAchievements();
        } else {
            stats.currentStreak = 0;
        }
        playSound('win');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    
    // Update global leaderboard
    updateLeaderboardStats(playerWon, stats.currentStreak);
    
    gameHistory.unshift(historyEntry);
    saveData();
    updateUI();
    renderHistory();
}

function handleDraw() {
    gameActive = false;
    stopTimer();
    scores.draw++;
    stats.gamesPlayed++;
    stats.totalDraws++;
    
    const historyEntry = { 
        date: new Date().toISOString(), 
        mode: gameMode, 
        difficulty: aiDifficulty, 
        result: 'draw', 
        moves: moveCount,
        playerX: playerXName,
        playerO: playerOName
    };
    gameHistory.unshift(historyEntry);
    
    // Update leaderboard (no win, but game played)
    updateLeaderboardStats(false, 0);
    
    playSound('draw');
    saveData();
    updateUI();
    renderHistory();
}

// ===== AI LOGIC =====
function getAiMove() {
    const available = board.map((cell, i) => cell === '' ? i : null).filter(x => x !== null);
    if (available.length === 0) return -1;
    
    if (aiDifficulty === 'easy') {
        return available[Math.floor(Math.random() * available.length)];
    }
    
    if (aiDifficulty === 'medium') {
        // Try to win
        for (const [a, b, c] of WIN_PATTERNS) {
            if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
            if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
            if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
        }
        // Block player
        for (const [a, b, c] of WIN_PATTERNS) {
            if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
            if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
            if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
        }
        if (board[4] === '') return 4;
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
        return available[Math.floor(Math.random() * available.length)];
    }
    
    // Hard: Minimax
    return minimax(board, 'O', 0).index;
}

function minimax(boardState, player, depth) {
    const available = boardState.map((c, i) => c === '' ? i : null).filter(x => x !== null);
    
    const winner = checkWinnerForBoard(boardState);
    if (winner === 'O') return { score: 10 - depth };
    if (winner === 'X') return { score: depth - 10 };
    if (available.length === 0) return { score: 0 };
    
    const moves = [];
    for (const move of available) {
        const newBoard = [...boardState];
        newBoard[move] = player;
        const result = minimax(newBoard, player === 'O' ? 'X' : 'O', depth + 1);
        moves.push({ index: move, score: result.score });
    }
    
    let best;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (const m of moves) {
            if (m.score > bestScore) { bestScore = m.score; best = m; }
        }
    } else {
        let bestScore = Infinity;
        for (const m of moves) {
            if (m.score < bestScore) { bestScore = m.score; best = m; }
        }
    }
    return best;
}

function checkWinnerForBoard(b) {
    for (const [a, c, d] of WIN_PATTERNS) {
        if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    return null;
}

// ===== ONLINE MULTIPLAYER =====
function createRoom() {
    roomId = generateCode();
    playerId = generateId();
    isHost = true;
    playerSymbol = 'X';
    playerXName = currentUserName;
    playerOName = 'Waiting...';
    
    database.ref('rooms/' + roomId).set({
        host: playerId,
        playerX: playerId,
        playerXName: currentUserName,
        playerO: null,
        playerOName: null,
        board: Array(9).fill(''),
        currentPlayer: 'X',
        status: 'waiting',
        winner: null,
        rematchRequestedBy: null,
        rematchDeclinedBy: null,
        createdAt: Date.now()
    });
    
    listenToRoom();
    showRoomInfo();
    updateScoreLabels();
}

function joinRoom() {
    const code = document.getElementById('roomInput').value.trim().toUpperCase();
    if (!code) {
        alert('Please enter a room code!');
        return;
    }
    
    database.ref('rooms/' + code).once('value').then(snap => {
        if (!snap.exists()) {
            alert('Room not found!');
            return;
        }
        const room = snap.val();
        if (room.playerO && room.playerO !== playerId) {
            alert('Room is full!');
            return;
        }
        
        roomId = code;
        playerId = generateId();
        isHost = false;
        playerSymbol = 'O';
        playerXName = room.playerXName || 'Player X';
        playerOName = currentUserName;
        
        database.ref('rooms/' + roomId).update({ 
            playerO: playerId, 
            playerOName: currentUserName,
            status: 'playing' 
        });
        
        listenToRoom();
        showRoomInfo();
        updateScoreLabels();
    });
}

function listenToRoom() {
    if (roomListener) roomListener.off();
    roomListener = database.ref('rooms/' + roomId);
    
    roomListener.on('value', snap => {
        if (!snap.exists()) {
            alert('Room was closed!');
            leaveRoom();
            return;
        }
        
        const room = snap.val();
        
        // Update player names from room
        if (room.playerXName) playerXName = room.playerXName;
        if (room.playerOName) playerOName = room.playerOName;
        updateScoreLabels();
        
        // Show opponent info
        if (room.playerO) {
            const opponentName = isHost ? room.playerOName : room.playerXName;
            document.getElementById('opponentInfo').style.display = 'block';
            document.getElementById('opponentName').textContent = opponentName || 'Unknown';
        } else {
            document.getElementById('opponentInfo').style.display = 'none';
        }
        
        // Handle rematch system
        handleRematchState(room);
        
        // Update board if game is active or just finished
        if (room.status === 'playing' || room.status === 'finished') {
            board = room.board || Array(9).fill('');
            currentPlayer = room.currentPlayer || 'X';
            
            updateBoardUI();
            
            document.getElementById('roomStatus').textContent = 
                room.playerO ? 'Game in progress' : 'Waiting for opponent...';
            
            // Handle game end
            if (room.winner && gameActive) {
                gameActive = false;
                stopTimer();
                
                if (room.winner !== 'draw') {
                    const result = checkWinner();
                    if (result) {
                        result.pattern.forEach(i => {
                            document.querySelectorAll('.cell')[i].classList.add('winning');
                        });
                    }
                    
                    scores[room.winner]++;
                    stats.gamesPlayed++;
                    
                    if (room.winner === playerSymbol) {
                        stats.totalWins++;
                        stats.onlineWins++;
                        stats.currentStreak++;
                        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
                        playSound('win');
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        checkAchievements(); // Only the winner gets achievement popup
                        updateLeaderboardStats(true, stats.currentStreak);
                    } else {
                        stats.totalLosses++;
                        stats.currentStreak = 0;
                        playSound('lose');
                        updateLeaderboardStats(false, 0);
                    }
                    
                    const historyEntry = { 
                        date: new Date().toISOString(), 
                        mode: 'online', 
                        result: room.winner, 
                        moves: moveCount,
                        playerX: playerXName,
                        playerO: playerOName
                    };
                    gameHistory.unshift(historyEntry);
                    saveData();
                    renderHistory();
                } else {
                    scores.draw++;
                    stats.gamesPlayed++;
                    stats.totalDraws++;
                    playSound('draw');
                    updateLeaderboardStats(false, 0);
                    
                    const historyEntry = { 
                        date: new Date().toISOString(), 
                        mode: 'online', 
                        result: 'draw', 
                        moves: moveCount,
                        playerX: playerXName,
                        playerO: playerOName
                    };
                    gameHistory.unshift(historyEntry);
                    saveData();
                    renderHistory();
                }
            }
            
            // Game is active if playing and no winner
            if (room.status === 'playing' && !room.winner) {
                gameActive = true;
                if (timerEnabled && currentPlayer === playerSymbol) {
                    startTimer();
                }
            }
        }
        
        updateUI();
    });
}

function handleRematchState(room) {
    const rematchModal = document.getElementById('rematchModal');
    const waitingModal = document.getElementById('waitingRematchModal');
    const declinedModal = document.getElementById('rematchDeclinedModal');
    
    // Check if rematch was declined
    if (room.rematchDeclinedBy && room.rematchDeclinedBy !== playerId) {
        // The other player declined our request
        waitingModal.style.display = 'none';
        rematchModal.style.display = 'none';
        
        const declinedByName = room.rematchDeclinedBy === room.playerX ? room.playerXName : room.playerOName;
        document.getElementById('declinedMessage').textContent = `${declinedByName || 'The other player'} declined the rematch.`;
        declinedModal.style.display = 'flex';
        
        // Clear the declined state after showing
        setTimeout(() => {
            if (roomId) {
                database.ref('rooms/' + roomId).update({
                    rematchDeclinedBy: null,
                    rematchRequestedBy: null
                });
            }
        }, 100);
        return;
    }
    
    // Check if someone requested a rematch
    if (room.rematchRequestedBy && room.status === 'finished') {
        if (room.rematchRequestedBy !== playerId) {
            // Other player requested rematch - show modal to us
            const requesterName = room.rematchRequestedBy === room.playerX ? room.playerXName : room.playerOName;
            document.getElementById('rematchMessage').textContent = `${requesterName || 'The other player'} wants to play again!`;
            rematchModal.style.display = 'flex';
            waitingModal.style.display = 'none';
            declinedModal.style.display = 'none';
        } else {
            // We requested rematch - show waiting modal
            waitingModal.style.display = 'flex';
            rematchModal.style.display = 'none';
            declinedModal.style.display = 'none';
        }
    } else {
        // No pending rematch request
        rematchModal.style.display = 'none';
        waitingModal.style.display = 'none';
        // Don't hide declined modal here - it has its own close button
    }
    
    // If game is playing and no winner, ensure modals are closed
    if (room.status === 'playing' && !room.winner) {
        rematchModal.style.display = 'none';
        waitingModal.style.display = 'none';
        declinedModal.style.display = 'none';
    }
}

function sendOnlineMove(index) {
    database.ref('rooms/' + roomId).once('value').then(snap => {
        const room = snap.val();
        if (!room || room.currentPlayer !== playerSymbol || room.board[index] !== '') return;
        
        const newBoard = [...room.board];
        newBoard[index] = playerSymbol;
        moveCount++;
        const next = playerSymbol === 'X' ? 'O' : 'X';
        
        const winner = checkWinnerForBoard(newBoard);
        const isDraw = newBoard.every(c => c !== '') && !winner;
        
        database.ref('rooms/' + roomId).update({
            board: newBoard,
            currentPlayer: next,
            winner: winner || (isDraw ? 'draw' : null),
            status: winner || isDraw ? 'finished' : 'playing'
        });
        
        playSound('move');
    });
}

function requestRematch() {
    if (!roomId) return;
    
    database.ref('rooms/' + roomId).update({
        rematchRequestedBy: playerId,
        rematchDeclinedBy: null
    }).catch(err => {
        console.log('Rematch request error:', err);
    });
}

function acceptRematch() {
    if (!roomId) return;
    
    document.getElementById('rematchModal').style.display = 'none';
    
    // Reset local state first
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    moveCount = 0;
    
    // Reset game state in Firebase
    database.ref('rooms/' + roomId).update({
        board: Array(9).fill(''),
        currentPlayer: 'X',
        winner: null,
        status: 'playing',
        rematchRequestedBy: null,
        rematchDeclinedBy: null
    }).then(() => {
        initBoard();
        updateUI();
    }).catch(err => {
        console.log('Rematch error:', err);
        alert('Error starting rematch. Please try again.');
    });
}

function declineRematch() {
    if (!roomId) return;
    
    document.getElementById('rematchModal').style.display = 'none';
    
    // Set declined state so the other player knows
    database.ref('rooms/' + roomId).update({
        rematchDeclinedBy: playerId,
        rematchRequestedBy: null
    });
}

function cancelRematchRequest() {
    if (!roomId) return;
    
    database.ref('rooms/' + roomId).update({
        rematchRequestedBy: null,
        rematchDeclinedBy: null
    });
    
    document.getElementById('waitingRematchModal').style.display = 'none';
}

function closeDeclinedModal() {
    document.getElementById('rematchDeclinedModal').style.display = 'none';
}

function leaveRoom() {
    if (roomListener) { 
        roomListener.off(); 
        roomListener = null; 
    }
    if (roomId) {
        if (isHost) {
            database.ref('rooms/' + roomId).remove();
        } else {
            database.ref('rooms/' + roomId).update({ 
                playerO: null, 
                playerOName: null, 
                status: 'waiting',
                rematchRequestedBy: null,
                rematchDeclinedBy: null
            });
        }
    }
    
    roomId = null; 
    playerId = null; 
    isHost = false; 
    playerSymbol = 'X';
    
    document.getElementById('roomInfo').style.display = 'none';
    document.getElementById('roomControls').style.display = 'flex';
    document.getElementById('rematchModal').style.display = 'none';
    document.getElementById('waitingRematchModal').style.display = 'none';
    document.getElementById('rematchDeclinedModal').style.display = 'none';
    document.getElementById('opponentInfo').style.display = 'none';
    
    playerXName = currentUserName;
    playerOName = 'Opponent';
    updateScoreLabels();
    
    resetGameLocal();
}

function showRoomInfo() {
    document.getElementById('roomCodeDisplay').textContent = roomId;
    document.getElementById('playerSymbolDisplay').textContent = playerSymbol;
    document.getElementById('playerSymbolDisplay').className = playerSymbol === 'X' ? 'x-color' : 'o-color';
    document.getElementById('roomInfo').style.display = 'block';
    document.getElementById('roomControls').style.display = 'none';
}

function copyRoomCode() {
    if (!roomId) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomId).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopy();
        });
    } else {
        fallbackCopy();
    }
}

function fallbackCopy() {
    const textArea = document.createElement('textarea');
    textArea.value = roomId;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        alert('Room code: ' + roomId);
    }
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 2000);
}

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== UI UPDATES =====
function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
        cell.className = 'cell';
        if (board[i] === 'X') cell.classList.add('x');
        if (board[i] === 'O') cell.classList.add('o');
        
        // Determine if cell should be disabled
        let shouldDisable = false;
        
        if (!gameActive) {
            // Game is over - disable all
            shouldDisable = true;
        } else if (board[i] !== '') {
            // Cell is already filled
            shouldDisable = true;
        } else if (gameMode === 'ai' && (currentPlayer === 'O' || aiThinking)) {
            // AI's turn or AI is thinking - disable empty cells
            shouldDisable = true;
        } else if (gameMode === 'online' && currentPlayer !== playerSymbol) {
            // Online - not our turn
            shouldDisable = true;
        }
        
        if (shouldDisable) {
            cell.classList.add('disabled');
        }
    });
}

function updateUI() {
    document.getElementById('turnDisplay').textContent = currentPlayer;
    document.getElementById('turnDisplay').className = currentPlayer === 'X' ? 'x-color' : 'o-color';
    
    const currentName = currentPlayer === 'X' ? playerXName : playerOName;
    
    let status = '';
    if (!gameActive) {
        const winner = checkWinner();
        if (winner) {
            const winnerName = winner.winner === 'X' ? playerXName : playerOName;
            if (gameMode === 'ai') {
                status = winner.winner === 'X' ? `🎉 ${winnerName} Wins!` : `🤖 ${winnerName} Wins!`;
            } else if (gameMode === 'online') {
                status = winner.winner === playerSymbol ? `🎉 You Win!` : `😔 ${winnerName} Wins!`;
            } else {
                status = `🎉 ${winnerName} Wins!`;
            }
        } else if (board.every(cell => cell !== '')) {
            status = "It's a Draw!";
        } else {
            status = "Game Over";
        }
    } else if (aiThinking) {
        status = `🤖 ${playerOName} is thinking...`;
    } else if (gameMode === 'online') {
        status = currentPlayer === playerSymbol ? "Your turn!" : `Waiting for ${currentName}...`;
    } else if (gameMode === 'ai') {
        status = currentPlayer === 'X' ? `${playerXName}'s Turn` : `${playerOName}'s Turn`;
    } else {
        status = `${currentName}'s Turn`;
    }
    document.getElementById('statusMessage').textContent = status;
    
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('scoreDraw').textContent = scores.draw;
    
    document.getElementById('statGames').textContent = stats.gamesPlayed;
    document.getElementById('statWins').textContent = stats.totalWins;
    document.getElementById('statBestStreak').textContent = stats.maxStreak;
    document.getElementById('statCurrentStreak').textContent = stats.currentStreak;
    
    document.getElementById('achievementCount').textContent = unlockedAchievements.length;
    document.getElementById('historyCount').textContent = gameHistory.length;
}

// ===== GAME CONTROL =====
function resetGame() {
    if (gameMode === 'online' && roomId) {
        // Check if game is finished before requesting rematch
        database.ref('rooms/' + roomId).once('value').then(snap => {
            const room = snap.val();
            if (room && room.status === 'finished') {
                requestRematch();
            } else if (room && room.status === 'playing' && !room.winner) {
                // Game in progress - just reset locally (forfeit)
                // Or you could prevent this
                alert('Game is still in progress!');
            } else {
                requestRematch();
            }
        });
        return;
    }
    
    resetGameLocal();
}

function resetGameLocal() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    aiThinking = false;
    moveCount = 0;
    
    stopTimer();
    if (timerEnabled) {
        startTimer();
    }
    
    initBoard();
    updateUI();
}

function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    saveData();
    updateUI();
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    // This function only runs for the player who should get the achievement
    for (const ach of ACHIEVEMENTS) {
        if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
            unlockedAchievements.push(ach.id);
            showAchievementToast(ach);
            playSound('achievement');
            confetti({ particleCount: 100, spread: 70, colors: [ach.color, '#fff', '#667eea'] });
            break;
        }
    }
    saveData();
    renderAchievements();
}

function showAchievementToast(ach) {
    const toast = document.getElementById('achievementToast');
    document.getElementById('toastIcon').style.background = ach.color;
    document.getElementById('toastIcon').innerHTML = `<i class="fas ${ach.icon}"></i>`;
    document.getElementById('toastName').textContent = ach.name;
    toast.style.display = 'flex';
    setTimeout(() => toast.style.display = 'none', 4000);
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = ACHIEVEMENTS.map(ach => {
        const unlocked = unlockedAchievements.includes(ach.id);
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" data-testid="achievement-${ach.id}">
                <div class="achievement-icon" style="background: ${unlocked ? ach.color : '#374151'}">
                    <i class="fas ${ach.icon}"></i>
                </div>
                <div class="achievement-info">
                    <span class="achievement-name">${ach.name}</span>
                    <span class="achievement-desc">${ach.description}</span>
                </div>
            </div>
        `;
    }).join('');
}

function toggleAchievements() {
    const grid = document.getElementById('achievementsGrid');
    const chevron = document.getElementById('achievementChevron');
    const show = grid.style.display === 'none';
    grid.style.display = show ? 'grid' : 'none';
    chevron.className = show ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
}

// ===== HISTORY =====
function renderHistory() {
    const list = document.getElementById('historyList');
    if (gameHistory.length === 0) {
        list.innerHTML = '<p class="no-history">No games played yet!</p>';
        return;
    }
    list.innerHTML = gameHistory.slice(0, 10).map((game, index) => {
        const date = new Date(game.date).toLocaleDateString();
        const resultClass = game.result === 'draw' ? 'draw' : game.result === 'X' ? 'win' : 'lose';
        const resultText = game.result === 'draw' ? 'Draw' : `${game.result === 'X' ? (game.playerX || 'X') : (game.playerO || 'O')} Won`;
        const modeText = game.mode === 'ai' ? `AI (${game.difficulty || 'medium'})` : game.mode === 'online' ? 'Online' : 'Local';
        return `
            <div class="history-item" data-testid="history-item-${index}">
                <span class="history-date">${date}</span>
                <span class="history-result ${resultClass}">${resultText}</span>
                <span class="history-mode">${modeText}</span>
                <span class="history-moves">${game.moves} moves</span>
            </div>
        `;
    }).join('');
}

function toggleHistory() {
    const list = document.getElementById('historyList');
    const chevron = document.getElementById('historyChevron');
    const show = list.style.display === 'none';
    list.style.display = show ? 'block' : 'none';
    chevron.className = show ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
}

// ===== SOUND =====
function playSound(type) {
    if (!soundEnabled) return;
    try {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        switch (type) {
            case 'move':
                osc.frequency.setValueAtTime(600, audioContext.currentTime);
                osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                osc.start(); osc.stop(audioContext.currentTime + 0.1);
                break;
            case 'win':
                osc.frequency.setValueAtTime(523.25, audioContext.currentTime);
                osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                gain.gain.setValueAtTime(0.15, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                osc.start(); osc.stop(audioContext.currentTime + 0.4);
                break;
            case 'lose':
                osc.frequency.setValueAtTime(400, audioContext.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                osc.start(); osc.stop(audioContext.currentTime + 0.3);
                break;
            case 'draw':
                osc.frequency.setValueAtTime(440, audioContext.currentTime);
                gain.gain.setValueAtTime(0.08, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                osc.start(); osc.stop(audioContext.currentTime + 0.2);
                break;
            case 'achievement':
                osc.frequency.setValueAtTime(880, audioContext.currentTime);
                osc.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1);
                osc.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.2);
                gain.gain.setValueAtTime(0.12, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc.start(); osc.stop(audioContext.currentTime + 0.5);
                break;
        }
    } catch (e) { console.log('Audio not supported'); }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('ttt_sound', soundEnabled);
    const btn = document.getElementById('soundBtn');
    const icon = document.getElementById('soundIcon');
    btn.classList.toggle('active', soundEnabled);
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

// ===== DATA PERSISTENCE =====
function saveData() {
    localStorage.setItem('ttt_scores', JSON.stringify(scores));
    localStorage.setItem('ttt_stats', JSON.stringify(stats));
    localStorage.setItem('ttt_achievements', JSON.stringify(unlockedAchievements));
    localStorage.setItem('ttt_history', JSON.stringify(gameHistory.slice(0, 50)));
}
