import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Questions from './Questions';
import TimerComponent from '../utils/TimerComponent'; 
import { Typography, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Fireworks } from '@fireworks-js/react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useNavigate, useLocation } from 'react-router-dom'; 
import Background from '../utils/FloatingBackground';
import Footer from '../utils/Footer';
import Logo from '../utils/logo';
import BottomNav from '../utils/BottomNav';

const XO = () => {
  const location = useLocation();

  // Players
  const [player1] = useState({ 
    name: location.state?.player1?.name || "Player X", 
    avatar: location.state?.player1?.avatar || "❌" 
  });
  const [player2] = useState({ 
    name: location.state?.player2?.name || "Player O", 
    avatar: location.state?.player2?.avatar || "⭕" 
  });

  // Game state
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  const [turn, setTurn] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState('Answer a question to start!');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false); 
  const [showResultDialog, setShowResultDialog] = useState(false); 

  // celebration
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);

  // language toggle only for XO texts
  const [tamil, setTamil] = useState(false);

  const queueRef = useRef(queue);
  const navigate = useNavigate();

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const checkWinner = (b) => {
    for (let i = 0; i < 3; i++) if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
    for (let j = 0; j < 3; j++) if (b[0][j] && b[0][j] === b[1][j] && b[1][j] === b[2][j]) return b[0][j];
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    return null;
  };

  const checkDraw = (b) => {
    return b.flat().every(cell => cell !== null) && !checkWinner(b);
  };

  const restartGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
    setTurn(null);
    setCurrentPlayer(null);
    setQueue([]);
    setMessage(tamil ? 'கேள்விக்கு பதிலளித்து ஆரம்பிக்கவும்!' : 'Answer a question to start!');
    setGameOver(false);
    setWinner(null);
    setIsDraw(false);
    setShowResultDialog(false);
    setShowFireworks(false);
    setShowConfetti(false);
  };

  const goToDashboard = () => {
    navigate('/'); 
  };

  const handleTimeUp = () => {
    if (turn) {
      const playerName = turn === 'X' ? player1.name : player2.name;
      setMessage(tamil ? `⏱ ${playerName} நேரம் முடிந்தது.` : `⏱ ${playerName} time expired.`);

      setTurn(null);
      setCurrentPlayer(null);

      const q = queueRef.current;
      if (!gameOver && q.length > 0) {
        const [next, ...rest] = q;
        setQueue(rest);
        startTurn(next);
      }
    }
  };

  const startTurn = (player) => {
    if (gameOver) return;

    setTurn(player);
    setCurrentPlayer(player);

    const playerName = player === 'X' ? player1.name : player2.name;
    setMessage(
      tamil 
        ? `✅ ${playerName}, உங்கள் அடையாளத்தை வையுங்கள்!` 
        : `✅ ${playerName}, place your mark!`
    );
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;

    if (!turn) {
      setMessage(tamil ? '⚠️ முதலில் கேள்விக்கு பதில் சொல்லுங்கள்!' : '⚠️ Answer a question first to earn a turn!');
      return;
    }
    if (board[row][col]) {
      setMessage(tamil ? '⚠️ இந்த செல் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது!' : '⚠️ Cell already occupied!');
      return;
    }

    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = turn;
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
      const winnerName = w === 'X' ? player1.name : player2.name;
      setMessage(tamil ? `🎉 ${winnerName} வெற்றி பெற்றார்!` : `🎉 ${winnerName} wins!`);
      setTurn(null);
      setCurrentPlayer(null);
      setQueue([]);
      setGameOver(true);
      setShowResultDialog(true);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setShowFireworks(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowFireworks(false);
        setShowConfetti(false);
      }, 8000);

      return;
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true);
      setMessage(tamil ? '🤝 போட்டி சமனாக முடிந்தது!' : '🤝 Match ended in a draw!');
      setTurn(null);
      setCurrentPlayer(null);
      setQueue([]);
      setGameOver(true);
      setShowResultDialog(true);
      return;
    }

    setTurn(null);
    setCurrentPlayer(null);

    const q = queueRef.current;
    if (q.length > 0) {
      const [next, ...rest] = q;
      setQueue(rest);
      startTurn(next);
    } else {
      setMessage(tamil ? 'தொடர கேள்விக்கு பதில் சொல்லுங்கள்.' : 'Answer a question to continue.');
    }
  };

  const handleCorrectAnswer = (player) => {
    if (gameOver) return;

    if (!turn && !currentPlayer) {
      startTurn(player);
      return;
    }
    if (turn && turn !== player) {
      setQueue((prev) => (prev.includes(player) ? prev : [...prev, player]));
      return;
    }
  };

  const getPlayerName = (playerSymbol) => {
    return playerSymbol === 'X' ? player1.name : player2.name;
  };

  return (
    <Background>
      <Logo />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          height: '100vh',
          paddingTop: '2vh',
          position: 'relative'
        }}
      >
        {/* Fireworks */}
        {showFireworks && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Fireworks
              options={{
                rocketsPoint: { min: 50, max: 50 },
                hue: { min: 0, max: 360 },
                delay: { min: 30, max: 60 },
                speed: 5,
                acceleration: 1.05,
                friction: 0.95,
                gravity: 1.5,
                particles: 100,
                trace: 3,
                explosion: 6
              }}
              style={{
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
              }}
            />
          </div>
        )}

        {/* Confetti */}
        {showConfetti && (
          <div style={{ position: 'absolute', zIndex: 10 }}>
            <ConfettiExplosion force={0.7} duration={4500} particleCount={150} width={1200} />
          </div>
        )}

        {/* Result Dialog */}
        <Dialog
          open={showResultDialog}
          onClose={() => setShowResultDialog(false)}
          PaperProps={{
            style: {
              background: "#DEEBF7",
              color: "#2A60A0",
              borderRadius: "1.5vh",
              padding: "2vh",
            },
          }}
        >
          <DialogTitle style={{ color: "#2A60A0", fontWeight: "bold" }}>
            {winner
              ? (tamil
                  ? `🎉 வாழ்த்துக்கள்! ${getPlayerName(winner)} வெற்றி பெற்றார்!`
                  : `🎉 Congratulations! ${getPlayerName(winner)} Wins!`)
              : tamil
              ? "🤝 போட்டி சமனாக முடிந்தது!"
              : "🤝 Match ended in a draw!"}
          </DialogTitle>

          <DialogContent>
            <Typography style={{ color: "#2A60A0" }}>
              {tamil
                ? "மீண்டும் விளையாட விரும்புகிறீர்களா அல்லது டாஷ்போர்டுக்கு செல்ல விரும்புகிறீர்களா?"
                : "Would you like to play again or go to dashboard?"}
            </Typography>
          </DialogContent>

          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2vw",
            }}
          >
            <Button
              onClick={goToDashboard}
              style={{
                backgroundColor: "#2A60A0",
                color: "white",
                fontWeight: "bold",
                borderRadius: "1vh",
                padding: "0.5vh 2vh",
              }}
            >
              {tamil ? "டாஷ்போர்டுக்கு செல்" : "Go to Dashboard"}
            </Button>

            <Button
              onClick={restartGame}
              autoFocus
              style={{
                backgroundColor: "#2A60A0",
                color: "white",
                fontWeight: "bold",
                borderRadius: "1vh",
                padding: "0.5vh 2vh",
              }}
            >
              {tamil ? "மீண்டும் விளையாடு" : "Play Again"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Player X */}
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: "5vh" }}>
          <div style={{backgroundColor:"#2A60A0" , padding:"2% 7%" , color:"white",borderRadius:"2vh"}}>
          <Typography variant="h6" style={{  fontWeight: 'bold' }}>
            Player X
          </Typography>
          </div>

          
          {turn === 'X' && (
            <div style={{width:"100%",height:"100%",marginTop:"5vh"}}>
            <TimerComponent key={`timer-x-${turn}`} initialTime={10} onTimeUp={handleTimeUp} />
            </div>
          )}
          

          <Questions 
            player="X" 
            playerName={player1.name} 
            onCorrectAnswer={handleCorrectAnswer} 
            activeTurn={turn} 
          />
        </div>

       {/* Board */}
