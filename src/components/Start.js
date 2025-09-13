import React from 'react';
import { useNavigate } from 'react-router-dom';
import rmklogo from '../assets/rmklogo.png';
import logo from '../assets/logo.png';

const Start = () => {
  const navigate = useNavigate();

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

      {/* Top bar with logos */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // keep logos at top
        position: 'absolute',
        top: '1vh', // moved higher
        left: 0,
        padding: '0 2vw'
      }}>
        <img src={logo} alt="App Logo" style={{
          width: '8vw',
          height: 'auto'
        }} />
        <img src={rmklogo} alt="RMK Logo" style={{
          width: '4vw',
          height: 'auto'
        }} />
      </div>

      {/* Centered text */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '-25vh' // pulled up a bit
      }}>
        <h1 style={{ fontSize: '3.5vw', fontWeight: 'bold', margin: '0 0 1vh 0',fontFamily: 'Georgia, serif', color: '#2A60A0' }}>
          Welcome to the Thiruvallur Science Quiz
        </h1>
        <h2 style={{ fontSize: '2.8vw', fontWeight: '600', margin: '1vh 0 0 0',fontFamily: 'Georgia, serif',  color: '#2A60A0' }}>
          R.M.K. Engineering College
        </h2>
        <h3 style={{ fontSize: '2vw', fontWeight: '500', margin: '1vh 0 5vh 0',fontFamily: 'Georgia, serif', color: '#2A60A0' }}>
          Information Technology Department
        </h3>
      </div>

      {/* Button in the center */}
<button
  onClick={() => navigate('/choose')}
  style={{
    fontSize: '2vw',
    padding: '1.2vh 3.5vw',
    borderRadius: '1vw',
    border: 'none',
    backgroundColor: '#4B6CB7',
    color: '#fff',
    cursor: 'pointer',
    position: 'absolute',
    top: '65%',   // moved further down
    transform: 'translateY(-50%)'
  }}
>
  Let’s Play
</button>
  {/* Creators list */}
      <div style={{
        position: 'absolute',
        right: '2vw',
        bottom: '4vh',
        textAlign: 'left',
        fontSize: '1.5vw',
        fontWeight: '400',
        lineHeight: '4vh'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '1vh' }}>Created By:</div>
        
        <div>Harirajan S</div><div>Dhanesh P</div>
        <div>Jaisurya L</div>
        <div>Ganga S</div>
        <div>Agila A</div>
        <div>Sruthi Shree CK</div>
        
      </div>
    </div>
  )
}

export default Start;
