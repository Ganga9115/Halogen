import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchData from "../../data/match.json";
import Footer from "../utils/Footer";
import Background from "../utils/FloatingBackground";
import Logo from "../utils/logo";
import Confetti from "react-confetti";
import BottomNav from "../utils/BottomNav";

const Match = () => {
  const { classId, subject, topic } = useParams();
  const navigate = useNavigate();

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

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) =>
    shuffleArray(arr).slice(0, Math.min(n, arr.length));

  useEffect(() => {
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
    const hard = pickRandom(filtered.filter((q) => q.difficulty === "hard"), 1);
    let selected = [...easy, ...medium, ...hard];

    if (selected.length < 5) {
      const remaining = filtered.filter((q) => !selected.includes(q));
      const fill = pickRandom(remaining, 5 - selected.length);
      selected = [...selected, ...fill];
    }
    setQuestions(shuffleArray(selected));
    setScore(0);
    setCorrectCount(0);
    setCurrentQ(0);
    setHasChecked(false);
  }, [classId, subject, topic]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentMatches = questions[currentQ].matches;
      setShuffledDefs(shuffleArray(currentMatches.map((m) => m.definition)));
    }
  }, [questions, currentQ]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setHasChecked(true);
      checkAnswers(true);
      setShowTimeOutModal(true);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  const handleTermSelect = (term) => {
    if (userPairs[term] || hasChecked) return;
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition) => {
    if (!selectedTerm || Object.values(userPairs).includes(definition) || hasChecked) return;
    const newColor = `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')}`;
    const newPair = { [selectedTerm]: definition };
    setUserPairs((prev) => ({ ...prev, ...newPair }));
    setPairColors((prev) => ({ ...prev, [selectedTerm]: newColor }));
    setSelectedTerm(null);
  };

  const checkAnswers = (fromTimer = false) => {
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
      setTimerRunning(true);
      setHasChecked(false);
    } else {
      setShowConfetti(true);
      setTimerRunning(false);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQ(0);
    setCorrectCount(0);
    setUserPairs({});
    setPairColors({});
    setSelectedTerm(null);
    setTimeLeft(180);
    setTimerRunning(true);
    setHasChecked(false);
    setScore(0);
    setShowConfetti(false);
    setShowTimeOutModal(false);
  };

  const handleGoToDashboard = () => {
    navigate("/leaderBoard");
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
  const isGameOver = currentQ === questions.length - 1 && hasChecked && !timerRunning && timeLeft === 0;

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
        {(isGameOver || (currentQ === questions.length - 1 && hasChecked)) || showTimeOutModal ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                {showTimeOutModal ? "Oops! Clock ran out!" : "🎉 Congratulations! 🎉"}
              </h2>
              <p className="text-xl mb-6">
                You got&nbsp;
                <span className="font-bold">{correctCount}</span> out of&nbsp;
                <span className="font-bold">{questions.length}</span> questions correct.
              </p>
              <p className="text-xl mb-6 font-bold text-indigo-600">
                Your Score: {score} points
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#7164b4] hover:bg-[#8f9fe4] transition"
                >
                  Go to LeaderBoard
                </button>
                <button
                  onClick={handlePlayAgain}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-[#8f9fe4] hover:bg-[#7164b4] transition"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#BACBFE] to-[#C1DDE8] shadow-xl rounded-[2vh] p-[3%] w-full max-w-[80%]">
            <h1 className="text-[4vh] font-extrabold mb-[1%] text-center">{currentQuestion.question}</h1>
            
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-[2%] relative">
              <p className="text-[2vh] text-gray-600 text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                Difficulty:{" "}
                <span className="font-bold capitalize">{currentQuestion.difficulty}</span> | Q{" "}
                {currentQ + 1}/{questions.length}
              </p>
              
              <div className={`flex items-center gap-2 p-2 rounded-full text-white font-bold transition-colors md:ml-auto mt-2 md:mt-0 ${getTimerColorClass()}`}>
                <span role="img" aria-label="clock">⏰</span>
                <span className="text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex w-full justify-between gap-[0%]">
              <div className="w-[48%] flex flex-col gap-[2%]">
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
                    disabled={!!pairColors[term] && !hasChecked || hasChecked}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="w-[48%] flex flex-col gap-[2%]">
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
                Check Answers
              </button>
              <button
                onClick={handleNext}
                className="px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] bg-[#8f9fe4] hover:scale-105 transition"
              >
                {currentQ === questions.length - 1 ? "Finish" : "Next ➡️"}
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