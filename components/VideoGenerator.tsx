
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './common/Spinner';

const WAITING_MESSAGES = [
  "Summoning digital actors...",
  "Calibrating the cinematic universe...",
  "Rendering pixels into a moving picture...",
  "Adjusting lighting and camera angles...",
  "The director is reviewing the dailies...",
  "This can take a few minutes, please be patient."
];

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('Brave heroes save a mother cow from a giant python, cinematic, 4k');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState(WAITING_MESSAGES[0]);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setApiKeySelected(true);
      }
    };
    checkApiKey();
  }, []);
  
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setWaitingMessage(prev => {
          const currentIndex = WAITING_MESSAGES.indexOf(prev);
          return WAITING_MESSAGES[(currentIndex + 1) % WAITING_MESSAGES.length];
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume selection is successful to avoid race conditions
      setApiKeySelected(true);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      let imagePayload;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        imagePayload = { base64, mimeType: imageFile.type };
      }
      const videoUrl = await generateVideo(prompt, aspectRatio, imagePayload);
      setGeneratedVideo(videoUrl);
    } catch (e: any) {
      console.error(e);
      let errorMessage = `Failed to generate video: ${e.message}`;
      if (e.message?.includes('Requested entity was not found')) {
        errorMessage = "API Key error. Please re-select your API key.";
        setApiKeySelected(false);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!apiKeySelected) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-sky-400">Welcome to the Video Studio</h2>
            <p className="mt-2 text-gray-400">Video generation with Veo requires you to select an API key.</p>
            <p className="mt-2 text-sm text-gray-500">Ensure your project is set up for billing. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Learn more</a>.</p>
            <button
                onClick={handleSelectKey}
                className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
                Select API Key
            </button>
        </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-sky-400">Scene Generation Studio</h2>
        <p className="text-gray-400 mt-1">Create dynamic video scenes for your story with Veo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A dramatic scene..." className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Starting Image (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded"/>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                )}
                <div className="flex text-sm text-gray-500">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-sky-500 hover:text-sky-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-sky-500 p-1">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
            <div className="flex gap-4">
              <button onClick={() => setAspectRatio('16:9')} className={`py-2 px-4 rounded-lg border-2 transition ${aspectRatio === '16:9' ? 'bg-sky-600 border-sky-500' : 'bg-gray-700 border-gray-600 hover:border-sky-500'}`}>Landscape (16:9)</button>
              <button onClick={() => setAspectRatio('9:16')} className={`py-2 px-4 rounded-lg border-2 transition ${aspectRatio === '9:16' ? 'bg-sky-600 border-sky-500' : 'bg-gray-700 border-gray-600 hover:border-sky-500'}`}>Portrait (9:16)</button>
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center">
            {isLoading ? <Spinner /> : 'Generate Video'}
          </button>
        </div>
        {/* Display */}
        <div className="bg-gray-900 rounded-lg min-h-[300px] border border-gray-700 flex justify-center items-center overflow-hidden">
          {isLoading && <div className="text-center text-gray-400 p-4"><Spinner /><p className="mt-2">{waitingMessage}</p></div>}
          {error && <p className="text-red-400 p-4 text-center">{error}</p>}
          {generatedVideo && <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain"></video>}
          {!isLoading && !generatedVideo && !error && <p className="text-gray-500">Your generated video will appear here.</p>}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
