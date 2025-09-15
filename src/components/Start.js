import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingBackground from './utils/FloatingBackground';
import cardBg from '../assets/card1.gif';
import tnLogo from '../assets/tn.png';
import rmkLogo from '../assets/rmklogo.png';
import haloGif from '../assets/halo.gif';
import BottomNav from './utils/BottomNav';

const Start = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en"); // en = English, ta = Tamil

  const handleLetsPlayClick = () => {
    navigate('/choose');
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "en" ? "ta" : "en"));
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <FloatingBackground />

      {/* Top Section Container */}
      <div style={{
        position: 'absolute',
        top: '2vh',
        width: '90vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1vw',
      }}>
        {/* Left Card */}
        <div
          style={{
            flex: 0.4,
            minWidth: 300,
            height: '23vh',
            minHeight: 120,
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1vw',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1vw',
          }}
        >
          <span style={{
            marginBottom: '0.5vh',
            opacity: 0.95,
            textAlign: 'center',
            fontSize: '0.85vw',
            color: '#334d6e',
            fontWeight: 500,
          }}>
             {language === "en" ? "Designed and Developed By" : "வடிவமைத்து உருவாக்கியவர்கள்"}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1vh',
          }}>
            <img
              src={rmkLogo}
              alt="RMK Logo"
              style={{
                width: '4vw',
                minWidth: 50,
                height: 'auto',
                filter: 'drop-shadow(0 0 5px #757fa8) drop-shadow(0 0 10px #757fa8)',
                marginRight: '1vw',
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
              <span style={{
                fontSize: '1.5vw',
                color: '#164a7d',
                fontWeight: 'bold',
                lineHeight: 1.2,
                letterSpacing: '1px',
              }}>
                {language === "en"
              ? "R.M.K"
              : "ஆர்.எம்.கே"}
              </span>
              <span style={{
                fontSize: '1vw',
                color: '#224769',
                fontWeight: 500,
                textAlign: 'left',
                lineHeight: 1.2,
              }}>
                {language === "en" ? "Engineering College" : "பொறியியல் கல்லூரி"}
              </span>
              <span style={{
                fontSize: '1vw',
                color: '#224769',
                fontWeight: 500,
                textAlign: 'left',
                lineHeight: 1.2,
              }}>
                {language === "en" ? "An Autonomous Institution" : "சுயாட்சி நிறுவனம்"}
              </span>
            </div>
          </div>
        </div>

        {/* Center Card */}
        <div
          style={{
            flex: 0.5,
            minWidth: 400,
            height: '23vh',
            borderRadius: '1vw',
            backgroundColor:"#4B6CB7",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1vw',
            padding: '0 2vw',
            color: '#fff',
          }}
        >
          <img src={tnLogo} alt="TN Logo" style={{ width: '4vw', height: 'auto', marginRight: '1vw' }} />
          <span style={{
            fontSize: '1.9vw',
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 0 5px #fff,  0 0 5px #00c3ff, 0 0 5px #00c3ff'
          }}>
            {language === "en" ? "SCIENCE PARK THIRUVALLUR DISTRICT" : "அறிவியல் பூங்கா திருவள்ளூர் மாவட்டம்"}
          </span>
        </div>

        {/* Right Card */}
<div
  style={{
    flex: 0.4,
    minWidth: 300,
    height: "23vh",
    minHeight: 120,
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: "1vw",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "1vw",
  }}
>
  <div
    style={{
      fontSize: "0.85vw",
      color: "#334d6e",
      fontWeight: 500,
      lineHeight: 1.4,
      opacity: 0.94,
      width: "100%",
    }}
  >
    {/* Title */}
    <p style={{ margin: 0, fontWeight: 700, textAlign: "left", marginLeft: 140 }}>
      {language === "en" ? "Developers:" : "உருவாக்கியவர்கள்:"}
    </p>

    {/* Two Column Names */}
    <div
      style={{
    display: "grid",
    gridTemplateColumns: "auto auto", // 🔽 both columns shrink to content
    columnGap: "2vw",                 // adjust this for spacing
    rowGap: "0.5vh",
    justifyContent: "center",         // keeps both centered together
    marginTop: "0.5vh",
  }}
    >
      <span>{language === "en" ? "Harirajan S" : "ஹரிராஜன் செ"}</span>
      <span>{language === "en" ? "Ganga S" : "கங்கா சு"}</span>
      <span>{language === "en" ? "Dhanesh P" : "தனேஷ் பி"}</span>
      <span>{language === "en" ? "Aglia A" : "அகிலா ஏ"}</span>
      <span>{language === "en" ? "Jaisurya L" : "ஜெய்சூர்யா லி"}</span>
      <span>{language === "en" ? "Sruthi Shree CK" : "கு.கி. ஸ்ருதி ஸ்ரீ"}</span>
    </div>

    {/* Mentor */}
    <p
      style={{
        margin: "0.6vh 0 0",
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      {language === "en" ? "Mentor:" : "ஆசிரியர்:"}{" "}
      <span style={{ fontWeight: 500 }}>
        {language === "en"
          ? "Ms.M.Rekha M.E phd, Assistant Professor / IT - RMKEC"
          : "திருமதி.ம.ரேகா M.E phd, உதவி பேராசிரியர் / தகவல் தொழில்நுட்பத் துறை – ஆர்.எம்.கே பொறியியல் கல்லூரி"}
      </span>
    </p>

    {/* Department */}
    <p
      style={{
        margin: "0.4vh 0 0",
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      {language === "en"
        ? "Department of Information Technology - 2027"
        : "தகவல் தொழில்நுட்ப துறை - 2027"}
    </p>
  </div>
</div>

      </div>

      {/* Center Content */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2vh',
          marginTop:"4vh"
        }}
      >
        {/* Heading */}
        <span
          style={{
            fontSize: '2.5vw',
            fontWeight: '800',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6A82FB, #4B6CB7, #265380, #4B6CB7, #6A82FB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '1px',
          }}
        >
          {language === "en"
            ? "MIX AND MATCH CONTEST FOR BUDDING INNOVATORS"
            : "புதிய கண்டுபிடிப்பாளர்களுக்கான கலந்து பொருத்தும் போட்டி"}
        </span>

        {/* GIF */}
        <img
          src={haloGif}
          alt="Halo"
          style={{
            width: '20vw',
            height: 'auto',
          }}
        />

        {/* Halogen text */}
        <h2
          style={{
            fontSize: "2.5vw",
            fontWeight: "900",
            background: "linear-gradient(135deg, #4B6CB7, #265380, #6A82FB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "2px",
            margin: 0,
          }}
        >
          HALOGEN
        </h2>

        {/* Button */}
        <button
          onClick={handleLetsPlayClick}
          style={{
            fontSize: '1.5vw',
            fontWeight: '600',
            padding: '1.5vh 3vw',
            borderRadius: '2vw',
            border: 'none',
            backgroundColor: '#4B6CB7',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          {language === "en" ? "Let's Play" : "விளையாடுவோம்"}
        </button>
      </div>

      {/* Toggle Button */}
      {/* <button
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          bottom: '2vh',
          right: '2vw',
          padding: '1vh 2vw',
          borderRadius: '1vw',
          border: 'none',
          backgroundColor: '#265380',
          color: '#fff',
          fontSize: '1vw',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
      >
        {language === "en" ? "தமிழ்" : "English"}
      </button> */}
      <BottomNav onPress={toggleLanguage}/>
    </div>
  );
};

export default Start;