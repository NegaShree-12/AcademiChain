import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add MetaMask detection script
if (typeof window.ethereum === "undefined") {
  console.warn("MetaMask is not installed - using demo mode");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
