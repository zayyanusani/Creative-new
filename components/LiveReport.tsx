
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import Spinner from './common/Spinner';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const LiveReport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Welcome to the Live Report desk! Ask me for quick updates on the story. I'm using Gemini Flash Lite for fast responses." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateText(input, 'gemini-2.5-flash-lite');
      const botMessage: Message = { sender: 'bot', text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (e: any) {
      console.error(e);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting to the news desk." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-[70vh]">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-sky-400">Live Report Desk</h2>
        <p className="text-gray-400 mt-1">Get instant updates with low-latency responses.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 text-gray-200">
                    <Spinner/>
                 </div>
            </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveReport;
