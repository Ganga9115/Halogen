import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsDataT.json";
import TablaCelebration from '../utils/Celeb';
import { useNavigate } from 'react-router-dom';
import Background from '../utils/FloatingBackground';
import logo from '../../assets/logo123.png';
import BackButton from '../utils/backbutton';
import Footer from '../utils/Footer';
import Logo from '../utils/logo';
import { saveResult } from "../utils/leaderboardStorage"; // 1. Import saveResult

const CardflippingT = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('மொழியியல்');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(90);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stopCelebration, setStopCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [hasSavedResult, setHasSavedResult] = useState(false); // 2. Add hasSavedResult state

  const initializeGame = useCallback(() => {
    setStopCelebration(true);
    setTimeout(() => setStopCelebration(false), 50);

    if (!cardsJSON || !cardsJSON.length) return;

    const gamePairs = cardsJSON.find(data => data.type === gameMode)?.pairs || [];

    const deck = gamePairs.flatMap(pair => [
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
    setTimer(90);
    setShowCelebration(false);
    setScore(0);
    setHasSavedResult(false); // Reset on new game

    setShowAllCardsTemporarily(true);
    setTimeout(() => {
      setShowAllCardsTemporarily(false);
    }, 4000);
  }, [gameMode]);

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
            setMessage("நேரம் முடிந்துவிட்டது! விளையாட்டு முடிந்தது.");
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
      const [firstCard, secondCard] = flippedCards;
      const firstCardData = cards.find(card => card.id === firstCard);
      const secondCardData = cards.find(card => card.id === secondCard);

      if (firstCardData.match === secondCardData.word) {
        setMatchedCards(prev => [...prev, firstCard, secondCard]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
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
      const finalScore = 50; // Use a variable for the final score
      setMessage(`விளையாட்டு வெற்றி! உங்கள் மதிப்பெண்: ${finalScore}.`);
      setIsGameActive(false);
      setShowCelebration(true);
      setScore(finalScore);

      // 3. Implement the logic to save the result
      if (!hasSavedResult) {
        const profile = JSON.parse(localStorage.getItem("player_profile") || "{}");
        const name = profile.name || window.prompt("Enter your name") || "Anonymous";
        const school = profile.school || window.prompt("Enter your school") || "Unknown School";
        const className = profile.className || "";

        try {
          saveResult({ name, school, className, score: finalScore, game: "CardFlippingT" });
          setHasSavedResult(true);
        } catch (err) {
          console.error("Failed saving leaderboard result:", err);
        }
      }
    }
  }, [matchedCards, cards, hasSavedResult]);

  const handleCardClick = (id) => {
    const card = cards.find(c => c.id === id);
    if (!isGameActive || card.isFlipped || flippedCards.length === 2 || showAllCardsTemporarily) return;

    setCards(prevCards =>
      prevCards.map(c => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards(prev => [...prev, id]);
  };

  const gameInstructions = gameMode === 'மொழியியல்'
    ? 'சரியான பொருத்தங்களை இணைக்கவும்!'
    : 'சரியான கவிதை-கவிஞர் இணைப்புகளை கண்டுபிடிக்கவும்!';

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
        <p style={{ fontSize: '1.5vw', textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>{gameInstructions}</p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5vh', gap: '2vw' }}>
          <button
            onClick={() => setGameMode('மொழியியல்')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'மொழியியல்' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'மொழியியல்' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'மொழியியல்' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.2vw'
            }}
          >
            மொழியியல்
          </button>
          <button
            onClick={() => setGameMode('கவிதை_கவிஞர்')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'கவிதை_கவிஞர்' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'கவிதை_கவிஞர்' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'கவிதை_கவிஞர்' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.2vw'
            }}
          >
            கவிதை_கவிஞர்
          </button>
          <h2 style={{ fontSize: '1.8vw', fontWeight: 'bold' }}>
            காலம் மீதமுள்ளது: <span style={{ color: '#dc2626' }}>{formatTime(timer)}</span>
          </h2>
        </div>

        {message && (
          // This is the pop-up modal that will appear upon winning
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center" style={{ borderRadius: '1.5vw', border: '4px solid #bca5d4' }}>
              <h2 className="text-[2.5vw] font-bold mb-4">
                {message.startsWith("விளையாட்டு வெற்றி!") ? "🎉 வாழ்த்துக்கள்! 🎉" : "விளையாட்டு முடிந்தது!"}
              </h2>
              <p className="text-xl mb-6">
                {message}
              </p>
              {score > 0 && (
                <p className="text-xl mb-6 font-bold text-indigo-600">
                  உங்கள் மதிப்பெண்: {score}
                </p>
              )}
              <div className="flex justify-center gap-4">
                <button
                  onClick={goToLeaderBoard}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#7164b4] hover:bg-[#8f9fe4] transition"
                >
                  புள்ளிப்பட்டியல்
                </button>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#8f9fe4] hover:bg-[#7164b4] transition"
                >
                  மீண்டும் விளையாடு
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
                cursor: 'pointer',
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
                  fontSize: '1.2vw',
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

export default CardflippingT;