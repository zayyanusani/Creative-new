
import React, { useState, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import Spinner from './common/Spinner';

const NarrationStudio: React.FC = () => {
  const [text, setText] = useState('In a dramatic turn of events, local heroes today rescued a mother cow from the clutches of a giant python. The community is hailing them as saviors.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);

  const handleGenerate = async () => {
    if (!text) {
      setError('Please enter some text to generate narration.');
      return;
    }
    setIsLoading(true);
    setError(null);
    if(audioSource){
        audioSource.stop();
        setAudioSource(null);
    }
    try {
      const audioBuffer = await generateSpeech(text);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      setAudioSource(source);
    } catch (e: any) {
      setError(`Failed to generate narration: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-sky-400">Narration Studio</h2>
        <p className="text-gray-400 mt-1">Bring your script to life with AI-powered narration.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your script here..."
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200"
          rows={6}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate Narration'}
        </button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      <div className="mt-6 flex flex-col justify-center items-center bg-gray-900 rounded-lg min-h-[100px] border border-gray-700 p-4">
        {isLoading ? (
            <div className="text-center text-gray-400">
                <Spinner/>
                <p>Generating audio...</p>
            </div>
        ) : audioSource ? (
            <div className="text-center text-green-400">
                <p>Audio playing...</p>
                <p className="text-sm text-gray-400">Re-generate to create new audio.</p>
            </div>
        ) : (
          <p className="text-gray-500">Your generated audio will play automatically.</p>
        )}
      </div>
    </div>
  );
};

export default NarrationStudio;
