import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home, Gamepad2, Trophy, Languages, Music } from "lucide-react";
import musicFile from "../../assets/music.mp3";

export default function BottomNav({ onPress }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Disable game button if path is "/" or "/single"
  const disableGame = location.pathname === "/" || location.pathname === "/single";

  // 🎵 Music state
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6; // adjust if needed
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="absolute bottom-[30%] left-[0%] z-20 flex flex-col items-center gap-4 px-3 py-4 bg-white/30 backdrop-blur-lg rounded-full shadow-lg">
      {/* Hidden Audio */}
      <audio ref={audioRef} src={musicFile} autoPlay loop />

      {/* Back */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full border border-purple-300 flex items-center justify-center bg-gradient-to-tr from-purple-200 to-purple-300 shadow-md hover:scale-110 transition-transform"
        >
          <ArrowLeft size={14} className="text-purple-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-purple-200 opacity-50 pointer-events-none"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-purple-500">
          Back
        </div>
      </div>

      {/* Home */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full border border-blue-300 flex items-center justify-center bg-gradient-to-tr from-blue-200 to-blue-300 shadow-md hover:scale-110 transition-transform"
        >
          <Home size={14} className="text-blue-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-blue-200 opacity-50 pointer-events-none"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-blue-500">
          Home
        </div>
      </div>

      {/* Game */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => {
            if (!disableGame) {
              const parts = location.pathname.split("/");
              if (parts.length >= 5 && parts[1] === "single") {
                const basePath = `/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}`;
                navigate(basePath);
              }
            }
          }}
          className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-md transition-transform
            ${disableGame 
              ? "border-gray-300 bg-gray-200 cursor-not-allowed opacity-50" 
              : "border-pink-300 bg-gradient-to-tr from-pink-200 to-pink-300 hover:scale-110"}`}
        >
          <Gamepad2 size={14} className={disableGame ? "text-gray-500" : "text-pink-700"} />
          {!disableGame && (
            <motion.div
              className="absolute w-9 h-9 rounded-full border border-pink-200 opacity-50 pointer-events-none"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>
        <div
          className={`absolute -top-5 left-1/2 transform -translate-x-1/2 text-[7px] font-semibold
            ${disableGame ? "text-gray-400 opacity-100" : "text-pink-500 opacity-0 group-hover:opacity-100"}`}
        >
          Game
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate("/leaderBoard")}
          className="w-8 h-8 rounded-full border border-yellow-300 flex items-center justify-center bg-gradient-to-tr from-yellow-200 to-yellow-300 shadow-md hover:scale-110 transition-transform"
        >
          <Trophy size={14} className="text-yellow-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-yellow-200 opacity-50 pointer-events-none"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-yellow-500">
          Leaderboard
        </div>
      </div>

      {/* Language Toggle */}
      <div className="relative group cursor-pointer z-auto">
        <div
          onClick={onPress}
          className="w-8 h-8 rounded-full border border-green-300 flex items-center justify-center bg-gradient-to-tr from-green-200 to-green-300 shadow-md hover:scale-110 transition-transform"
        >
          <Languages size={14} className="text-green-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-green-200 opacity-50 pointer-events-none"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-green-500">
          Language
        </div>
      </div>

      {/* 🎵 Music Toggle */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-md transition-transform
            ${isPlaying 
              ? "border-red-300 bg-gradient-to-tr from-red-200 to-red-300 hover:scale-110" 
              : "border-gray-300 bg-gray-200"}`}
        >
          <Music size={14} className={isPlaying ? "text-red-700" : "text-gray-500"} />
          {isPlaying && (
            <motion.div
              className="absolute w-9 h-9 rounded-full border border-red-200 opacity-50 pointer-events-none"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>
        <div
          className={`absolute -top-5 left-1/2 transform -translate-x-1/2 text-[7px] font-semibold
            ${isPlaying ? "text-red-500 opacity-0 group-hover:opacity-100" : "text-gray-400 opacity-100"}`}
        >
          {isPlaying ? "Music On" : "Music Off"}
        </div>
      </div>
    </div>
  );
}
