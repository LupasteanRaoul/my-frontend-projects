// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwVqJLn2uiPsdDsvDX3eywyVp-6_gcyWI",
  authDomain: "tic-tac-toe-multiplayer-9c961.firebaseapp.com",
  projectId: "tic-tac-toe-multiplayer-9c961",
  storageBucket: "tic-tac-toe-multiplayer-9c961.firebasestorage.app",
  messagingSenderId: "711843674854",
  appId: "1:711843674854:web:8c470fdd91c0841d945927",
  measurementId: "G-9TCHMSCWM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ===== GLOBAL GAME VARIABLES =====
let currentGameMode = 'ai'; // 'ai', 'local', 'online'
let currentRoomId = null;
let playerId = null;
let isHost = false;
let currentPlayerSymbol = 'X'; // X or O for online
let opponentConnected = false;

// ===== FIREBASE FUNCTIONS =====

// Generate unique player ID
function generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Create a new room
function createRoom() {
    currentRoomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    playerId = generatePlayerId();
    isHost = true;
    currentPlayerSymbol = 'X';
    
    // Create room in Firebase
    database.ref('rooms/' + currentRoomId).set({
        host: playerId,
        playerX: playerId,
        playerO: null,
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        status: 'waiting',
        winner: null,
        createdAt: Date.now()
    });
    
    // Listen for room changes
    listenToRoom();
    
    // Update UI
    document.getElementById('roomCodeDisplay').textContent = currentRoomId;
    document.getElementById('roomStatus').textContent = 'Waiting for opponent...';
    
    // Show room info
    document.querySelector('.room-info').style.display = 'block';
    
    return currentRoomId;
}

// Join an existing room
function joinRoom(roomCode) {
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
        
        // Join as player O
        currentPlayerSymbol = 'O';
        roomRef.update({
            playerO: playerId,
            status: 'playing'
        });
        
        // Listen for room changes
        listenToRoom();
        
        // Update UI
        document.getElementById('roomCodeDisplay').textContent = currentRoomId;
        document.getElementById('roomStatus').textContent = 'Connected! Game starting...';
        document.querySelector('.room-info').style.display = 'block';
        
        opponentConnected = true;
        
    }).catch(error => {
        console.error('Error joining room:', error);
        alert('Error joining room!');
    });
}

// Listen to room changes
function listenToRoom() {
    const roomRef = database.ref('rooms/' + currentRoomId);
    
    roomRef.on('value', snapshot => {
        if (!snapshot.exists()) {
            // Room was deleted
            if (currentGameMode === 'online') {
                leaveRoom();
                alert('Room was closed by host!');
            }
            return;
        }
        
        const room = snapshot.val();
        
        // Update game board
        if (room.board && window.updateGameBoard) {
            window.updateGameBoard(room.board);
        }
        
        // Update current player
        if (room.currentPlayer && window.updateCurrentPlayer) {
            window.updateCurrentPlayer(room.currentPlayer);
        }
        
        // Update status
        if (room.status === 'playing' && !opponentConnected) {
            opponentConnected = true;
            document.getElementById('roomStatus').textContent = 'Opponent connected!';
        }
        
        // Check for winner
        if (room.winner && window.checkWinnerFromFirebase) {
            window.checkWinnerFromFirebase(room.winner);
        }
        
        // Update UI based on room status
        updateRoomUI(room);
    });
}

// Send move to Firebase
function sendMoveToFirebase(index, player) {
    if (!currentRoomId) return;
    
    const roomRef = database.ref('rooms/' + currentRoomId);
    
    roomRef.once('value').then(snapshot => {
        const room = snapshot.val();
        if (!room) return;
        
        // Update board
        const newBoard = [...room.board];
        newBoard[index] = player;
        
        // Determine next player
        const nextPlayer = player === 'X' ? 'O' : 'X';
        
        // Check for winner
        let winner = null;
        if (window.checkWinnerFunction) {
            winner = window.checkWinnerFunction(newBoard);
        }
        
        // Update room
        roomRef.update({
            board: newBoard,
            currentPlayer: nextPlayer,
            winner: winner,
            status: winner ? 'finished' : room.status
        });
        
    }).catch(error => {
        console.error('Error sending move:', error);
    });
}

// Leave room
function leaveRoom() {
    if (currentRoomId) {
        const roomRef = database.ref('rooms/' + currentRoomId);
        
        if (isHost) {
            // Host leaves - delete room
            roomRef.remove();
        } else {
            // Player leaves - update room
            roomRef.update({
                playerO: null,
                status: 'waiting'
            });
        }
    }
    
    // Reset variables
    currentRoomId = null;
    playerId = null;
    isHost = false;
    opponentConnected = false;
    
    // Update UI
    document.querySelector('.room-info').style.display = 'none';
    document.getElementById('roomCodeInput').value = '';
}

// Update room UI
function updateRoomUI(room) {
    if (!room) return;
    
    let statusText = '';
    
    if (room.status === 'waiting') {
        statusText = 'Waiting for opponent...';
    } else if (room.status === 'playing') {
        statusText = opponentConnected ? 'Game in progress' : 'Opponent connecting...';
    } else if (room.status === 'finished') {
        statusText = 'Game finished!';
    }
    
    document.getElementById('roomStatus').textContent = statusText;
}

// ===== EXPOSE FUNCTIONS TO GLOBAL SCOPE =====
window.firebaseFunctions = {
    createRoom,
    joinRoom,
    sendMoveToFirebase,
    leaveRoom,
    getCurrentPlayerSymbol: () => currentPlayerSymbol,
    getGameMode: () => currentGameMode,
    setGameMode: (mode) => { currentGameMode = mode; },
    isOnlineMode: () => currentGameMode === 'online',
    isMyTurn: () => {
        if (!currentRoomId) return false;
        // This will be implemented in the main game logic
        return true;
    }
};