import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Gamepad2, Trophy, Languages } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 px-3 py-1.5 bg-white/30 backdrop-blur-lg rounded-full shadow-lg">
      
      {/* Back */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full border border-purple-300 flex items-center justify-center bg-gradient-to-tr from-purple-200 to-purple-300 shadow-md hover:scale-110 transition-transform"
        >
          <ArrowLeft size={14} className="text-purple-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-purple-200 opacity-50"
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
          onClick={() => navigate("/chooseSorM")}
          className="w-8 h-8 rounded-full border border-blue-300 flex items-center justify-center bg-gradient-to-tr from-blue-200 to-blue-300 shadow-md hover:scale-110 transition-transform"
        >
          <Home size={14} className="text-blue-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-blue-200 opacity-50"
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
          onClick={() => navigate("/SinglePlayer/selectSubject")}
          className="w-8 h-8 rounded-full border border-pink-300 flex items-center justify-center bg-gradient-to-tr from-pink-200 to-pink-300 shadow-md hover:scale-110 transition-transform"
        >
          <Gamepad2 size={14} className="text-pink-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-pink-200 opacity-50"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-pink-500">
          Game
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate("/SinglePlayer/leaderBoard")}
          className="w-8 h-8 rounded-full border border-yellow-300 flex items-center justify-center bg-gradient-to-tr from-yellow-200 to-yellow-300 shadow-md hover:scale-110 transition-transform"
        >
          <Trophy size={14} className="text-yellow-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-yellow-200 opacity-50"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-yellow-500">
          Leaderboard
        </div>
      </div>

      {/* Language Toggle */}
      <div className="relative group cursor-pointer">
        <div
          onClick={() => navigate("/language-toggle")}
          className="w-8 h-8 rounded-full border border-green-300 flex items-center justify-center bg-gradient-to-tr from-green-200 to-green-300 shadow-md hover:scale-110 transition-transform"
        >
          <Languages size={14} className="text-green-700" />
          <motion.div
            className="absolute w-9 h-9 rounded-full border border-green-200 opacity-50"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[7px] font-semibold text-green-500">
          Language
        </div>
      </div>
    </div>
  );
}
