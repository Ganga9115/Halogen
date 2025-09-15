import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingBackground from './utils/FloatingBackground';
import cardBg from '../assets/card1.gif';
import tnLogo from '../assets/tn.png';
import rmkLogo from '../assets/rmklogo.png';
import haloGif from '../assets/halo.gif';
import BottomNav from "./utils/BottomNav"

const Start = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en"); // default English

  const handleLetsPlayClick = () => {
    navigate('/choose');
  };

  const handleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ta" : "en"));
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

      {/* Language Toggle Button */}
      {/* <button
        onClick={handleLanguage}
        style={{
          position: "absolute",
          top: "2vh",
          right: "2vw",
          padding: "0.6vh 1.2vw",
          borderRadius: "1vw",
          border: "none",
          backgroundColor: "#265380",
          color: "#fff",
          fontSize: "0.9vw",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {language === "en" ? "தமிழ்" : "English"}
      </button> */}

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
            height: '18vh',
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
              }}>
                {language === "en"
              ? "R.M.K"
              : "ஆர்.எம்.கே"}
              </span>
              <span style={{
                fontSize: '1vw',
                color: '#224769',
                fontWeight: 500,
              }}>
                {language === "en" ? "Engineering College" : "பொறியியல் கல்லூரி"}
              </span>
            </div>
          </div>
        </div>

        {/* Center Card */}
        <div
          style={{
            flex: 0.5,
            minWidth: 400,
            height: '18vh',
            borderRadius: '1vw',
            backgroundImage: `url(${cardBg})`,
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
            fontSize: '2vw',
            fontWeight: '600',
            color: '#fff',
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00c3ff, 0 0 40px #00c3ff, 0 0 50px #00c3ff'
          }}>
            {language === "en"
              ? "SCIENCE PARK THIRUVALLUR DISTRICT"
              : "அறிவியல் பூங்கா திருவள்ளூர் மாவட்டம்"}
          </span>
        </div>

        {/* Right Card */}
        <div
          style={{
            flex: 0.4,
            minWidth: 300,
            height: '18vh',
            minHeight: 120,
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1vw',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '1vw',
          }}
        >
          <div style={{
            fontSize: '0.85vw',
            color: '#334d6e',
            fontWeight: 500,
            lineHeight: 1.3,
            opacity: 0.94,
            textAlign: 'left',
          }}>
            {language === "en" ? (
              <>
                <p style={{ margin: 0, fontWeight: 700 }}>Developers: <span style={{ fontWeight: 500 }}>Harirajan S, Dhanesh P, Ganga S, Aglia A, Sruthi Shree CK, Jaisurya L</span></p>
                <p style={{ margin: '0.4vh 0 0', fontWeight: 700 }}>Mentor: <span style={{ fontWeight: 500 }}>Ms. Rekha, Assistant Professor</span></p>
                <p style={{ margin: '0.4vh 0 0', fontWeight: 500 }}>Department of Information Technology - 2027</p>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 700 }}>உருவாக்குநர்கள்: <span style={{ fontWeight: 500 }}>ஹரிராஜன் S, தனேஷ் P, கங்கா S, அகிலா A, ஸ்ருதி ஸ்ரீ CK, ஜெய்சூர்யா L</span></p>
                <p style={{ margin: '0.4vh 0 0', fontWeight: 700 }}>ஆசிரியர்: <span style={{ fontWeight: 500 }}>மெஸ். ரேகா, உதவி பேராசிரியர்</span></p>
                <p style={{ margin: '0.4vh 0 0', fontWeight: 500 }}>தகவல் தொழில்நுட்ப துறை - 2027</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center GIF and button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2vw',
        }}
      >
        <span style={{
          fontSize: '2vw',
          fontWeight: '600',
          color: '#265380',
          textAlign: 'center',
          marginTop: '12vh'
        }}>
          {language === "en"
            ? "MIX AND MATCH CONTEST FOR BUDDING INNOVATORS"
            : "புதிய கண்டுபிடிப்பாளர்களுக்கான கலந்து பொருத்தும் போட்டி"}
        </span>

        <img
          src={haloGif}
          alt="Halo"
          style={{
            width: '20vw',
            height: 'auto',
          }}
        />

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
          {language === "en" ? "Let's Play" : "விளையாட தொடங்குவோம்"}
        </button>
      </div>
      <BottomNav onPress={handleLanguage} />
    </div>
  );
};

export default Start;