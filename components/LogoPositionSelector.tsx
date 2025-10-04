
import React from 'react';

interface LogoPositionSelectorProps {
    selected: string;
    onSelect: (position: string) => void;
}

const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
const labels: { [key: string]: string } = {
    'top-left': 'Top Left',
    'top-right': 'Top Right',
    'bottom-left': 'Bottom Left',
    'bottom-right': 'Bottom Right',
    'center': 'Center',
};

export const LogoPositionSelector: React.FC<LogoPositionSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Logo Position</h3>
            <div className="grid grid-cols-2 gap-2">
                {positions.map(position => (
                    <button
                        key={position}
                        onClick={() => onSelect(position)}
                        className={`w-full py-2 px-3 text-sm rounded-md transition-all duration-200 font-semibold
                            ${selected === position 
                                ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(74,222,128,0.4)]' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }
                            ${position === 'center' ? 'col-span-2' : ''}`}
                    >
                        {labels[position]}
                    </button>
                ))}
            </div>
        </div>
    );
};
