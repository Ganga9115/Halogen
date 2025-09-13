import React, { useState, useRef, useEffect } from "react";
import adjectives from "../../data/alliterations.json";
import { useNavigate } from "react-router-dom";
import Background from "../utils/FloatingBackground";
import Logo from '../utils/logo';
import BottomNav from "../utils/BottomNav";

// Player form component
function PlayerForm({ playerNumber, playerData, onUpdate, onNext, isLastPlayer }) {
  const [nickname, setNickname] = useState(playerData.nickname || "");
  const [displayName, setDisplayName] = useState(playerData.displayName || "");

  useEffect(() => {
    setNickname(playerData.nickname || "");
    setDisplayName(playerData.displayName || "");
  }, [playerNumber]);

  const generateAlliteration = (name) => {
    if (!name) return "";
    const firstLetter = name.charAt(0).toUpperCase();
    const wordList = adjectives[firstLetter] || [];
    if (wordList.length === 0) return name;

    const adjective = wordList[Math.floor(Math.random() * wordList.length)];
    return `${adjective} ${name}`;
  };

  const handleNicknameChange = (value) => {
    const cleanName = value.replace(/\s/g, "");
    if (cleanName.length > 0) {
      const formattedName =
        cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      setNickname(formattedName);
      const newDisplayName = generateAlliteration(formattedName);
      setDisplayName(newDisplayName);
      onUpdate(playerNumber, {
        nickname: formattedName,
        displayName: newDisplayName,
      });
    } else {
      setNickname("");
      setDisplayName("");
      onUpdate(playerNumber, {
        nickname: "",
        displayName: "",
      });
    }
  };

  const handleNext = () => {
    if (nickname) onNext();
  };

  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-[4vh] font-bold mb-6" style={{ color: "#351D6B" }}>
        Player {playerNumber} Details
      </h2>

      <div className="w-full mb-6">
        <h2 className="text-[3vh] font-bold text-[#202345] mb-4">
          What's your nickname?
        </h2>
        <div
          className="w-full flex items-center rounded-full border"
          style={{ borderColor: "#351D6B", borderWidth: 3, width: "100%" }}
        >
          <input
            type="text"
            maxLength={10}
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder={`Enter Player ${playerNumber} nickname`}
            className="flex-grow py-[2vh] px-[2vw] rounded-l-full border-none text-[#351D6B] text-[2.2vh] outline-none"
            style={{ height: "7vh", border: "none" }}
          />
          <button
            onClick={handleNext}
            disabled={!nickname}
            className="rounded-r-full px-[2vw] py-[2vh] font-semibold text-lg transition disabled:opacity-50"
            style={{
              height: "7vh",
              color: "#351D6B",
              background: "linear-gradient(90deg, #A18CD1 0%, #FBC2EB 100%)",
              border: "none",
            }}
          >
            {isLastPlayer ? "Start Game" : "Next Player"}
          </button>
        </div>
        {displayName && (
          <div className="text-sm text-[#351D6B] mt-3 font-medium">
            Suggested: {displayName}
          </div>
        )}
        <div className="text-[2vh] text-[#878B9A] mt-2 text-center">
          Maximum of 10 characters. Space not allowed.
        </div>
      </div>
    </div>
  );
}

export default function MultiplayerInput() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [players, setPlayers] = useState({
    1: { nickname: "", displayName: "" },
    2: { nickname: "", displayName: "" },
  });
  const navigate = useNavigate();

  const updatePlayerData = (playerNumber, data) => {
    setPlayers((prev) => ({
      ...prev,
      [playerNumber]: data,
    }));
  };

  const handleNext = () => {
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
    } else {
      // Both players completed, navigate to XO game
      navigate("/xo", {
        state: {
          player1: {
            name: players[1].displayName || players[1].nickname,
          },
          player2: {
            name: players[2].displayName || players[2].nickname,
          },
        },
      });
    }
  };

  return (
    <Background>
      <Logo />
      <div className="relative w-screen h-screen">
        {/* Card container */}
        <div
          className="absolute backdrop-blur-lg bg-gradient-to-br from-[#e3e2f7]/80 to-[#cbcdda]/80 p-8 rounded-3xl shadow-2xl flex flex-col justify-between"
          style={{
            width: "44%",
            minHeight: "40%",
            top: "20%",
            left: "28%",
          }}
        >
          {/* Step indicators */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-[2vh] w-[12vw] rounded-full ${
                  currentPlayer === s ? "bg-[#9083D2]" : "bg-[#d1c9fa]"
                }`}
              />
            ))}
          </div>

          {/* Player form */}
          <div className="flex-grow flex flex-col justify-center">
            <PlayerForm
              playerNumber={currentPlayer}
              playerData={players[currentPlayer]}
              onUpdate={updatePlayerData}
              onNext={handleNext}
              isLastPlayer={currentPlayer === 2}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </Background>
  );
}
