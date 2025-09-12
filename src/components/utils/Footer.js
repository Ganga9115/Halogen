export default function Footer() {
  return (
    <footer
      style={{
      
        color: "green",
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100vw",
        height: "8vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex:10
       
      }}
    >
      <p style={{ fontSize: "4vh",fontWeight:"500" }}>Designed by @RMKEC</p>
    </footer>
  );
}
