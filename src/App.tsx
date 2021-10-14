import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const network = await web3.eth.net.getNetworkType();
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      setNetwork(network);
      setAccount(accounts[0]);
    };
    loadBlockchainData();
  }, []);

  return (
    <div className='container'>
      <h1>Current Network: {network}</h1>
      <h2>Account details:</h2>
      <p>{account}</p>
    </div>
  );
}

export default App;
