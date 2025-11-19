import React from 'react';
import { Grid3X3, CircleDot, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const GameCard = ({ title, icon: Icon, description, onClick }) => (
    <button
        onClick={onClick}
        className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all hover:scale-105 hover:border-indigo-500/50 text-left space-y-4"
    >
        <div className="p-4 bg-indigo-500/10 rounded-xl w-fit group-hover:bg-indigo-500/20 transition-colors">
            <Icon className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
            <ChevronRight className="w-6 h-6 text-indigo-400" />
        </div>
    </button>
);

export default function GameSelectionScene({ onSelect }) {
    return (
        <div className="max-w-4xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-slate-100">Choose Your Arena</h1>
                <p className="text-slate-400">Select the game for the AI models to play</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <GameCard
                    title="Tic-Tac-Toe"
                    icon={Grid3X3}
                    description="The classic 3x3 grid. A test of basic reasoning and foresight."
                    onClick={() => onSelect('tictactoe')}
                />
                <GameCard
                    title="Reversi"
                    icon={CircleDot}
                    description="A complex strategy game of territory and flipping. Requires deeper planning."
                    onClick={() => onSelect('reversi')}
                />
            </div>
        </div>
    );
}
