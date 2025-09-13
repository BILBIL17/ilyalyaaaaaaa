import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { useCVData } from './hooks/useCVData';
import { generateWithAI } from './services/geminiService';
import { SettingsModal } from './components/SettingsModal';
import type { CVData } from './types';

declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
    const { cvData, setCvData } = useCVData();
    const [generating, setGenerating] = useState<Record<string, boolean>>({});
    const previewRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [apiKey, setApiKey] = useState<string>('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const handleSaveApiKey = (newApiKey: string) => {
        setApiKey(newApiKey);
        localStorage.setItem('geminiApiKey', newApiKey);
        setIsSettingsOpen(false);
    };

    const handleGenerate = useCallback(async (field: keyof CVData, prompt: string, index?: number) => {
        if (!apiKey) {
            alert("Please set your Gemini API key in the settings before generating content.");
            setIsSettingsOpen(true);
            return;
        }

        const key = index !== undefined ? `${field}-${index}` : field;
        setGenerating(prev => ({ ...prev, [key]: true }));
        try {
            const result = await generateWithAI(prompt, apiKey);
            setCvData(prev => {
                const newData = { ...prev };
                if (index !== undefined) {
                    if (field === 'experience' && newData.experience) {
                        const newExperience = [...newData.experience];
                        newExperience[index] = { ...newExperience[index], description: result };
                        return { ...newData, experience: newExperience };
                    }
                } else if (field === 'summary') {
                    return { ...newData, summary: result };
                }
                return newData;
            });
        } catch (error) {
            console.error("Error generating content:", error);
            alert(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setGenerating(prev => ({ ...prev, [key]: false }));
        }
    }, [setCvData, apiKey]);

    const handleDownloadPDF = useCallback(() => {
        const element = previewRef.current;
        if (!element) {
            return;
        }
        setIsDownloading(true);

        const { jsPDF } = jspdf;

        html2canvas(element, {
            scale: 2, // Higher scale for better resolution
            useCORS: true,
            logging: false,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calculate the height of the image in the PDF to maintain aspect ratio
            const ratio = canvasWidth / canvasHeight;
            const pdfImageHeight = pdfWidth / ratio;

            let heightLeft = pdfImageHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
            heightLeft -= pageHeight;

            // Add new pages if the content overflows
            while (heightLeft > 0) {
                position -= pageHeight; // The new y position is negative, "scrolling" the image up
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${cvData.personal.name.replace(/\s/g, '_') || 'CV'}.pdf`);
        }).catch(err => {
            console.error("Error creating PDF: ", err);
            alert("Failed to create PDF. Please check the console for details.");
        }).finally(() => {
            setIsDownloading(false);
        });
    }, [cvData.personal.name]);


    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.41 12.59L12 11.17l-3.41 3.42L7 14.17l5-5 5 5-1.59 1.42z" transform="rotate(180 12 12)"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z" opacity="0.3"/></svg>
                        <h1 className="text-2xl font-bold text-gray-800">AI CV Builder</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-full hover:bg-gray-200 transition duration-300"
                            aria-label="Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                            {isDownloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <CVForm 
                        cvData={cvData} 
                        setCvData={setCvData} 
                        onGenerate={handleGenerate}
                        generating={generating}
                    />
                </div>
                <div className="sticky top-24">
                     <CVPreview ref={previewRef} data={cvData} />
                </div>
            </main>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveApiKey}
                currentApiKey={apiKey}
            />
        </div>
    );
};

export default App;