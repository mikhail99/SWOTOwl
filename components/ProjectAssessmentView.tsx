import React, { useState, useEffect } from 'react';
import SpotlightCard from './SpotlightCard';
import { AnalysisState } from '../types';
import { evaluateProject, ProjectDetails } from '../services/geminiService';
import { INDUSTRIES_LIST, SENSORS_LIST } from '../constants';

interface ProjectAssessmentViewProps {
  onAnalyze: (state: AnalysisState) => void;
  initialData?: ProjectDetails | null;
  modelId: string;
}

const ProjectAssessmentView: React.FC<ProjectAssessmentViewProps> = ({ onAnalyze, initialData, modelId }) => {
  const [formData, setFormData] = useState<ProjectDetails>({
    title: '',
    technology: '',
    market: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ status: 'scanning', data: null });

    // Simulate UX delay then call API
    setTimeout(async () => {
        onAnalyze({ status: 'analyzing', data: null });
        try {
            const result = await evaluateProject(formData, modelId);
            onAnalyze({ status: 'complete', data: result });
        } catch (error: any) {
            onAnalyze({ status: 'error', data: null, error: error.message });
        }
    }, 1500);
  };

  return (
      <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Project Assessment</h2>
            <p className="text-slate-400">
                Define technical parameters to generate a deep-dive feasibility and intelligence report.
            </p>
        </div>

        <SpotlightCard className="p-8 border-slate-700/50 bg-slate-900/60" spotlightColor="rgba(59, 130, 246, 0.1)">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Project Title */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Project Title</label>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#020617]/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g. Next-Gen ToF Sensor for ADAS"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Tech */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Core Technology</label>
                        <div className="relative">
                            <select 
                                name="technology"
                                value={formData.technology}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#020617]/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="text-slate-500">Select Technology...</option>
                                {SENSORS_LIST.map((sensor) => (
                                    <option key={sensor} value={sensor}>{sensor}</option>
                                ))}
                                <option value="Other">Other (Describe below)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Target Market */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Target Market</label>
                        <div className="relative">
                            <select 
                                name="market"
                                value={formData.market}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#020617]/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="text-slate-500">Select Market...</option>
                                {INDUSTRIES_LIST.map((industry) => (
                                    <option key={industry} value={industry}>{industry}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Technical Description</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-[#020617]/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Describe the technical novelty, sensor architecture, or the specific technology you want to test..."
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button 
                        type="submit"
                        className="w-full group relative overflow-hidden rounded-lg bg-blue-600 p-4 text-center font-bold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-blue-900/40"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                            Generate Intelligence Report
                        </span>
                    </button>
                </div>

            </form>
        </SpotlightCard>
      </div>
  );
};

export default ProjectAssessmentView;