import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }

  const shaka = () => {

  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Hello
        </div>

        <div className="bio">
          How are you feeling today?
          Connect your Ethereum wallet and give me a 👋  or 🤙
        </div>

        <button className="interactButton" onClick={wave}>
          Wave at Me
        </button>

        <button className="interactButton" onClick={shaka}>
          Shaka at Me
        </button>
      </div>
    </div>
  );
}
