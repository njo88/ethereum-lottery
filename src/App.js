import React, { useState, useEffect } from "react";
import web3 from './web3';
import lottery from './lottery';

const App = () => {

  const [manager, updateManager] = useState('');
  const [players, updatePlayers] = useState([]);
  const [balance, updateBalance] = useState('');
  const [value, updateValue] = useState('');
  const [message, updateMessage] = useState('');

  useEffect(() => {
    const getData = async () => {
      const promises = [];
      promises.push(lottery.methods.manager().call());
      promises.push(lottery.methods.getPlayers().call());
      promises.push(web3.eth.getBalance(lottery.options.address));
      const data = await Promise.all(promises);
      updateManager(data[0]);
      updatePlayers(data[1]);
      updateBalance(data[2]);
    }
    getData().then(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    updateMessage('Waiting on transaction to complete...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    });

    updateMessage('You have been entered!');
  };

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    updateMessage('Waiting on transaction to complete...')

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    updateMessage('A winner has been picked!');
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}.</p>
      <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label htmlFor="value">Amount of ether to enter</label>
          <input name='value' type="text" onChange={event => updateValue(event.target.value)} value={value} />
        </div>
        <button type='submit'>Enter</button>
      </form>

      <hr/>

      <h4>Ready to pick a winner?</h4>
      <button type='button' onClick={onClick}>Pick a winner!</button>

      <hr/>
      <h1>{message}</h1>
    </div>
  );
}
export default App;
