import React, { useState } from 'react';
import SetupScene from './components/SetupScene';
import GameSelectionScene from './components/GameSelectionScene';
import GameBoard from './components/GameBoard';

function App() {
  const [scene, setScene] = useState('setup'); // setup, selection, game
  const [players, setPlayers] = useState(null);
  const [gameType, setGameType] = useState(null);

  const handleSetupComplete = (config) => {
    setPlayers(config);
    setScene('selection');
  };

  const handleGameSelect = (type) => {
    setGameType(type);
    setScene('game');
  };

  const handleReset = () => {
    setScene('setup');
    setPlayers(null);
    setGameType(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        {scene === 'setup' && (
          <SetupScene onNext={handleSetupComplete} />
        )}

        {scene === 'selection' && (
          <GameSelectionScene onSelect={handleGameSelect} />
        )}

        {scene === 'game' && (
          <GameBoard
            players={players}
            gameType={gameType}
            onBack={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
