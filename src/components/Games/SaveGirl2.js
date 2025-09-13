import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import women from "../../assets/womann.png";
import drownData from "../../data/game-11-12.json";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Add useNavigate
import TablaCelebration from "../utils/Celeb";
import Background from "../utils/FloatingBackground";
import BackButton from "../utils/backbutton";
import Footer from "../utils/Footer";
import Logo from "../utils/logo";
import TimerComponent from "../utils/TimerComponent";
import LanguageToggle from "../utils/LanguageToggle";
import { saveResult } from "../utils/leaderboardStorage"; // ✅ Add saveResult
import BottomNav from "../utils/BottomNav";

const SaveGirl2 = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  const { classId, subject } = useParams();
  const [lang, setLang] = useState("en");
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [showWrongPopup, setShowWrongPopup] = useState(false);
  const [hasSavedResult, setHasSavedResult] = useState(false); // ✅ New state

  const handleLanguage = () => {
    setLang(lang === "en" ? "ta" : "en");
  };

  const getRandomFiveIds = useCallback((arr) => {
    const ids = arr.map((q) => q.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids.slice(0, 6);
  }, []);

  // Load questions on classId or subject change (except lang)
  const initializeGame = useCallback(() => {
    if (drownData && classId) {
      let selectedQuestions = [];
      const gradeKey = `class${classId}`;

      if (parseInt(classId) >= 6 && parseInt(classId) <= 10) {
        const classQuestions = drownData[gradeKey];
        if (classQuestions) {
          const mathQuestions = classQuestions.filter(
            (item) => item.subject === "math"
          );
          if (mathQuestions.length) {
            const ids = getRandomFiveIds(mathQuestions);
            setSelectedIds(ids);
            selectedQuestions = ids
              .map((id) => mathQuestions.find((q) => q.id === id))
              .filter((q) => q && q[lang]);
          }
        }
      } else if (parseInt(classId) === 11 || parseInt(classId) === 12) {
        const classData = drownData[gradeKey];
        if (classData && subject) {
          const subData = classData.find(
            (s) => s.subject.toLowerCase() === subject.toLowerCase()
          );
          if (subData && subData.question) {
            selectedQuestions = getRandomFiveIds(subData.question).map((id) =>
              subData.question.find((q) => q.id === id)
            );
            setSelectedIds(selectedQuestions.map((q) => q.id));
          }
        }
      }
      setQuestions(selectedQuestions);
      setCurrentQ(0);
      setAnswer("");
      setGameOver(false);
      setWin(false);
      setScore(0);
      setHasSavedResult(false); // ✅ Reset this state
    }
  }, [classId, subject, lang, getRandomFiveIds]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // On language toggle, update questions array keeping same IDs & currentQ for 6-10 and 11-12
  useEffect(() => {
    if (drownData && classId) {
      const gradeKey = `class${classId}`;

      if (parseInt(classId) >= 6 && parseInt(classId) <= 10) {
        const classQuestions = drownData[gradeKey];
        if (classQuestions && selectedIds.length > 0) {
          const mathQuestions = classQuestions.filter(
            (item) => item.subject === "math"
          );
          const updatedQuestions = selectedIds
            .map((id) => mathQuestions.find((q) => q.id === id))
            .filter((q) => q && q[lang]);
          setQuestions(updatedQuestions);
        }
      } else if (parseInt(classId) === 11 || parseInt(classId) === 12) {
        const classData = drownData[gradeKey];
        if (classData && subject && selectedIds.length > 0) {
          const subData = classData.find(
            (s) => s.subject.toLowerCase() === subject.toLowerCase()
          );
          if (subData && subData.question) {
            const updatedQuestions = selectedIds
              .map((id) => subData.question.find((q) => q.id === id))
              .filter((q) => q && q[lang]);
            setQuestions(updatedQuestions);
          }
        }
      }
    }
  }, [lang, classId, subject, selectedIds]);

  // ✅ New useEffect to handle game over and score saving
  useEffect(() => {
    if (gameOver && !hasSavedResult) {
      const finalScore = win ? 60 : 0;
      setScore(finalScore);

      const profile = JSON.parse(
        localStorage.getItem("player_profile") || "{}"
      );
      const name =
        profile.name || window.prompt("Enter your name") || "Anonymous";
      const school =
        profile.school || window.prompt("Enter your school") || "Unknown School";
      const className = profile.className || "";

      try {
        saveResult({
          name,
          school,
          className,
          score: finalScore,
          game: "SaveTheGirl",
        });
        setHasSavedResult(true);
      } catch (err) {
        console.error("Failed saving leaderboard result:", err);
      }
    }
  }, [gameOver, hasSavedResult, win]);


  // Retry popup handler to dismiss popup and reset answer
  const handleRetry = () => {
    setShowWrongPopup(false);
    setAnswer("");
  };

  // Answer submit handler
  const handleSubmit = () => {
    if (
      answer.trim().toLowerCase() ===
      (lang === "en"
        ? questions[currentQ].en.a
        : questions[currentQ].ta.a
      ).toLowerCase()
    ) {
      setScore(score + 100);
      if (currentQ === questions.length - 1) {
        setWin(true);
        setGameOver(true);
      } else {
        setCurrentQ(currentQ + 1);
        setAnswer("");
      }
    } else {
      setShowWrongPopup(true);
    }
  };

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  const waterLevel = ((currentQ + 1) / (questions.length || 1)) * 100;

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">
          {lang === "en" ? "Loading questions..." : "கேள்விகள் ஏற்றப்படுகிறது..."}
        </p>
      </div>
    );
  }

  return (
    <Background>
      <Logo />
      <div className="flex items-center justify-center w-full h-screen relative">
        {showWrongPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "1rem",
                textAlign: "center",
                width: "80%",
                maxWidth: "400px",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  color: "#e53e3e",
                  marginBottom: "1rem",
                }}
              >
                ❌ Wrong
              </h2>
              <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
                {lang === "en"
                  ? "Please try again!"
                  : " தயவு செய்து மீண்டும் முயற்சி செய்யவும்!"}
              </p>
              <button
                onClick={handleRetry}
                style={{
                  backgroundColor: "#BCA5D4",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 2rem",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(188,165,212,0.7)",
                }}
              >
                {lang === "en" ? "Retry" : "மீண்டும்"}
              </button>
            </div>
          </div>
        )}

        {!gameOver ? (
          <div className="flex flex-col md:flex-row w-[95%] h-[95%] items-center justify-between">
            {/* LEFT SIDE */}
            <div className="flex flex-col items-center justify-between w-full max-w-[50%] h-full p-[3%]">
              {/* HEADER HUD */}
              <div
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                  borderRadius: "20px",
                  padding: "2%",
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.4)",
                  textAlign: "center",
                }}
              >
                <motion.h1
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    fontSize: "5vh",
                    fontWeight: "800",
                    color: "#fff",
                    textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  🛡️ {lang === "en" ? "SAVE THE GIRL!!!" : "பெண்ணை காப்பாற்றுங்கள்!!!"}
                </motion.h1>
                {/* Level & Progress */}
                <div style={{ marginTop: "2%", textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "2.5vh",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    {lang === "en" ? "Level" : "நிலை"} {currentQ + 1}/
                    {questions.length}
                  </p>
                  <div
                    style={{
                      width: "100%",
                      height: "2vh",
                      background: "rgba(255,255,255,0.3)",
                      borderRadius: "10px",
                      marginTop: "1%",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${
                          ((currentQ + 1) / (questions.length || 1)) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: "100%",
                        background:
                          "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
                {/* Score */}
                <p
                  style={{
                    marginTop: "2%",
                    fontSize: "2.3vh",
                    fontWeight: "700",
                    color: "#fff",
                    textShadow: "0px 2px 6px rgba(0,0,0,0.4)",
                  }}
                >
                  ⭐ {lang === "en" ? "Score" : "மதிப்பெண்"}: {score}
                </p>
              </div>
              {/* Tank */}
              <div
                style={{
                  position: "relative",
                  width: "77%",
                  height: "55%",
                  borderWidth: "6px",
                  borderColor: "#BCA5D4",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  boxShadow: "0 0 25px rgba(188,165,212,0.7)",
                  marginTop: "4%",
                }}
              >
                {/* Water rising */}
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    background: "linear-gradient(to top, #1E3A8A, #3B82F6)",
                    zIndex: 20,
                    height: `${waterLevel}%`,
                    opacity: 0.7,
                  }}
                />
                {/* Character */}
                <img
                  src={women}
                  alt="character"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%]"
                />
              </div>
            </div>
            {/* RIGHT SIDE - Quiz */}
            <div
              style={{
                width: "100%",
                height: "85%",
                background: "linear-gradient(135deg, #ffffff, #EFE2FA)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "30px",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
                padding: "3%",
              }}
            >
              {/* Timer Component */}
              <TimerComponent initialTime={60} onTimeUp={() => setGameOver(true)} />
              {/* Question */}
              {questions[currentQ] && questions[currentQ][lang] ? (
                <>
                  <p
                    style={{
                      fontSize: "4vh",
                      fontWeight: "700",
                      marginBottom: "4%",
                    }}
                  >
                    {questions[currentQ][lang].q}
                  </p>
                  {/* Options */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "4%",
                      width: "100%",
                      justifyItems: "center",
                    }}
                  >
                    {questions[currentQ][lang].options.map((opt, i) => {
                      const isSelected = answer === opt;
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAnswer(opt)}
                          style={{
                            width: "90%",
                            height: "8vh",
                            background: isSelected
                              ? "linear-gradient(135deg, #BCA5D4, #EFE2FA)"
                              : "#e5e7eb",
                            color: isSelected ? "white" : "black",
                            fontSize: "2.5vh",
                            fontWeight: "600",
                            borderRadius: "15px",
                            boxShadow: isSelected
                              ? "0px 4px 15px rgba(113,100,180,0.6)"
                              : "0px 2px 6px rgba(0,0,0,0.2)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: "2.5vh", textAlign: "center" }}>
                  {lang === "en"
                    ? "Loading question..."
                    : "கேள்வி ஏற்றப்படுகிறது..."}
                </p>
              )}
              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="mt-[5%]"
                onClick={handleSubmit}
                style={{
                  background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                  color: "white",
                  padding: "2% 5%",
                  borderRadius: "20px",
                  fontSize: "2.8vh",
                  fontWeight: "700",
                  marginTop: "6%",
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                {lang === "en" ? "Submit ✅" : "சமர்ப்பிக்கவும் ✅"}
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-[5%] rounded-[3vh] shadow-2xl relative">
            {win ? (
              <>
                <TablaCelebration show={true} />
                <h1 className="text-[5vh] font-bold text-green-600 mb-[2%] relative z-50">
                  🎉 {lang === "en" ? "You Saved Her!" : "நீங்கள் காப்பாற்றினீர்கள்!"}
                </h1>
                <p className="text-xl mb-6 relative z-50">
                  {lang === "en"
                    ? `Congratulations! Your score is ${score}.`
                    : `வாழ்த்துகள்! உங்கள் மதிப்பெண் ${score}.`}
                </p>
                <div className="flex justify-center gap-4 mt-[5%] relative z-50">
                  <button
                    className="bg-gradient-to-r from-[#BCA5D4] to-[#EFE2FA] text-white px-[6%] py-[2%] rounded-[2vh] text-[2.5vh] font-bold"
                    onClick={handlePlayAgain}
                  >
                    🔄 {lang === "en" ? "Play Again" : "மீண்டும் விளையாடவும்"}
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#BCA5D4] to-[#EFE2FA] text-white px-[6%] py-[2%] rounded-[2vh] text-[2.5vh] font-bold"
                    onClick={handleViewLeaderboard}
                  >
                    🏆 {lang === "en" ? "Leaderboard" : "மதிப்பெண் பட்டியல்"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-[5vh] font-bold text-red-600">
                  💀 {lang === "en" ? "The Character Drowned!" : "பாத்திரம் மூழ்கியது!"}
                </h1>
                <p className="text-xl mb-6 relative z-50">
                  {lang === "en"
                    ? `Game over. Your score is ${score}.`
                    : `விளையாட்டு முடிந்தது. உங்கள் மதிப்பெண் ${score}.`}
                </p>
                <div className="flex justify-center gap-4 mt-[5%] relative z-50">
                  <button
                    className="bg-gradient-to-r from-[#BCA5D4] to-[#EFE2FA] text-white px-[6%] py-[2%] rounded-[2vh] text-[2.5vh] font-bold"
                    onClick={handlePlayAgain}
                  >
                    🔄 {lang === "en" ? "Play Again" : "மீண்டும் விளையாடவும்"}
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#BCA5D4] to-[#EFE2FA] text-white px-[6%] py-[2%] rounded-[2vh] text-[2.5vh] font-bold"
                    onClick={handleViewLeaderboard}
                  >
                    🏆 {lang === "en" ? "Leaderboard" : "மதிப்பெண் பட்டியல்"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
      <LanguageToggle currentLanguage={lang} onPress={handleLanguage} />
      <BackButton />
    </Background>
  );
};

export default SaveGirl2;