import React, { useEffect, useState } from 'react';
import './App.css';
import config from './PhaserGame';
// import './PhaserGame';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted) {
      const game = new Phaser.Game(config);
      return () => {
        game.destroy(true);
      };
    }
  }, [gameStarted]);

  return (<div id='App' className='App'>
    <div id='phaser-container'></div>
    {!gameStarted && <button onClick={startGame}> Start Game </button>}
    {/* <p>lobby page</p> */}
  </div>);
}

export default App;
