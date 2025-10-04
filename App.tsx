import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { LogoPositionSelector } from './components/LogoPositionSelector';
import { ResultViewer } from './components/ResultViewer';
import { HistoryGallery } from './components/HistoryGallery';
import { EditDialog } from './components/EditDialog';
import { Loader } from './components/Loader';
import { generateImage, editImage } from './services/geminiService';
import type { GeneratedImage } from './types';
import { Icon } from './components/Icon';
import { QualityEnhancer } from './components/QualityEnhancer';

const App: React.FC = () => {
    const [designImage, setDesignImage] = useState<File | null>(null);
    const [productImage, setProductImage] = useState<File | null>(null);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [logoPosition, setLogoPosition] = useState<string>('top-left');
    const [isHighQuality, setIsHighQuality] = useState<boolean>(false);
    
    // Edit history state
    const [editHistory, setEditHistory] = useState<GeneratedImage[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

    const [galleryHistory, setGalleryHistory] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitchingHistory, setIsSwitchingHistory] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

    const currentImage = currentHistoryIndex > -1 ? editHistory[currentHistoryIndex] : null;
    const canUndo = currentHistoryIndex > 0;
    const canRedo = currentHistoryIndex < editHistory.length - 1;

    const handleGenerate = useCallback(async () => {
        if (!designImage || !productImage || !logoImage) {
            setError('Please upload all three images.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Creating magic... Staging your product.');
        setEditHistory([]);
        setCurrentHistoryIndex(-1);

        try {
            const result = await generateImage(designImage, productImage, logoImage, aspectRatio, logoPosition, isHighQuality);
            const newImage: GeneratedImage = {
                id: crypto.randomUUID(),
                src: result,
                prompt: `Initial generation with aspect ratio ${aspectRatio} and logo at ${logoPosition.replace('-', ' ')}`,
            };
            setEditHistory([newImage]);
            setCurrentHistoryIndex(0);
            setGalleryHistory(prev => [newImage, ...prev]);
            setIsEditDialogOpen(true);
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    }, [designImage, productImage, logoImage, aspectRatio, logoPosition, isHighQuality]);

    const handleEdit = useCallback(async (prompt: string) => {
        if (!prompt || !currentImage) {
            setError('No prompt or image to edit.');
            return;
        }
        setError(null);
        setIsLoading(true);
        setIsEditDialogOpen(false);
        setLoadingMessage('Applying your edits...');

        try {
            const result = await editImage(currentImage.src, prompt, isHighQuality);
            const newImage: GeneratedImage = {
                id: crypto.randomUUID(),
                src: result,
                prompt: prompt,
            };

            const newEditHistory = editHistory.slice(0, currentHistoryIndex + 1);
            setEditHistory([...newEditHistory, newImage]);
            setCurrentHistoryIndex(newEditHistory.length);
            setGalleryHistory(prev => [newImage, ...prev]);
        } catch (e) {
            console.error(e);
            setError('Failed to edit image. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    }, [currentImage, editHistory, currentHistoryIndex, isHighQuality]);

    const handleUndo = useCallback(() => {
        if (canUndo) {
            setCurrentHistoryIndex(prev => prev - 1);
        }
    }, [canUndo]);

    const handleRedo = useCallback(() => {
        if (canRedo) {
            setCurrentHistoryIndex(prev => prev + 1);
        }
    }, [canRedo]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isModifier = event.ctrlKey || event.metaKey;
            if (isModifier && event.key === 'z') {
                event.preventDefault();
                if (event.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleUndo, handleRedo]);


    const handleSelectFromGallery = (image: GeneratedImage) => {
        setIsSwitchingHistory(true);
        // Use a short timeout to provide clear visual feedback
        setTimeout(() => {
            setEditHistory([image]);
            setCurrentHistoryIndex(0);
            setError(null);
            setIsSwitchingHistory(false);
        }, 100);
    };

    const isGenerateDisabled = !designImage || !productImage || !logoImage || isLoading;
    const isDisplayingLoader = isLoading || isSwitchingHistory;

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <Header />
                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    {/* Left Panel: Inputs */}
                    <div className="lg:col-span-3 space-y-6">
                        <ImageUploader id="design-image" label="التصميم (Design)" onFileSelect={setDesignImage} />
                        <ImageUploader id="product-image" label="صورتك (Your Product)" onFileSelect={setProductImage} />
                        <ImageUploader id="logo-image" label="لوجو (Logo)" onFileSelect={setLogoImage} />
                        <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
                        <LogoPositionSelector selected={logoPosition} onSelect={setLogoPosition} />
                        <QualityEnhancer enabled={isHighQuality} onToggle={setIsHighQuality} />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerateDisabled}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:bg-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Icon name="sparkles" />
                            إنشاء الصورة
                        </button>
                    </div>

                    {/* Center Panel: Result */}
                    <div className="lg:col-span-6 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-center min-h-[400px] lg:min-h-[600px] p-4">
                        {isDisplayingLoader && <Loader message={isLoading ? loadingMessage : 'Loading from history...'} />}
                        
                        {!isDisplayingLoader && !currentImage && (
                            <div className="text-center text-gray-500">
                                <Icon name="image" className="w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold">Your Masterpiece Awaits</h3>
                                <p>Generated image will appear here.</p>
                            </div>
                        )}
                        {!isDisplayingLoader && currentImage && (
                            <ResultViewer 
                                image={currentImage} 
                                onEdit={() => setIsEditDialogOpen(true)} 
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                canUndo={canUndo}
                                canRedo={canRedo}
                            />
                        )}
                         {!isDisplayingLoader && error && <div className="text-red-400 p-4 bg-red-900/50 rounded-lg">{error}</div>}
                    </div>
                    
                    {/* Right Panel: History */}
                    <div className="lg:col-span-3">
                       <HistoryGallery history={galleryHistory} onSelect={handleSelectFromGallery} />
                    </div>
                </main>
            </div>

            {isEditDialogOpen && currentImage && (
                <EditDialog
                    onClose={() => setIsEditDialogOpen(false)}
                    onSubmit={handleEdit}
                />
            )}
        </div>
    );
};

export default App;