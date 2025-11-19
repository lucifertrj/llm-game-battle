import React, { useEffect, useRef } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { cn } from '../lib/utils';
import { Bot, Loader2, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';

export default function GameBoard({ players, gameType, onBack }) {
    const { board, turn, winner, logs, isThinking } = useGameLogic(gameType, players);
    const logsEndRef = useRef(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const renderCell = (idx) => {
        const value = board[idx];
        const isReversi = gameType === 'reversi';

        return (
            <div
                key={idx}
                className={cn(
                    "relative flex items-center justify-center transition-all duration-300",
                    isReversi ? "bg-green-700 border border-green-800 rounded-sm" : "bg-slate-800 rounded-xl border border-slate-700",
                    !value && "hover:bg-opacity-80"
                )}
            >
                {value === 'X' && (
                    <div className={cn(
                        "transition-all duration-500 transform scale-100",
                        isReversi ? "w-8 h-8 rounded-full bg-slate-900 shadow-lg" : "text-4xl font-bold text-indigo-400"
                    )}>
                        {!isReversi && "X"}
                    </div>
                )}
                {value === 'O' && (
                    <div className={cn(
                        "transition-all duration-500 transform scale-100",
                        isReversi ? "w-8 h-8 rounded-full bg-slate-100 shadow-lg" : "text-4xl font-bold text-cyan-400"
                    )}>
                        {!isReversi && "O"}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_350px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Left Column: Board & Header */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <div className="flex items-center gap-4">
                        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                            turn === 'X' ? "bg-indigo-500/20 border-indigo-500/50" : "border-transparent opacity-50")}>
                            <Bot className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium text-indigo-100">{players.p1.model} (X)</span>
                        </div>
                        <div className="text-slate-600 font-bold">VS</div>
                        <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                            turn === 'O' ? "bg-cyan-500/20 border-cyan-500/50" : "border-transparent opacity-50")}>
                            <Bot className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium text-cyan-100">{players.p2.model} (O)</span>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-square max-h-[600px] mx-auto bg-slate-900/50 rounded-2xl border border-slate-800 p-4 shadow-2xl">
                    <div className={cn(
                        "grid gap-2 w-full h-full",
                        gameType === 'tictactoe' ? "grid-cols-3" : "grid-cols-8 gap-1"
                    )}>
                        {board.map((_, idx) => renderCell(idx))}
                    </div>

                    {/* Winner Overlay */}
                    {winner && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-500 z-10">
                            <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
                            <h2 className="text-4xl font-bold text-white mb-2">
                                {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner === 'X' ? players.p1.model : players.p2.model}`}
                            </h2>
                            <button
                                onClick={onBack}
                                className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <RotateCcw className="w-4 h-4" /> Play Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Logs */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col h-[600px] overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2">
                        Game Log
                        {isThinking && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {logs.length === 0 && (
                        <div className="text-center text-slate-500 mt-10 italic">
                            Game starting...
                        </div>
                    )}

                    {logs.map((log, i) => (
                        <div key={i} className={cn(
                            "p-3 rounded-lg border text-sm animate-in slide-in-from-right-2 duration-300",
                            log.player === 'X'
                                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-100"
                                : "bg-cyan-500/10 border-cyan-500/20 text-cyan-100"
                        )}>
                            <div className="flex items-center justify-between mb-1 opacity-70 text-xs uppercase font-bold">
                                <span>{log.player === 'X' ? players.p1.model : players.p2.model}</span>
                                <span>Move: {log.move}</span>
                            </div>
                            <p className="leading-relaxed">{log.reasoning}</p>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>

        </div>
    );
}
