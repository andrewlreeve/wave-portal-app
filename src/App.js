import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import WavePortal from "./utils/WavePortal.json"

export default function App() {
  // State variable to store our user's public wallet
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x69E04dd02FD0184C7a708C67D246Db78e65a3D68";
  const contractABI = WavePortal.abi; 

  // Run our function when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      // First make sure we have access to window.ethereum
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorised to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum ) {
        alert("Get Metamask");
        return;
      } 

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllWaves() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();
        // we only need address, timestamp and message in our UI
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        // store our data in React State
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error); 
    } 
  }

  async function wave() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        // Execute the actual wave from the smart contract
        const waveTxn = await wavePortalContract.wave("This is an example message"); //TODO
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        await getAllWaves();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }  
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
        
        {!currentAccount && (
          <button className="interactButton" onClick={connectWallet}>
            Connect Metamask
          </button>
        )}

        {currentAccount && (
          <button className="interactButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        {currentAccount && (
          <button className="interactButton" onClick={shaka}>
            Shaka at Me
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="waveList">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
