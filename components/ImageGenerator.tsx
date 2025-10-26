
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './common/Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('A brave hero protecting a mother cow from a giant python, dramatic cinematic lighting.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (e: any) {
      setError(`Failed to generate image: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-sky-400">Storyboard Studio</h2>
        <p className="text-gray-400 mt-1">Generate stunning visuals for your story using Imagen.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an image..."
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200"
          rows={3}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate Image'}
        </button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="mt-6 flex justify-center items-center bg-gray-900 rounded-lg min-h-[300px] border border-gray-700">
        {isLoading && (
            <div className="text-center text-gray-400">
                <Spinner/>
                <p>Generating your masterpiece...</p>
            </div>
        )}
        {generatedImage && (
          <img src={generatedImage} alt="Generated" className="rounded-lg max-w-full h-auto shadow-lg" />
        )}
        {!isLoading && !generatedImage && (
          <p className="text-gray-500">Your generated image will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
