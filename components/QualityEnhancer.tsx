import React from 'react';
import { Icon } from './Icon';

interface QualityEnhancerProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export const QualityEnhancer: React.FC<QualityEnhancerProps> = ({ enabled, onToggle }) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="award" className="w-4 h-4" />
                Quality
            </h3>
            <label htmlFor="quality-toggle" className="flex items-center justify-between cursor-pointer bg-gray-800 p-3 rounded-lg">
                <span className="font-semibold text-gray-300">Enhance Quality</span>
                <div className="relative">
                    <input 
                        id="quality-toggle"
                        type="checkbox" 
                        className="sr-only" 
                        checked={enabled}
                        onChange={() => onToggle(!enabled)}
                    />
                    <div className={`block w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
            </label>
        </div>
    );
};