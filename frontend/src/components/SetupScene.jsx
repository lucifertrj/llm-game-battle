import React, { useState } from 'react';
import { Bot, Key, Cpu, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const PROVIDERS = [
    { id: 'gemini', name: 'Google Gemini', models: ['gemini-2.5-pro', 'gemini-2.5-flash'] },
    { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4.1', 'gpt-5-nano', 'gpt-5-mini'] },
    { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'] },
];

const PlayerConfig = ({ label, player, config, onChange }) => {
    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">{label}</h3>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Provider
                </label>
                <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={config.provider}
                    onChange={(e) => onChange('provider', e.target.value)}
                >
                    {PROVIDERS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Model Name</label>
                <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. gemini-2.5-flash"
                    value={config.model}
                    onChange={(e) => onChange('model', e.target.value)}
                />
                <p className="text-xs text-slate-500">
                    Recommended: {PROVIDERS.find(p => p.id === config.provider)?.models.join(', ')}
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Key className="w-4 h-4" /> API Key
                </label>
                <input
                    type="password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="sk-..."
                    value={config.api_key}
                    onChange={(e) => onChange('api_key', e.target.value)}
                />
            </div>
        </div>
    );
};

export default function SetupScene({ onNext }) {
    const [p1, setP1] = useState({ provider: 'gemini', model: 'gemini-2.5-flash', api_key: '' });
    const [p2, setP2] = useState({ provider: 'openai', model: 'gpt-4o', api_key: '' });

    const handleNext = () => {
        if (!p1.api_key || !p2.api_key) {
            alert('Please enter API keys for both players');
            return;
        }
        onNext({ p1, p2 });
    };

    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    LLM Arena
                </h1>
                <p className="text-slate-400">Configure your AI combatants</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <PlayerConfig
                    label="Player 1"
                    config={p1}
                    onChange={(k, v) => setP1(prev => ({ ...prev, [k]: v }))}
                />
                <PlayerConfig
                    label="Player 2"
                    config={p2}
                    onChange={(k, v) => setP2(prev => ({ ...prev, [k]: v }))}
                />
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleNext}
                    className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
                >
                    Select Game
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
