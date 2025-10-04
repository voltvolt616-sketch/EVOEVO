import React, { useState } from 'react';
import { Icon } from './Icon';

interface EditDialogProps {
    onClose: () => void;
    onSubmit: (prompt: string) => void;
}

const quickEdits = [
    'Soften lighting',
    'Increase contrast',
    'Desaturate colors',
    'Make it more vibrant',
    'Add a subtle reflection',
    'Improve shadow detail',
];


export const EditDialog: React.FC<EditDialogProps> = ({ onClose, onSubmit }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-green-500/30 rounded-xl shadow-2xl shadow-green-500/10 w-full max-w-lg p-6 relative animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <Icon name="close" />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Make it perfect</h2>
                <p className="text-gray-400 mb-6">Describe the changes you want, or select a quick edit below.</p>
                
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {quickEdits.map(edit => (
                            <button
                                key={edit}
                                type="button"
                                onClick={() => setPrompt(edit)}
                                className="bg-gray-700 text-gray-200 text-sm py-1.5 px-3 rounded-full hover:bg-gray-600 transition-colors duration-200"
                            >
                                {edit}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Your edit instruction..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!prompt.trim()}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:bg-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Icon name="sparkles" />
                        Apply Edit
                    </button>
                </form>
            </div>
        </div>
    );
};