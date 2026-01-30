// Main Tic-Tac-Toe Game Component
const { useState, useEffect, useRef } = React;

// Export Board component
export function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState('player');
  const [difficulty, setDifficulty] = useState('easy');
  const [gameHistory, setGameHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Refs for sound
  const clickSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const drawSoundRef = useRef(null);
  
  // Initialize sounds
  useEffect(() => {
    clickSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    winSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    drawSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3');
    
    // Short sounds, preload
    [clickSoundRef.current, winSoundRef.current, drawSoundRef.current].forEach(sound => {
      sound.volume = 0.3;
      sound.load();
    });
  }, []);
  
  // Load saved data
  useEffect(() => {
    const savedScore = localStorage.getItem('ticTacToeScore');
    if (savedScore) {
      try {
        setScore(JSON.parse(savedScore));
      } catch (e) {
        console.error('Error loading score:', e);
      }
    }
    
    const savedGameMode = localStorage.getItem('ticTacToeGameMode');
    if (savedGameMode) {
      setGameMode(savedGameMode);
    }
    
    const savedDifficulty = localStorage.getItem('ticTacToeDifficulty');
    if (savedDifficulty) {
      setDifficulty(savedDifficulty);
    }
  }, []);
  
  // Save score when changed
  useEffect(() => {
    localStorage.setItem('ticTacToeScore', JSON.stringify(score));
  }, [score]);
  
  // AI Move Logic
  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !winner && !isThinking && gameStarted) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, winner, gameMode, squares, gameStarted]);
  
  const playSound = (soundType) => {
    if (!clickSoundRef.current) return;
    
    try {
      const soundMap = {
        click: clickSoundRef.current,
        win: winSoundRef.current,
        draw: drawSoundRef.current
      };
      
      const sound = soundMap[soundType];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (e) {
      console.log('Sound error:', e);
    }
  };
  
  const makeAIMove = () => {
    if (winner || isThinking || !gameStarted) return;
    
    setIsThinking(true);
    
    setTimeout(() => {
      const availableMoves = squares
        .map((square, index) => square === null ? index : null)
        .filter(index => index !== null);
      
      if (availableMoves.length === 0) {
        setIsThinking(false);
        return;
      }
      
      let aiMove;
      
      switch (difficulty) {
        case 'easy':
          aiMove = getRandomMove(availableMoves);
          break;
        case 'medium':
          aiMove = getMediumMove(availableMoves, squares);
          break;
        case 'hard':
          aiMove = getBestMove(squares, false);
          break;
        default:
          aiMove = getRandomMove(availableMoves);
      }
      
      if (aiMove !== null && aiMove !== undefined) {
        handleClick(aiMove, false);
      }
      
      setIsThinking(false);
    }, 300);
  };
  
  const getRandomMove = (moves) => {
    return moves[Math.floor(Math.random() * moves.length)];
  };
  
  const getMediumMove = (availableMoves, board) => {
    // Try to win
    for (let move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'O';
      if (calculateWinner(newBoard).winner === 'O') {
        return move;
      }
    }
    
    // Block player
    for (let move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'X';
      if (calculateWinner(newBoard).winner === 'X') {
        return move;
      }
    }
    
    // Take center
    if (availableMoves.includes(4)) return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return getRandomMove(availableMoves);
  };
  
  const getBestMove = (board, isMaximizing, depth = 0) => {
    const result = calculateWinner(board);
    
    if (result.winner === 'X') return { score: -10 + depth };
    if (result.winner === 'O') return { score: 10 - depth };
    if (!board.includes(null)) return { score: 0 };
    
    const availableMoves = board
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
    
    const moves = [];
    
    for (let move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = isMaximizing ? 'O' : 'X';
      const score = getBestMove(newBoard, !isMaximizing, depth + 1).score;
      moves.push({ move, score });
    }
    
    if (isMaximizing) {
      const bestMove = moves.reduce((best, current) => 
        current.score > best.score ? current : best, { score: -Infinity }
      );
      return bestMove;
    } else {
      const bestMove = moves.reduce((best, current) => 
        current.score < best.score ? current : best, { score: Infinity }
      );
      return bestMove;
    }
  };
  
  const handleClick = (i, playSoundFlag = true) => {
    if (winner || squares[i] || (gameMode === 'ai' && !xIsNext) || isThinking || !gameStarted) {
      return;
    }
    
    if (playSoundFlag) {
      playSound('click');
    }
    
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    
    // Save to history
    const newGameHistory = gameHistory.slice(0, currentMove);
    newGameHistory.push([...newSquares]);
    setGameHistory(newGameHistory);
    setCurrentMove(newGameHistory.length);
    
    setSquares(newSquares);
    
    const result = calculateWinner(newSquares);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      playSound('win');
      
      setScore(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
    } else if (newSquares.every(square => square !== null)) {
      setWinner('draw');
      playSound('draw');
      setScore(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    } else {
      setXIsNext(!xIsNext);
    }
  };
  
  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };
  
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
    setGameHistory([]);
    setCurrentMove(0);
    setIsThinking(false);
  };
  
  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
    localStorage.removeItem('ticTacToeScore');
  };
  
  const jumpToMove = (move) => {
    if (move < gameHistory.length) {
      setSquares(gameHistory[move]);
      setCurrentMove(move);
      setXIsNext(move % 2 === 0);
      setWinner(null);
      setWinningLine([]);
      setIsThinking(false);
    }
  };
  
  const getStatusMessage = () => {
    if (!gameStarted) {
      return (
        <div className="status start-prompt">
          <i className="fas fa-play-circle"></i> Click "Start Game" to begin!
        </div>
      );
    }
    
    if (winner === 'X' || winner === 'O') {
      return (
        <div className="status winner">
          <i className="fas fa-trophy"></i> Winner: {winner}
        </div>
      );
    } else if (winner === 'draw') {
      return (
        <div className="status draw">
          <i className="fas fa-handshake"></i> It's a draw!
        </div>
      );
    } else {
      return (
        <div className="status next-player">
          {isThinking ? (
            <><i className="fas fa-robot"></i> AI is thinking...</>
          ) : (
            <>Next player: <span className={xIsNext ? 'player-x' : 'player-o'}>{xIsNext ? 'X' : 'O'}</span></>
          )}
        </div>
      );
    }
  };
  
  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    const value = squares[i];
    const isEmpty = !value && !winner && gameStarted;
    
    let squareClass = 'square';
    if (isWinningSquare) squareClass += ' winning';
    if (value === 'X') squareClass += ' x-move';
    if (value === 'O') squareClass += ' o-move';
    if (isEmpty) squareClass += ' hoverable';
    
    return (
      <button 
        className={squareClass}
        onClick={() => handleClick(i)}
        disabled={!!winner || (gameMode === 'ai' && !xIsNext) || isThinking || !gameStarted}
        aria-label={`Square ${i + 1} ${value ? `contains ${value}` : 'empty'}`}
      >
        {value}
        {isEmpty && xIsNext && (
          <span className="hint-x"><i className="fas fa-times"></i></span>
        )}
        {isEmpty && !xIsNext && (
          <span className="hint-o"><i className="far fa-circle"></i></span>
        )}
      </button>
    );
  };
  
  return (
    <div className="board-container">
      <div className="header">
        <h1><i className="fas fa-gamepad"></i> Advanced Tic-Tac-Toe</h1>
        <div className="subtitle">React-Powered Game with AI Opponent</div>
      </div>
      
      {!gameStarted ? (
        <div className="start-screen">
          <div className="welcome-message">
            <h2><i className="fas fa-chess-board"></i> Welcome!</h2>
            <p>Experience the classic game with modern features and AI opponent.</p>
            
            <div className="feature-list">
              <div className="feature">
                <i className="fas fa-robot"></i>
                <span>3 AI Difficulty Levels</span>
              </div>
              <div className="feature">
                <i className="fas fa-history"></i>
                <span>Game History & Undo</span>
              </div>
              <div className="feature">
                <i className="fas fa-chart-line"></i>
                <span>Score Tracking</span>
              </div>
              <div className="feature">
                <i className="fas fa-users"></i>
                <span>2-Player Mode</span>
              </div>
            </div>
            
            <button className="start-game-btn" onClick={startGame}>
              <i className="fas fa-play"></i> Start Game
            </button>
            
            <button 
              className="instructions-btn" 
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <i className="fas fa-info-circle"></i> How to Play
            </button>
            
            {showInstructions && (
              <div className="instructions">
                <h3><i className="fas fa-graduation-cap"></i> Game Instructions</h3>
                <ul>
                  <li>Players take turns placing X and O on a 3x3 grid</li>
                  <li>First player to get 3 in a row (horizontally, vertically, or diagonally) wins</li>
                  <li>Choose between 2-player mode or play against AI</li>
                  <li>AI has three difficulty levels: Easy, Medium, Hard</li>
                  <li>Use Game History to review or undo moves</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="score-board">
              <div className="score-item">
                <span className="score-label x-label">
                  <i className="fas fa-times"></i> X Wins
                </span>
                <span className="score-value">{score.X}</span>
              </div>
              <div className="score-item">
                <span className="score-label draw-label">
                  <i className="fas fa-equals"></i> Draws
                </span>
                <span className="score-value">{score.draws}</span>
              </div>
              <div className="score-item">
                <span className="score-label o-label">
                  <i className="far fa-circle"></i> O Wins
                </span>
                <span className="score-value">{score.O}</span>
              </div>
            </div>
            
            {getStatusMessage()}
            
            <div className="game-controls">
              <div className="control-group">
                <label><i className="fas fa-users"></i> Game Mode</label>
                <div className="mode-buttons">
                  <button 
                    className={`mode-btn ${gameMode === 'player' ? 'active' : ''}`}
                    onClick={() => {
                      setGameMode('player');
                      localStorage.setItem('ticTacToeGameMode', 'player');
                      resetGame();
                    }}
                  >
                    <i className="fas fa-user-friends"></i> 2 Players
                  </button>
                  <button 
                    className={`mode-btn ${gameMode === 'ai' ? 'active' : ''}`}
                    onClick={() => {
                      setGameMode('ai');
                      localStorage.setItem('ticTacToeGameMode', 'ai');
                      resetGame();
                    }}
                  >
                    <i className="fas fa-robot"></i> vs AI
                  </button>
                </div>
              </div>
              
              {gameMode === 'ai' && (
                <div className="control-group">
                  <label><i className="fas fa-brain"></i> AI Difficulty</label>
                  <div className="difficulty-buttons">
                    <button 
                      className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                      onClick={() => {
                        setDifficulty('easy');
                        localStorage.setItem('ticTacToeDifficulty', 'easy');
                        resetGame();
                      }}
                    >
                      <i className="fas fa-baby"></i> Easy
                    </button>
                    <button 
                      className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                      onClick={() => {
                        setDifficulty('medium');
                        localStorage.setItem('ticTacToeDifficulty', 'medium');
                        resetGame();
                      }}
                    >
                      <i className="fas fa-user-graduate"></i> Medium
                    </button>
                    <button 
                      className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                      onClick={() => {
                        setDifficulty('hard');
                        localStorage.setItem('ticTacToeDifficulty', 'hard');
                        resetGame();
                      }}
                    >
                      <i className="fas fa-crown"></i> Hard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="game-board">
            <div className="board">
              <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
              </div>
              <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
              </div>
              <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn reset-btn" onClick={resetGame}>
              <i className="fas fa-redo"></i> New Game
            </button>
            <button className="action-btn menu-btn" onClick={() => setGameStarted(false)}>
              <i className="fas fa-home"></i> Main Menu
            </button>
            <button className="action-btn score-reset-btn" onClick={resetScore}>
              <i className="fas fa-trash-alt"></i> Reset Score
            </button>
          </div>
          
          {gameHistory.length > 0 && (
            <div className="game-history">
              <h3><i className="fas fa-history"></i> Game History</h3>
              <div className="history-list">
                <button 
                  className={`history-btn ${currentMove === 0 ? 'active' : ''}`}
                  onClick={() => jumpToMove(0)}
                >
                  <i className="fas fa-flag"></i> Start
                </button>
                {gameHistory.map((_, move) => (
                  move > 0 && (
                    <button 
                      key={move}
                      className={`history-btn ${currentMove === move ? 'active' : ''}`}
                      onClick={() => jumpToMove(move)}
                    >
                      <i className="fas fa-step-forward"></i> Move #{move}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="footer">
        <p>
          Made with <i className="fas fa-heart"></i> using React 
          | <a href="https://github.com/LupasteanRaoul" target="_blank" rel="noopener">
            <i className="fab fa-github"></i> GitHub
          </a>
        </p>
        <p className="view-live-note">
          <i className="fas fa-external-link-alt"></i> View Live on GitHub Pages
        </p>
      </div>
    </div>
  );
}

// Helper function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }
  
  return { winner: null, line: [] };
}