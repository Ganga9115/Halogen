import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsData.json"; // Make sure this path is correct
import TablaCelebration from '../utils/Celeb';
import { useNavigate, useParams } from 'react-router-dom';
import Background from '../utils/FloatingBackground';
import logo from '../../assets/logo123.png';
import BackButton from '../utils/backbutton';
import Footer from '../utils/Footer';
import Logo from '../utils/logo';
import { saveResult } from "../utils/leaderboardStorage";

const Cardflipping = () => {
  const navigate = useNavigate();
  const { className: routeClassName, nickname: routeNickname, schoolName: routeSchoolName } = useParams();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('antonym');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(180); // Set initial timer to 3 minutes (180 seconds)
  const [showCelebration, setShowCelebration] = useState(false);
  const [stopCelebration, setStopCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [hasSavedResult, setHasSavedResult] = useState(false);

  // Helper function to get player profile from localStorage
  const getPlayerProfile = () => {
    const profile = JSON.parse(localStorage.getItem("player_profile") || "{}");
    return {
      name: routeNickname || profile.name || "Anonymous",
      school: routeSchoolName || profile.school || "Unknown School",
      className: routeClassName || profile.className || "",
      avatar: profile.avatar || "",
      avatarIndex: profile.avatarIndex || 0,
    };
  };

  const initializeGame = useCallback(() => {
    setStopCelebration(true);
    setTimeout(() => setStopCelebration(false), 50);

    if (!cardsJSON || !cardsJSON.length) return;

    const playerProfile = getPlayerProfile();
    const currentClassName = playerProfile.className || routeClassName;

    const gamePairs = cardsJSON.filter(data => data.type === gameMode && data.level === currentClassName);

    if (!gamePairs.length) {
      console.error(`No pairs found for game mode "${gameMode}" and class "${currentClassName}".`);
      return;
    }

    const selectedPairs = gamePairs[0].pairs;

    const deck = selectedPairs.flatMap(pair => [
      { id: Math.random(), word: pair[0], match: pair[1] },
      { id: Math.random(), word: pair[1], match: pair[0] }
    ]);

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlippedCards([]);
    setMatchedCards([]);
    setMessage('');
    setIsGameActive(true);
    setTimer(180); // Reset timer to 3 minutes
    setShowCelebration(false);
    setScore(0);
    setHasSavedResult(false);

    setShowAllCardsTemporarily(true);
    // Set the initial reveal duration to 15 seconds as requested
    setTimeout(() => {
      setShowAllCardsTemporarily(false);
    }, 15000); // 15 seconds
  }, [gameMode, routeClassName, routeNickname, routeSchoolName]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let countdown;

    if (!showAllCardsTemporarily && isGameActive) {
      countdown = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsGameActive(false);
            setMessage("Time's up! Game over.");
            setScore(0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [showAllCardsTemporarily, isGameActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards;
      const firstCardData = cards.find(card => card.id === firstCardId);
      const secondCardData = cards.find(card => card.id === secondCardId);

      if (firstCardData.match === secondCardData.word) {
        setMatchedCards(prev => [...prev, firstCardId, secondCardId]);
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const finalScore = 60; // This score calculation might need adjustment
      setMessage(`You have won the game! Your score is ${finalScore}.`);
      setIsGameActive(false);
      setShowCelebration(true);
      setScore(finalScore);

      if (!hasSavedResult) {
        const profile = getPlayerProfile();
        const name = profile.name;
        const school = profile.school;
        const className = profile.className;

        try {
          saveResult({ name, school, className, score: finalScore, game: "CardFlipping" });
          setHasSavedResult(true);
        } catch (err) {
          console.error("Failed saving leaderboard result:", err);
        }
      }
    }
  }, [matchedCards, cards, hasSavedResult]);

  const handleCardClick = (id) => {
    if (!isGameActive || flippedCards.length === 2 || showAllCardsTemporarily) return;

    const clickedCard = cards.find(card => card.id === id);
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, id]);
  };

  const gameInstructions = gameMode === 'antonym'
    ? `Flip the perfect antonyms for Class ${getPlayerProfile().className}!`
    : `Flip the perfect synonyms for Class ${getPlayerProfile().className}!`;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const goToLeaderBoard = () => {
    navigate('/leaderboard');
  };

  const restartGame = () => {
    initializeGame();
  };

  return (
    <Background>
      <Logo />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2vw', fontFamily: 'sans-serif', color: '#4b5563' }}>
        <p style={{ fontSize: '2vw', textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>{gameInstructions}</p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5vh', gap: '2vw' }}>
          <button
            onClick={() => {
              setGameMode('antonym');
            }}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'antonym' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'antonym' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'antonym' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.5vw'
            }}
          >
            Antonyms
          </button>
          <button
            onClick={() => {
              setGameMode('synonym');
            }}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'synonym' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'synonym' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'synonym' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.5vw'
            }}
          >
            Synonyms
          </button>
          <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>
            Time: <span style={{ color: '#dc2626' }}>{formatTime(timer)}</span>
          </h2>
        </div>

        {message && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center" style={{ borderRadius: '1.5vw', border: '4px solid #bca5d4' }}>
              <h2 className="text-[2.5vw] font-bold mb-4">
                {message.startsWith("You have won") ? "🎉 Congratulations! 🎉" : "Game Over!"}
              </h2>
              <p className="text-xl mb-6">
                {message}
              </p>
              <p className="text-xl mb-6 font-bold text-indigo-600">
                Your Score: {score} points
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={goToLeaderBoard}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#7164b4] hover:bg-[#8f9fe4] transition"
                >
                  Leaderboard
                </button>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#8f9fe4] hover:bg-[#7164b4] transition"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2vw', width: '100%', maxWidth: '90vw', padding: '2vw', marginBottom: '5vh', perspective: '1000px' }}>
          {cards.map(card => (
            <div
              key={card.id}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                borderRadius: '1vw',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                aspectRatio: '3 / 2',
                cursor: isGameActive && !showAllCardsTemporarily ? 'pointer' : 'default',
                transformStyle: 'preserve-3d',
                transform: (card.isFlipped || card.isMatched || showAllCardsTemporarily) ? 'rotateY(180deg)' : 'none',
                transition: 'transform 700ms',
                minHeight: '15vh'
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                borderRadius: '1vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1vh solid #7164b4',
                color: '#ffffff',
                fontSize: '4vw',
                fontWeight: 'bold',
                backgroundColor: '#7164b4'
              }}>
                <img src={logo} alt="Application Logo" style={{ width: '60%', height: 'auto', opacity: 0.8 }} />
                <i className="fas fa-question"></i>
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '1vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '1.8vw',
                  padding: '1vh',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#ffffff',
                  color: '#7164b4'
                }}
              >
                {card.word}
              </div>
            </div>
          ))}
        </div>

        <TablaCelebration show={showCelebration} stop={stopCelebration} />
      </div>
      <Footer />
      <BackButton />
    </Background>
  );
};


export default Cardflipping;