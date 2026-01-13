import React, { useState } from 'react';
import { analyzeTech } from '../services/aiService';
import { AnalysisState } from '../types';

interface ScannerInputProps {
  onStateChange: (state: AnalysisState) => void;
}

const ScannerInput: React.FC<ScannerInputProps> = ({ onStateChange }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    onStateChange({ status: 'scanning', data: null });

    // Simulate initial scan delay for UX
    setTimeout(async () => {
      onStateChange({ status: 'analyzing', data: null });
      try {
        const result = await analyzeTech(topic);
        onStateChange({ status: 'complete', data: result });
      } catch (err: any) {
        onStateChange({ status: 'error', data: null, error: err.message || 'Analysis failed' });
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-[#0f172a] rounded-lg border border-slate-700 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <div className="pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            placeholder="Enter project topic (e.g. 'Neuromorphic Sensors')"
            className="w-full bg-transparent border-none text-white px-4 py-3 placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`mr-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2
              ${isLoading
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}
            `}
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                Processing
              </>
            ) : (
              <>
                Analyze <span className="text-xs opacity-70">↵</span>
              </>
            )}
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        AI will analyze patent landscape, arxiv papers, and market viability.
      </p>
    </form>
  );
};

export default ScannerInput;