const { useState, useEffect } = React;

export function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState('player'); // 'player' or 'ai'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [gameHistory, setGameHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  
  // Load score from localStorage on initial render
  useEffect(() => {
    const savedScore = localStorage.getItem('ticTacToeScore');
    if (savedScore) {
      setScore(JSON.parse(savedScore));
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
  
  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ticTacToeScore', JSON.stringify(score));
  }, [score]);
  
  // AI makes a move if it's AI's turn
  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !winner && !isThinking) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, winner, gameMode, squares]);
  
  const makeAIMove = () => {
    if (winner || isThinking) return;
    
    setIsThinking(true);
    
    setTimeout(() => {
      const availableMoves = squares
        .map((square, index) => square === null ? index : null)
        .filter(index => index !== null);
      
      let aiMove;
      
      if (difficulty === 'easy') {
        // Random move
        aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      } else if (difficulty === 'medium') {
        // Try to win or block
        aiMove = getStrategicMove(availableMoves, squares, false);
      } else {
        // Hard - minimax algorithm
        aiMove = minimax(squares, false).index;
      }
      
      if (aiMove !== undefined && aiMove !== null) {
        handleClick(aiMove);
      }
      
      setIsThinking(false);
    }, 300);
  };
  
  const getStrategicMove = (availableMoves, board, isMaximizing) => {
    const player = isMaximizing ? 'X' : 'O';
    const opponent = isMaximizing ? 'O' : 'X';
    
    // 1. Try to win
    for (let move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = player;
      if (calculateWinner(newBoard).winner === player) {
        return move;
      }
    }
    
    // 2. Try to block opponent
    for (let move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = opponent;
      if (calculateWinner(newBoard).winner === opponent) {
        return move;
      }
    }
    
    // 3. Take center if available
    if (availableMoves.includes(4)) return 4;
    
    // 4. Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // 5. Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };
  
  const minimax = (board, isMaximizing) => {
    const result = calculateWinner(board);
    
    if (result.winner === 'X') return { score: -10 };
    if (result.winner === 'O') return { score: 10 };
    if (!board.includes(null)) return { score: 0 };
    
    const availableMoves = board
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove;
      
      for (let move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 'O';
        const score = minimax(newBoard, false).score;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove;
      
      for (let move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = 'X';
        const score = minimax(newBoard, true).score;
        
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      return { score: bestScore, index: bestMove };
    }
  };
  
  const handleClick = (i) => {
    if (winner || squares[i] || (gameMode === 'ai' && !xIsNext) || isThinking) {
      return;
    }
    
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    
    // Save move to history
    const newGameHistory = gameHistory.slice(0, currentMove);
    newGameHistory.push([...newSquares]);
    setGameHistory(newGameHistory);
    setCurrentMove(newGameHistory.length);
    
    setSquares(newSquares);
    
    const result = calculateWinner(newSquares);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Update score
      setScore(prevScore => ({
        ...prevScore,
        [result.winner]: prevScore[result.winner] + 1
      }));
    } else if (newSquares.every(square => square !== null)) {
      setWinner('draw');
      setScore(prevScore => ({
        ...prevScore,
        draws: prevScore.draws + 1
      }));
    } else {
      setXIsNext(!xIsNext);
    }
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
  
  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    const value = squares[i];
    
    let squareClass = 'square';
    if (isWinningSquare) squareClass += ' winning';
    if (value === 'X') squareClass += ' x-move';
    if (value === 'O') squareClass += ' o-move';
    if (!value && !winner) squareClass += ' hoverable';
    
    return (
      <button 
        className={squareClass}
        onClick={() => handleClick(i)}
        disabled={!!winner || (gameMode === 'ai' && !xIsNext) || isThinking}
      >
        {value}
        {!value && !winner && xIsNext && (
          <span className="hint-x"><i className="fas fa-times"></i></span>
        )}
        {!value && !winner && !xIsNext && (
          <span className="hint-o"><i className="far fa-circle"></i></span>
        )}
      </button>
    );
  };
  
  const getStatus = () => {
    if (winner === 'X' || winner === 'O') {
      return (
        <div className="status winner">
          <i className="fas fa-trophy"></i> Winner: {winner}
        </div>
      );
    } else if (winner === 'draw') {
      return (
        <div className="status draw">
          <i className="fas fa-handshake"></i> Game ended in a draw!
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
  
  return (
    <div className="board-container">
      <div className="header">
        <h1><i className="fas fa-gamepad"></i> Tic-Tac-Toe</h1>
        <div className="subtitle">Advanced React Game</div>
      </div>
      
      <div className="game-info">
        <div className="score-board">
          <div className="score-item">
            <span className="score-label x-label">X Wins</span>
            <span className="score-value">{score.X}</span>
          </div>
          <div className="score-item">
            <span className="score-label draw-label">Draws</span>
            <span className="score-value">{score.draws}</span>
          </div>
          <div className="score-item">
            <span className="score-label o-label">O Wins</span>
            <span className="score-value">{score.O}</span>
          </div>
        </div>
        
        {getStatus()}
        
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
                  Easy
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => {
                    setDifficulty('medium');
                    localStorage.setItem('ticTacToeDifficulty', 'medium');
                    resetGame();
                  }}
                >
                  Medium
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => {
                    setDifficulty('hard');
                    localStorage.setItem('ticTacToeDifficulty', 'hard');
                    resetGame();
                  }}
                >
                  Hard
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
              Game Start
            </button>
            {gameHistory.map((_, move) => (
              move > 0 && (
                <button 
                  key={move}
                  className={`history-btn ${currentMove === move ? 'active' : ''}`}
                  onClick={() => jumpToMove(move)}
                >
                  Move #{move}
                </button>
              )
            ))}
          </div>
        </div>
      )}
      
      <div className="footer">
        <p>Made with <i className="fas fa-heart"></i> using React</p>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
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