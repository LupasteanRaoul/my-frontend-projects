# 🎮 Advanced Tic-Tac-Toe Game

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Advanced-purple.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A feature-rich, modern Tic-Tac-Toe game built with React, featuring AI opponents, game history, score tracking, and beautiful animations.

![Tic-Tac-Toe Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Advanced+Tic-Tac-Toe+Game)

## ✨ Features

### 🎯 Game Modes
- **Two Players**: Classic mode for two human players
- **vs AI**: Play against artificial intelligence with three difficulty levels
  - **Easy**: Random moves
  - **Medium**: Strategic blocking and winning moves
  - **Hard**: Unbeatable AI using Minimax algorithm

### 📊 Score Tracking
- Persistent score tracking across sessions (localStorage)
- Separate scores for X wins, O wins, and draws
- Visual scoreboard with gradient styling
- Option to reset scores

### 🎨 Visual Enhancements
- **Winning Line Animation**: Highlighting the winning combination
- **Player Indicators**: Visual hints for next move
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Modern gradient background with glass-morphism effects

### ⏱️ Game Features
- **Move History**: Replay any move from the game
- **Undo/Redo**: Jump to any point in the game
- **Auto-save**: Game state persists through page reloads
- **Visual Feedback**: Clear status messages and indicators

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN libraries)

### Installation & Running
1. **Download the project files**:
   - `index.html`
   - `index.jsx`
   - `styles.css`

2. **Place all files in the same directory**

3. **Open `index.html`** in your browser:
   - Double-click the file
   - Or serve via a local server (recommended)

### Local Server (Optional)
For the best experience, use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js with http-server
npx http-server .

# Using PHP
php -S localhost:8000