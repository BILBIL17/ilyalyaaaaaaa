import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentApiKey: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
    const [apiKey, setApiKey] = useState(currentApiKey);

    useEffect(() => {
        setApiKey(currentApiKey);
    }, [currentApiKey, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(apiKey);
    };
    
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-opacity duration-300"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">API Key Settings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none" aria-label="Close settings">
                        &times;
                    </button>
                </div>
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                        Gemini API Key
                    </label>
                    <input
                        type="password"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your API key"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        You can get your API key from Google AI Studio. The key is stored securely in your browser's local storage.
                    </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        Save Key
                    </button>
                </div>
            </div>
        </div>
    );
};