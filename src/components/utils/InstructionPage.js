import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Instruction data for each subject
const instructionsData = {
  social: {
    english: [
      "The game has 2 levels, and each level has 3 questions. The total time to finish the game is 120 seconds.",
      "Students must drag the correct letters from the grid to form the answer.",
      "After completing a word, click the Submit button. Use the Clear button if a wrong letter is dragged. Then click the Next button to go to the next question.",
      "A toggle button is available to translate the game into Tamil."
    ],
    tamil: [
      "விளையாட்டில் 2 நிலைகள் உள்ளன, ஒவ்வொரு நிலையிலும் 3 கேள்விகள் உள்ளன. முழு விளையாட்டை முடிக்க 120 விநாடிகள் மட்டுமே தரப்படுகிறது.",
      "மாணவர்கள் பதிலை உருவாக்க சரியான எழுத்துகளை grid-இல் இருந்து இழுத்து விட வேண்டும்.",
      "ஒரு சொல்லை முடித்தவுடன் Submit பொத்தானை அழுத்தவும். தவறான எழுத்து இழுக்கப்பட்டால் Clear பொத்தானை பயன்படுத்தவும். பிறகு Next பொத்தானை அழுத்தி அடுத்த கேள்விக்கு செல்லவும்.",
      "விளையாட்டை தமிழுக்கு மொழிபெயர்க்க Toggle பொத்தானை பயன்படுத்தலாம்."
    ]
  },
  tamil: {
    english: [
      "Objective – Flip the cards and match pairs of synonyms or antonyms.",
      "How to Play – On each turn, flip two cards. If they are a correct pair (synonym or antonym), they remain open. Otherwise, they flip back.",
      "Scoring – Each correct pair earns points. Wrong matches do not earn points.",
      "Winning – The game ends when all pairs are matched. The player with the highest score wins."
    ],
    tamil: [
      "நோக்கம் – அட்டைகளை புரட்டி, இணையான சொற்கள் அல்லது எதிர்ச்சொற்கள் ஜோடியை பொருத்தவும்.",
      "விளையாடும் முறை – ஒவ்வொரு சுற்றிலும் இரண்டு அட்டைகளைத் திறக்கவும். அவை சரியான ஜோடி (இணைச்சொல் அல்லது எதிர்ச்சொல்) என்றால் திறந்தபடி இருக்கும்; இல்லை என்றால் மீண்டும் மூடப்படும்.",
      "மதிப்பெண்கள் – ஒவ்வொரு சரியான ஜோடிக்கும் மதிப்பெண்கள் கிடைக்கும். தவறான ஜோடிக்கு மதிப்பெண்கள் கிடையாது.",
      "வெற்றி – எல்லா ஜோடிகளும் பொருந்திய பிறகு விளையாட்டு முடியும். அதிக மதிப்பெண்கள் பெற்றவர் வெற்றியாளராகிறார்."
    ]
  },
  english: {
    english: [
      "Objective – Flip the cards and match pairs of synonyms or antonyms.",
      "How to Play – On each turn, flip two cards. If they are a correct pair (synonym or antonym), they remain open. Otherwise, they flip back.",
      "Scoring – Each correct pair earns points. Wrong matches do not earn points.",
      "Winning – The game ends when all pairs are matched. The player with the highest score wins."
    ],
    tamil: [
      "நோக்கம் – அட்டைகளை புரட்டி, இணையான சொற்கள் அல்லது எதிர்ச்சொற்கள் ஜோடியை பொருத்தவும்.",
      "விளையாடும் முறை – ஒவ்வொரு சுற்றிலும் இரண்டு அட்டைகளைத் திறக்கவும். அவை சரியான ஜோடி (இணைச்சொல் அல்லது எதிர்ச்சொல்) என்றால் திறந்தபடி இருக்கும்; இல்லை என்றால் மீண்டும் மூடப்படும்.",
      "மதிப்பெண்கள் – ஒவ்வொரு சரியான ஜோடிக்கும் மதிப்பெண்கள் கிடைக்கும். தவறான ஜோடிக்கு மதிப்பெண்கள் கிடையாது.",
      "வெற்றி – எல்லா ஜோடிகளும் பொருந்திய பிறகு விளையாட்டு முடியும். அதிக மதிப்பெண்கள் பெற்றவர் வெற்றியாளராகிறார்."
    ]
  },
  math: {
    english: [
            "Mission – A girl is trapped in a water tank. Your goal is to save her before the tank fills up.",
      "Answer to Rescue – You must answer 6 questions correctly to stop the water from rising.",
      "Timer Rule – The water level increases gradually with time. Answer quickly to reduce the risk.",
      "Game Over – If you fail to answer 6 questions within the given time, the girl will drown."
    ],
    tamil: [
      "பணி – ஒரு பெண் தண்ணீர் தொட்டியில் சிக்கி உள்ளாள். தொட்டி நிரம்புவதற்கு முன் அவளை காப்பாற்ற வேண்டும்.",
      "விடை அளித்து காப்பாற்று – தண்ணீர் உயரும் முன்னர் 6 கேள்விகளுக்கு சரியான விடை அளிக்க வேண்டும்.",
      "நேரம் விதி – நேரம் செல்ல செல்ல தண்ணீரின் அளவு மெதுவாக அதிகரிக்கும். விரைவாக பதில் அளியுங்கள்.",
      "விளையாட்டு முடிவு – கொடுக்கப்பட்ட நேரத்திற்குள் 6 கேள்விகளுக்கு விடை அளிக்கத் தவறினால், பெண் மூழ்கி விடுவாள்."
    ]
  },
  science: {
    english: [
      "The game has 6 riddles in total. You must solve them before the timer (90 seconds) runs out.",
      "Each riddle comes with 3 hints. The first hint is revealed automatically, and you can unlock others if needed.",
      "Select the correct answer from the given options and click the Submit button. Wrong answers can be retried or skipped with the Next button.",
      "At the end of the game, your score will be displayed out of 60, along with the leaderboard 🏆."
    ],
    tamil: [
      "விளையாட்டில் 6 விடுகதைகள் உள்ளன, அவற்றை 90 வினாடிகளில் தீர்க்க வேண்டும்.",
      "ஒவ்வொரு விடுகதைக்கும் 3 குறிப்பு உண்டு, முதல் குறிப்பு தானாகவே காட்டப்படும்.",
      "சரியான தேர்வை தேர்ந்தெடுத்து Submit அழுத்தவும். அடுத்ததிற்கு செல்ல Next பயன்படுத்தவும்.",
      "மொழி மாற்ற Toggle பொத்தானை பயன்படுத்தி ஆங்கிலம்/தமிழ் மாற்றிக்கொள்ளலாம்."
    ]
  },
  physics: null,
  chemistry: null,
  biology: null,
  computerscience: null,
};

