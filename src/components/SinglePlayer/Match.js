import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchData from "../../data/match.json";
import Footer from "../utils/Footer";
import Background from "../utils/FloatingBackground";
import Logo from "../utils/logo";
import Confetti from "react-confetti";
import BottomNav from "../utils/BottomNav";
import { saveResult } from "../utils/leaderboardStorage";

const Match = () => {
  const { classId, subject, topic } = useParams();
  const navigate = useNavigate();
  const colorPalette = ['#E0A4AF', '#F2D0A9', '#A6C9C2', '#BEB6D9'];
  const [colorIndex, setColorIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [shuffledDefs, setShuffledDefs] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [userPairs, setUserPairs] = useState({});
  const [pairColors, setPairColors] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerRunning, setTimerRunning] = useState(true);
  const timerRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTimeOutModal, setShowTimeOutModal] = useState(false);
  const [hasSavedResult, setHasSavedResult] = useState(false);
  const [pairedTermHistory, setPairedTermHistory] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [language, setLanguage] = useState("english");

  const instructions = {
    english: [
      "Objective – Match the correct pairs from two lists (Column A & Column B).",
      "How to Play – Click on a term from the left column, then click on its matching definition from the right column.",
      "Scoring – Each correct match earns points. Wrong matches do not earn points.",
      "Winning – The game ends when all pairs are matched correctly."
    ],
    tamil: [
      "நோக்கம் – இரண்டு பட்டியல்களிலிருந்து (A & B) சரியான ஜோடியை பொருத்தவும்.",
      "விளையாடும் முறை – இடது பக்கத்தில் உள்ள வார்த்தையை கிளிக் செய்து, பின்னர் வலது பக்கத்தில் உள்ள சரியான விளக்கத்தை கிளிக் செய்யவும்.",
      "மதிப்பெண்கள் – ஒவ்வொரு சரியான பொருத்தத்திற்கும் மதிப்பெண்கள் கிடைக்கும். தவறான பொருத்தங்களுக்கு மதிப்பெண்கள் கிடையாது.",
      "வெற்றி – எல்லா ஜோடிகளும் பொருந்திய பிறகு விளையாட்டு முடியும்."
    ]
  };

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) =>
    shuffleArray(arr).slice(0, Math.min(n, arr.length));

  const initializeGame = useCallback(() => {
    if (!classId || !subject || !topic) return;

    const filtered = matchData.filter(
      (q) =>
        q.class === parseInt(classId) &&
        q.subject.toLowerCase() === subject.toLowerCase() &&
        q.topic.toLowerCase() === topic.toLowerCase() &&
        q.type === "match"
    );

    const easy = pickRandom(filtered.filter((q) => q.difficulty === "easy"), 2);
    const medium = pickRandom(
      filtered.filter((q) => q.difficulty === "medium"),
      2
    );
    const hard = pickRandom(filtered.filter((q) => q.difficulty === "hard"), 2);
    let selected = [...easy, ...medium, ...hard];

    if (selected.length < 6) {
      const remaining = filtered.filter((q) => !selected.includes(q));
      const fill = pickRandom(remaining, 6 - selected.length);
      selected = [...selected, ...fill];
    }
    setQuestions(shuffleArray(selected));
    setScore(0);
    setCorrectCount(0);
    setCurrentQ(0);
    setHasChecked(false);
    setTimeLeft(180);
    setTimerRunning(true);
    setShowConfetti(false);
    setShowTimeOutModal(false);
    setHasSavedResult(false);
    setPairedTermHistory([]);
  }, [classId, subject, topic]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentMatches = questions[currentQ].matches;
      setShuffledDefs(shuffleArray(currentMatches.map((m) => m.definition)));
    }
  }, [questions, currentQ]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (timerRunning && timeLeft > 0 && !showInstructions) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      checkAnswers(true);
      setShowTimeOutModal(true);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft, showInstructions]);

  useEffect(() => {
    if (showConfetti && !hasSavedResult) {
      const finalScore = score;
      const profile = JSON.parse(localStorage.getItem("player_profile") || "{}");
      const name = profile.name || window.prompt("Enter your name") || "Anonymous";
      const school = profile.school || window.prompt("Enter your school") || "Unknown School";
      const className = profile.className || "";

      try {
        saveResult({ name, school, className, score: finalScore, game: "Match" });
        setHasSavedResult(true);
      } catch (err) {
        console.error("Failed saving leaderboard result:", err);
      }
    }
  }, [showConfetti, hasSavedResult, score]);

  const handleTermSelect = (term) => {
    if (userPairs[term] || hasChecked) return;
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition) => {
    if (!selectedTerm || Object.values(userPairs).includes(definition) || hasChecked) return;

    const newColor = colorPalette[colorIndex];
    const newPair = { [selectedTerm]: definition };
    setUserPairs((prev) => ({ ...prev, ...newPair }));
    setPairColors((prev) => ({ ...prev, [selectedTerm]: newColor }));
    setPairedTermHistory((prev) => [...prev, selectedTerm]);
    setSelectedTerm(null);
    setColorIndex((prev) => (prev + 1) % colorPalette.length);
  };

  const handleUndo = () => {
    if (hasChecked || pairedTermHistory.length === 0) return;
    const lastPairedTerm = pairedTermHistory[pairedTermHistory.length - 1];
    
    setUserPairs((prev) => {
      const newPairs = { ...prev };
      delete newPairs[lastPairedTerm];
      return newPairs;
    });
    setPairColors((prev) => {
      const newColors = { ...prev };
      delete newColors[lastPairedTerm];
      return newColors;
    });
    setPairedTermHistory((prev) => prev.slice(0, -1));
    setSelectedTerm(null);
  };

  const checkAnswers = () => {
    setTimerRunning(false);
    setHasChecked(true);
    let correctPairsCount = 0;
    const currentMatches = questions[currentQ].matches;
    const newPairColors = { ...pairColors };

    for (const term in userPairs) {
      const correctDef = currentMatches.find(
        (m) => m.term.toLowerCase() === term.toLowerCase()
      )?.definition;

      if (!correctDef || userPairs[term].toLowerCase() !== correctDef.toLowerCase()) {
        newPairColors[term] = "#ff6b6b";
      } else {
        correctPairsCount += 1;
        newPairColors[term] = "#6a9955";
      }
    }
    setPairColors(newPairColors);

    if (correctPairsCount === Object.keys(userPairs).length && currentMatches.length === correctPairsCount) {
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
      setUserPairs({});
      setPairColors({});
      setSelectedTerm(null);
      setPairedTermHistory([]);
      setTimerRunning(true);
      setHasChecked(false);
    } else {
      setShowConfetti(true);
      setTimerRunning(false);
    }
  };

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleGoToLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimerColorClass = () => {
    if (timeLeft <= 30) {
      return "bg-red-500";
    }
    return "bg-[#bca5d4]";
  };

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "tamil" : "english");
  };

  const startGame = () => {
    setShowInstructions(false);
    setTimerRunning(true);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[3vh] font-bold text-gray-600">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];
  const terms = currentQuestion.matches.map((m) => m.term);
  const allPaired = Object.keys(userPairs).length === terms.length;
  const isGameOver = showConfetti || showTimeOutModal;

  return (
    <Background>
      <Logo />
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={false}
        />
      )}
      
      <div className="flex items-center justify-center w-full max-h-screen p-[5%] relative">
        {showInstructions ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-2xl" style={{ borderRadius: '1.5vw', border: '4px solid #bca5d4' }}>
              <h2 className="text-3xl font-bold mb-4">
                {language === "english" ? "🎮 Link and Learn Instructions" : "🎮 இணைத்து கற்றுக்கொள்ளும் விளையாட்டின் வழிமுறைகள்"}
              </h2>
              
              {/* Language Toggle Button */}
              <div className="mb-6">
                <button
                  onClick={toggleLanguage}
                  className="px-4 py-2 rounded-lg text-white font-bold bg-[#7164b4] hover:bg-[#8f9fe4] transition"
                >
                  {language === "english" ? "தமிழ்" : "English"}
                </button>
              </div>
              
              <ul className="text-left mb-6 space-y-3">
                {instructions[language].map((instruction, index) => (
                  <li key={index} className="text-lg">👉  {instruction}</li>
                ))}
              </ul>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-gray-500 hover:bg-gray-600 transition"
                >
                  {language === "english" ? "Back" : "பின்செல்"}
                </button>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#8f9fe4] hover:bg-[#7164b4] transition"
                >
                  {language === "english" ? "Play" : "விளையாடு"}
                </button>
              </div>
            </div>
          </div>
        ) : isGameOver ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center" style={{ borderRadius: '1.5vw', border: '4px solid #bca5d4' }}>
              <h2 className="text-[2.5vw] font-bold mb-4">
                {showTimeOutModal 
                  ? (language === "english" ? "Oops! Clock ran out!" : "அய்யோ! நேரம் முடிந்துவிட்டது!") 
                  : "🎉 " + (language === "english" ? "Congratulations!" : "வாழ்த்துக்கள்!") + " 🎉"}
              </h2>
              <p className="text-xl mb-6">
                {language === "english" ? "You got" : "நீங்கள் பெற்றுள்ளீர்கள்"}&nbsp;
                <span className="font-bold">{correctCount}</span>&nbsp;
                {language === "english" ? "out of" : "வெற்றி, மொத்தம்"}&nbsp;
                <span className="font-bold">{questions.length}</span>&nbsp;
                {language === "english" ? "questions correct." : "கேள்விகள்."}
              </p>
              <p className="text-xl mb-6 font-bold text-indigo-600">
                {language === "english" ? "Your Score:" : "உங்கள் மதிப்பெண்:"} {score} {language === "english" ? "points" : "புள்ளிகள்"}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGoToLeaderboard}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#7164b4] hover:bg-[#8f9fe4] transition"
                >
                  {language === "english" ? "Go to Leaderboard" : "முதலிடம் பட்டியல்"}
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#8f9fe4] hover:bg-[#7164b4] transition"
                >
                  {language === "english" ? "Play Again" : "மீண்டும் விளையாடு"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#BACBFE] to-[#C1DDE8] shadow-xl rounded-[2vh] p-[3%] w-full max-w-[80%]">
            <h1 className="text-[4vh] font-extrabold mb-[1%] text-center">{currentQuestion.question}</h1>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[2%]">
              <p className="text-[2vh] text-gray-600 text-center md:text-left">
                {language === "english" ? "Difficulty:" : "கடினம்:"}{" "}
                <span className="font-bold capitalize">{currentQuestion.difficulty}</span> | {language === "english" ? "Q" : "வ"} {" "}
                {currentQ + 1}/{questions.length}
              </p>
              
              <div className={`flex items-center gap-2 p-2 rounded-full text-white font-bold transition-colors mt-2 md:mt-0 ${getTimerColorClass()}`}>
                <span role="img" aria-label="clock">⏰</span>
                <span className="text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex w-full justify-between gap-[0%]">
              <div className="w-[48%] flex flex-col gap-[2%]">
                <h3 className="text-center font-bold mb-2">{language === "english" ? "Terms" : "வார்த்தைகள்"}</h3>
                {terms.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTermSelect(term)}
                    className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] font-semibold transition mb-[1vh]"
                    style={{
                      backgroundColor: pairColors[term]
                        ? pairColors[term]
                        : selectedTerm === term
                        ? "#bca5d4"
                        : "#ffffff",
                      borderColor: "#e2e8f0",
                      cursor:
                        pairColors[term] || hasChecked ? "not-allowed" : "pointer",
                    }}
                    disabled={!!pairColors[term] || hasChecked}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="w-[48%] flex flex-col gap-[2%]">
                <h3 className="text-center font-bold mb-2">{language === "english" ? "Definitions" : "விளக்கங்கள்"}</h3>
                {shuffledDefs.map((definition) => {
                  const matchedTerm = Object.keys(userPairs).find(
                    (t) => userPairs[t] === definition
                  );
                  return (
                    <button
                      key={definition}
                      onClick={() => handleDefinitionSelect(definition)}
                      disabled={!selectedTerm || matchedTerm || hasChecked}
                      className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] transition"
                      style={{
                        backgroundColor: matchedTerm ? pairColors[matchedTerm] : "#ffffff",
                        borderColor: "#e2e8f0",
                        cursor:
                          !selectedTerm || matchedTerm || hasChecked ? "not-allowed" : "pointer",
                      }}
                    >
                      {definition}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-[4%]">
              <button
                onClick={checkAnswers}
                disabled={!allPaired || hasChecked}
                className={`px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] transition ${
                  !allPaired || hasChecked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#7164b4] hover:scale-105"
                }`}
              >
                {language === "english" ? "Check Answers" : "பதிலை சரிபார்"}
              </button>
              <button
                onClick={handleUndo}
                disabled={pairedTermHistory.length === 0 || hasChecked}
                className={`px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] transition ${
                  pairedTermHistory.length === 0 || hasChecked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:scale-105"
                }`}
              >
                {language === "english" ? "Undo" : "செயல் தவிர்"}
              </button>
              <button
                onClick={handleNext}
                className={`px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] bg-[#8f9fe4] hover:scale-105 transition`}
              >
                {currentQ === questions.length - 1 
                  ? (language === "english" ? "Finish" : "முடி") 
                  : (language === "english" ? "Next ➡️" : "அடுத்தது ➡️")}
              </button>
            </div>
          </div>
        )}
        <Footer />
      </div>
      <BottomNav />
    </Background>
  );
};

export default Match;