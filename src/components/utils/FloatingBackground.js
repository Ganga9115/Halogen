// src/components/AppBackground.js
import React from "react";

const AppBackground = ({ children }) => {
  return <div style={styles.container}>{children}</div>;
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",            // using vh instead of px
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default AppBackground;
