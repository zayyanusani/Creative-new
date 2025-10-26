
import React, { useState, useEffect } from 'react';
import { generateText, generateTextWithSearch, generateTextWithMaps, analyzeVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { GroundingChunk } from '../types';
import Spinner from './common/Spinner';
import SourceLink from './common/SourceLink';

type StudioMode = 'script' | 'search' | 'maps' | 'video';

const ContentStudio: React.FC = () => {
  const [mode, setMode] = useState<StudioMode>('script');
  const [prompt, setPrompt] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Reset state when mode changes
    setPrompt('');
    setResponse(null);
    setSources([]);
    setError(null);
    setVideoFile(null);

    if (mode === 'maps' && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError('Could not get location. Please allow location access.');
          console.error(err);
        }
      );
    }
  }, [mode, userLocation]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setSources([]);

    try {
      if (mode === 'script') {
        const result = await generateText("Write a short, dramatic news script about: " + prompt, 'gemini-2.5-flash');
        setResponse(result);
      } else if (mode === 'search') {
        const { text, sources } = await generateTextWithSearch(prompt);
        setResponse(text);
        setSources(sources);
      } else if (mode === 'maps') {
        if (!userLocation) {
          setError('Location is required for Maps search.');
          setIsLoading(false);
          return;
        }
        const { text, sources } = await generateTextWithMaps(prompt, userLocation);
        setResponse(text);
        setSources(sources);
      } else if (mode === 'video') {
        if (!videoFile) {
          setError('Please upload a video file.');
          setIsLoading(false);
          return;
        }
        const videoBase64 = await fileToBase64(videoFile);
        const result = await analyzeVideo(videoBase64, videoFile.type, prompt || 'Describe this video in detail.');
        setResponse(result);
      }
    } catch (e: any) {
      setError(`An error occurred: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'script': return { title: 'Script Writer', placeholder: 'e.g., The hero confronts the python.' };
      case 'search': return { title: 'Fact-Checker (Search)', placeholder: 'e.g., What is the largest species of python?' };
      case 'maps': return { title: 'Location Scout (Maps)', placeholder: 'e.g., Find nearby wildlife rescue centers.' };
      case 'video': return { title: 'Video Analyzer', placeholder: 'e.g., What is the cow feeling in this video?' };
    }
  };
  const { title, placeholder } = getModeConfig();

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-sky-400">Content Studio</h2>
        <p className="text-gray-400 mt-1">Write, research, and analyze content for your story.</p>
      </div>

      <div className="flex justify-center mb-6 border-b border-gray-700">
          {(['script', 'search', 'maps', 'video'] as StudioMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`capitalize px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${mode === m ? 'border-b-2 border-sky-500 text-sky-400' : 'text-gray-400 hover:text-white'}`}>
                  {m}
              </button>
          ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        {mode === 'video' && (
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700"/>
        )}
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={placeholder} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none" rows={3}/>
        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center">
            {isLoading ? <Spinner /> : `Generate ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      
      <div className="mt-6 bg-gray-900 rounded-lg min-h-[200px] border border-gray-700 p-4">
        {isLoading ? <div className="flex justify-center items-center h-full"><Spinner /></div> : (
          response ? 
          <div className="prose prose-invert prose-sm max-w-none">
             <pre className="whitespace-pre-wrap font-sans">{response}</pre>
             {sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-2">Sources:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                    </ul>
                </div>
             )}
          </div> : 
          <p className="text-gray-500 text-center self-center pt-20">Your result will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default ContentStudio;
