import React, { useState, useEffect } from "react";

const TimerComponent = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerColor, setTimerColor] = useState("#90EE90");

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  // Update color dynamically
  useEffect(() => {
    if (timeLeft > initialTime * 0.5) {
      setTimerColor("#90EE90");
    } else if (timeLeft > initialTime * 0.25) {
      setTimerColor("orange");
    } else {
      setTimerColor("red");
    }
  }, [timeLeft, initialTime]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: "5%",
      }}
    >
      <div
        style={{
          width: "15vh",
          height: "15vh",
          borderRadius: "50%",
          border: `6px solid ${timerColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5vh",
          fontWeight: "700",
          color: "black",
          boxShadow: `0 0 20px ${timerColor}`,
          background: "rgba(0,0,0,0)",
        }}
      >
        ⏳ {timeLeft}s
      </div>
    </div>
  );
};

export default TimerComponent;
