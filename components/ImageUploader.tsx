
import React, { useState, useCallback, useMemo } from 'react';
import { Icon } from './Icon';

interface ImageUploaderProps {
    id: string;
    label: string;
    onFileSelect: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFileName('');
            setPreview(null);
            onFileSelect(null);
        }
    }, [onFileSelect]);
    
    const uploaderContent = useMemo(() => {
        if (preview) {
            return (
                <div className="relative w-full h-full group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm break-all px-2">{fileName}</p>
                        <span className="text-xs text-green-400 mt-1">Click to change</span>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                <Icon name="upload" className="w-8 h-8"/>
                <span className="font-semibold">{label}</span>
                <span className="text-xs">Click to browse or drag & drop</span>
            </div>
        );
    }, [preview, label, fileName]);

    return (
        <div className="w-full">
            <label htmlFor={id} className="cursor-pointer">
                <div className="w-full h-32 bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-green-500 hover:bg-gray-800 transition-all duration-300 overflow-hidden">
                    {uploaderContent}
                </div>
            </label>
            <input
                id={id}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};
