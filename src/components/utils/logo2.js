import React from "react";
import LogoImage from "../../assets/logo123.png";

const Logo2 = () => {
  return (
    <div style={styles.logoContainer}>
      <img src={LogoImage} alt="Logo" style={styles.logoImage} />
    </div>
  );
};

const styles = {
  logoContainer: {
    position: "fixed", // stays on top-left even when scrolling
    top: "15px",
    right: "15px",
    zIndex: 1000,
  },
  logoImage: {
    width: "120px",    // fixed size, responsive enough
    height: "auto",
    objectFit: "contain",
  },
};

export default Logo2;
