import React from "react";
import { useParams } from "react-router-dom";
import CardflippingT from "../Games/CardflippingT";
import Cardflipping from "../Games/Cardflipping";
import SaveTheGirl from "../Games/SaveTheGirl";
import Riddle from "../Games/Riddle";
import WordSearchGame from "../Games/WordSearchGame";
import SaveGirl2 from "../Games/SaveGirl2";
import BottomNav from "../utils/BottomNav"; // ✅ import

const Game = () => {
  const { classId, subject } = useParams();

  return (
    <div className="relative min-h-screen pb-16">
      {/* 🎮 Game rendering */}
      
      {classId > 10 && <SaveGirl2 />}
      {subject === "tamil" && <CardflippingT />}
      {subject === "english" && <Cardflipping />}
      {subject === "math" && classId <=10 && <SaveTheGirl />}
      {subject === "science" && <Riddle />}
      {subject === "social studies" && <WordSearchGame />}

  
    </div>
  );
};

export default Game;