// ✅ Reuse math instructions for physics, chemistry, biology, computerscience
instructionsData.physics = instructionsData.math;
instructionsData.chemistry = instructionsData.math;
instructionsData.biology = instructionsData.math;
instructionsData.computerscience = instructionsData.math;

const InstructionPage = () => {
  const [lang, setLang] = useState("english");
  const navigate = useNavigate();
  const { classId, displayName, schoolName, subject } = useParams();

  // Get instructions for the current subject
  // Always fall back to Save The Girl (math) instructions
const currentInstructions = instructionsData[subject] || instructionsData.math;

  
  // Get game titles for different subjects
  const gameTitles = {
    english: {
      social: "🎮 Word Search Instructions",
      tamil: "🎮 Card Flip Memory Game Instructions",
      english: "🎮 Card Flip Memory Game Instructions",
      math: "🎮 Save The Girl Game Instructions",
      science: "🎮 Science Riddle Game Instructions",
      physics: "🎮 Save The Girl Game Instructions",
        chemistry: "🎮 Save The Girl Game Instructions",
        biology: "🎮 Save The Girl Game Instructions",
        computerscience: "🎮 Save The Girl Game Instructions",
    },
    tamil: {
      social: "🎮 வார்த்தை தேடல் விளையாட்டு வழிமுறைகள்",
      tamil: "🎮 அட்டை புரட்டும் நினைவு விளையாட்டு வழிமுறைகள்",
      english: "🎮 அட்டை புரட்டும் நினைவு விளையாட்டு வழிமுறைகள்",
      math: "🎮 பெண்ணை காப்பாற்று விளையாட்டு வழிமுறைகள்",
      science: "🎮 அறிவியல் விடுகதை விளையாட்டு வழிமுறைகள்",
      biology: "🎮 பெண்ணை காப்பாற்று விளையாட்டு வழிமுறைகள்",
      physics: "🎮 பெண்ணை காப்பாற்று விளையாட்டு வழிமுறைகள்",
      chemistry: "🎮 பெண்ணை காப்பாற்று விளையாட்டு வழிமுறைகள்",
      computer: "🎮 பெண்ணை காப்பாற்று விளையாட்டு வழிமுறைகள்",
    }
  };

  // Map subjects to their respective game routes
  const getGameRoute = (subject) => {
    const gameRoutes = {
      social: "/game", // Word Search
      tamil: "/cardflipt", // Card Flip (using subject as language)
      english: "/cardflip", // Card Flip (using subject as language)
      math: "/game", // Save The Girl
      science: "/game", // Riddle Game
    };
    return gameRoutes[subject] || "/game";
  };

  const handleBack = () => {
  navigate(-1); // takes you back to the previous page
};

  const handleStart = () => {
    const gameRoute = getGameRoute(subject);
    // Navigate to the appropriate game based on the subject
    navigate(`/single/${classId}/${displayName}/${schoolName}/${subject}${gameRoute}`);
  };

  const toggleLanguage = () => {
    setLang(lang === "english" ? "tamil" : "english");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "90%",
          maxWidth: "50rem",
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 1rem 2rem rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem", color: "#4f46e5" }}>
          {gameTitles[lang][subject] || gameTitles[lang].social}
        </h2>

        {/* Toggle button */}
        <button
          onClick={toggleLanguage}
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #4f46e5",
            background: "#eef2ff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {lang === "english" ? "தமிழ்" : "English"}
        </button>

        {/* Instructions list */}
        <ul style={{ textAlign: "left", marginBottom: "2rem", fontSize: "1.125rem", lineHeight: "1.75rem" }}>
          {currentInstructions[lang].map((line, idx) => (
            <li key={idx} style={{ marginBottom: "1rem" }}>
              👉 {line}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={handleStart}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              background: "#7FB3E0",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {lang === "english" ? "Skip" : "தவிர்க்க"}
          </button>
          <button
            onClick={handleBack}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              background: "#7FB3E0",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {lang === "english" ? "Back" : " பின் செல்ல"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructionPage;