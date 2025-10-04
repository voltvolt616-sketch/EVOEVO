
import React from 'react';
import type { GeneratedImage } from '../types';
import { Icon } from './Icon';

interface HistoryGalleryProps {
    history: GeneratedImage[];
    onSelect: (image: GeneratedImage) => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history, onSelect }) => {
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 h-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="history" />
                History
            </h3>
            {history.length === 0 ? (
                <div className="text-center text-gray-500 pt-10">
                    <p>Your generated images will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-2">
                    {history.map(image => (
                        <div key={image.id} className="relative aspect-square group cursor-pointer" onClick={() => onSelect(image)}>
                            <img src={image.src} alt={image.prompt} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Icon name="view" className="w-8 h-8 text-white"/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
