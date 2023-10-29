import React, { useEffect, useState } from 'react';
import './App.css';
import config from './PhaserGame';
import { PreloadScene, ScopaScene, OkeyScene } from './phaser/scenes';

interface Room {
  id: number;
  name: string;
}

const rooms: Room[] = [
  { id: 1, name: 'Scopa' },
  { id: 2, name: 'Okey' },
  // { id: 3, name: 'Slot' },
  // { id: 5, name: 'Call Break' },
  // { id: 6, name: 'Ludo' },
];

const isDevelopment = true;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);

  const startGame = (scene: string) => {
    setGameStarted(true);
    setSelectedScene(scene);
  };

  useEffect(() => {
    if (gameStarted) {

      const scenes = {
        Scopa: ScopaScene,
        Okey: OkeyScene,
      };

      const gameConfig = {
        ...config,
        scene: [PreloadScene, scenes[selectedScene]],
      };

      const game = new Phaser.Game(gameConfig);
      return () => {
        game.destroy(true);
      };
    }
  }, [gameStarted, selectedScene]);

  if (isDevelopment && !gameStarted) {
    startGame('Okey'); // start with 'Scopa'/Okey scene in development mode
  }

  return (
    <div id="App" className="App">
      <div id="phaser-container"></div>
      {!gameStarted && <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6">Sandbox Lobby</h1>
          <ul>
            {rooms.map((room) => (
              <li key={room.id} className="border-b py-3 flex items-center">
                <span className="font-bold text-gray-800">{room.name}</span>
                <button onClick={() => startGame(room.name)} className="ml-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Join</button>
              </li>
            ))}
          </ul>
        </div>
      </div>}
    </div>
  );
}

export default App;
