import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { Icon } from './Icon';

interface ResultViewerProps {
    image: GeneratedImage;
    onEdit: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const RESOLUTIONS: { [key: string]: number | null } = {
    'Original': null,
    '1080p': 1920,
    '2K': 2560,
    '4K': 3840,
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ image, onEdit, onUndo, onRedo, canUndo, canRedo }) => {
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
                setIsDownloadMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDownload = useCallback((label: string, targetLongestSide: number | null) => {
        setIsDownloadMenuOpen(false);
        const link = document.createElement('a');
        
        if (!targetLongestSide) {
            link.href = image.src;
            link.download = `generated-image-${image.id}-original.png`;
            link.click();
            return;
        }

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const aspectRatio = img.width / img.height;
            let newWidth, newHeight;

            if (img.width >= img.height) {
                newWidth = targetLongestSide;
                newHeight = newWidth / aspectRatio;
            } else {
                newHeight = targetLongestSide;
                newWidth = newHeight * aspectRatio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            link.href = canvas.toDataURL('image/png');
            link.download = `generated-image-${image.id}-${label}.png`;
            link.click();
        };
        img.src = image.src;
    }, [image.src, image.id]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative group">
            <img 
                src={image.src} 
                alt={image.prompt} 
                className="max-w-full max-h-[80vh] lg:max-h-[550px] object-contain rounded-lg shadow-2xl shadow-black"
            />
            <div className="absolute bottom-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="relative" ref={downloadMenuRef}>
                    <button
                        onClick={() => setIsDownloadMenuOpen(prev => !prev)}
                        className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300"
                    >
                        <Icon name="download" />
                        Download
                        <Icon name="chevron-down" className={`w-4 h-4 transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDownloadMenuOpen && (
                        <div className="absolute bottom-full mb-2 w-full bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden animate-fade-in-up">
                            <ul>
                                {Object.entries(RESOLUTIONS).map(([label, resolution]) => (
                                     <li key={label}>
                                        <button
                                            onClick={() => handleDownload(label, resolution)}
                                            className="w-full text-left py-2 px-4 text-white hover:bg-green-500 hover:text-black transition-colors duration-200"
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    <Icon name="undo" />
                    Undo
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Shift+Z)"
                    className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    <Icon name="redo" />
                    Redo
                </button>
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300"
                >
                    <Icon name="edit" />
                    Edit
                </button>
            </div>
        </div>
    );
};
