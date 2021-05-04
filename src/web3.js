import Web3 from 'web3';

// We are assuming that the user has the MetaMask chrome extension installed which injects the ethereum variable to the page
window.ethereum.request({ method: 'eth_requestAccounts' });

const web3 = new Web3(window.ethereum);

export default web3;
