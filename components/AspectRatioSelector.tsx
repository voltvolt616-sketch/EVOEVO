
import React from 'react';

interface AspectRatioSelectorProps {
    selected: string;
    onSelect: (ratio: string) => void;
}

const ratios = ['1:1', '2:1', '4:5', '3:2'];
const labels: { [key: string]: string } = {
    '1:1': 'Square',
    '2:1': 'Wide',
    '4:5': 'Portrait',
    '3:2': 'Landscape',
};

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Aspect Ratio</h3>
            <div className="grid grid-cols-2 gap-2">
                {ratios.map(ratio => (
                    <button
                        key={ratio}
                        onClick={() => onSelect(ratio)}
                        className={`w-full py-2 px-3 text-sm rounded-md transition-all duration-200 font-semibold
                            ${selected === ratio 
                                ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(74,222,128,0.4)]' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {labels[ratio]} ({ratio})
                    </button>
                ))}
            </div>
        </div>
    );
};
