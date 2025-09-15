import React from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingBackground from './utils/FloatingBackground';
import cardBg from '../assets/card1.gif';
import tnLogo from '../assets/tn.png';
import rmkLogo from '../assets/rmklogo.png';
import haloGif from '../assets/halo.gif';

const Start = () => {
  const navigate = useNavigate();

  const handleLetsPlayClick = () => {
    navigate('/choose');
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

      {/* Top Section Container: Holds RMK Left Card, Science Park Header, and Developers Right Card */}
      <div style={{
        position: 'absolute',
        top: '2vh',
        width: '90vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1vw',
      }}>
        {/* Left Card: RMK Logo and College Name - MODIFIED HERE 👇 */}
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
            minFontSize: 12,
            color: '#334d6e',
            fontWeight: 500,
          }}>
            Designed and Developed By
          </span>
          {/* New div for horizontal alignment of logo and college name */}
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
                minFontSize: 18,
                color: '#164a7d',
                fontWeight: 'bold',
                lineHeight: 1.2,
                letterSpacing: '1px',
              }}>
                R.M.K
              </span>
              <span style={{
                fontSize: '1vw',
                minFontSize: 14,
                color: '#224769',
                fontWeight: 500,
                textAlign: 'left',
                lineHeight: 1.2,
              }}>
                Engineering College
              </span>
            </div>
          </div>
        </div>

        {/* Center Card: Science Park Header */}
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
            SCIENCE PARK THIRUVALLUR DISTRICT
          </span>
        </div>

        {/* Right Card: Developers and Mentor details */}
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
            minFontSize: 12,
            color: '#334d6e',
            fontWeight: 500,
            lineHeight: 1.3,
            opacity: 0.94,
            textAlign: 'left',
          }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Developers: <span style={{ fontWeight: 500 }}>Harirajan S, Dhanesh P, Ganga S, Aglia A, Sruthi Shree CK, Jaisurya L</span></p>
            <p style={{ margin: '0.4vh 0 0', fontWeight: 700 }}>Mentor: <span style={{ fontWeight: 500 }}>Ms. Rekha, Assistant Professor</span></p>
            <p style={{ margin: '0.4vh 0 0', fontWeight: 500 }}>Department of Information Technology - 2027</p>
          </div>
        </div>
      </div>

      {/* Center GIF and button container */}
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
        {/* Added text above the GIF */}
        <span style={{
          fontSize: '2vw',
          fontWeight: '600',
          color: '#265380',
          textAlign: 'center',
          marginTop: '12vh'
        }}>
         MIX AND MATCH CONTEST FOR BUDDING INNOVATORS
        </span>

        <img
          src={haloGif}
          alt="Halo"
          style={{
            width: '40vw',
            height: 'auto',
          }}
        />

        {/* Let's Play Button */}
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
            outline: 'none',
          }}
        >
          Let's Play
        </button>
      </div>
    </div>
  );
};

export default Start;