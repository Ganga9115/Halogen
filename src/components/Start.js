import React from 'react';
import rmklogo from '../assets/rmklogo.png';
import logo from '../assets/logo.png';

const Start = () => {
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
        alignItems: 'center',
        position: 'absolute',
        top: '2vh',
        left: 0,
        padding: '0 2vw'
      }}>
        <img src={logo} alt="App Logo" style={{
          width: '10vw',
          height: 'auto'
        }} />
        <img src={rmklogo} alt="RMK Logo" style={{
          width: 'vw',
          height: 'auto'
        }} />
      </div>

      {/* Centered text */}
      <div style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h1 style={{ fontSize: '4vw', fontWeight: 'bold', margin: 0 }}>
          Welcome to the Thiruvallur Science Quiz
        </h1>
        <h2 style={{ fontSize: '3vw', fontWeight: '600', margin: '2vh 0 0 0' }}>
          R.M.K. Engineering College
        </h2>
        <h3 style={{ fontSize: '2.2vw', fontWeight: '500', margin: '1vh 0 4vh 0' }}>
          Information Technology Department
        </h3>

        <button style={{
          fontSize: '2vw',
          padding: '1vh 3vw',
          borderRadius: '1vw',
          border: 'none',
          backgroundColor: '#4B6CB7',
          color: '#fff',
          cursor: 'pointer'
        }}>
          Let’s Play
        </button>
      </div>

      {/* Creators list */}
      <div style={{
        position: 'absolute',
        right: '2vw',
        bottom: '4vh',
        textAlign: 'right',
        fontSize: '1.5vw',
        fontWeight: '500',
        lineHeight: '3vh'
      }}>
        <div>Ganga S</div>
        <div>Agila A</div>
        <div>Sruthi Shree CK</div>
        <div>Dhanesh P</div>
        <div>Jaisurya L</div>
        <div>Harirajan S</div>
      </div>
    </div>
  )
}

export default Start;
