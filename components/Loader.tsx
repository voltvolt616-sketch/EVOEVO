
import React from 'react';

interface LoaderProps {
    message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="text-center text-green-400">
            <div className="w-16 h-16 border-4 border-dashed border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-semibold tracking-wider">{message}</p>
        </div>
    );
};