<div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Paper
    style={{
      background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
      width: '70%',
      marginTop: '12vh',
      padding: '3%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 1vh 3vh rgba(0,0,0,0.2)',
      borderRadius: '2vh'
    }}
  >
    {/* 🟢 Message at the TOP now */}
    <Typography
      variant="h6"
      style={{
        marginBottom: '2vh',
        textAlign: 'center',
        fontWeight: '800',
        fontSize: '3vh',
        color: '#2A60A0'
      }}
    >
      {message}
    </Typography>

    {/* Board Below */}
    <Board board={board} onCellClick={handleCellClick} turn={turn} />
  </Paper>
</div>


        {/* Player O */}
        <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop:"5vh" }}>
          <div style={{backgroundColor:"#2A60A0" , padding:"2% 7%" , color:"white",borderRadius:"2vh"}}>
          <Typography variant="h6" style={{  fontWeight: 'bold' }}>
            Player O
          </Typography>
          </div>

          {turn === 'O' && (
            <div style={{width:"100%",height:"100%",marginTop:"5vh"}}>
            <TimerComponent key={`timer-x-${turn}`} initialTime={10} onTimeUp={handleTimeUp} />
            </div>
          )}

          <Questions 
            player="O" 
            playerName={player2.name} 
            onCorrectAnswer={handleCorrectAnswer} 
            activeTurn={turn} 
          />
        </div>
      </div>
      <Footer />
      <BottomNav />
    </Background>
  );
};

export default XO;
