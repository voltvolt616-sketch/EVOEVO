
import React from 'react';
import { Icon } from './Icon';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-wider flex items-center justify-center gap-4">
                <Icon name="wand" className="w-10 h-10 text-green-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
                    AI Product Stage
                </span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Generate professional product photos in seconds.
            </p>
        </header>
    );
};
