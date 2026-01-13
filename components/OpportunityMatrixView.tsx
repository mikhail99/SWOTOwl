import React, { useState } from 'react';
import SpotlightCard from './SpotlightCard';
import { generateOpportunities, OpportunityItem } from '../services/geminiService';
import MindMap from './MindMap';
import { INDUSTRIES_LIST, SENSORS_LIST } from '../constants';

interface OpportunityMatrixViewProps {
  onLaunchProposal: (item: OpportunityItem) => void;
  modelId: string;
}

const OpportunityMatrixView: React.FC<OpportunityMatrixViewProps> = ({ onLaunchProposal, modelId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [opportunities, setOpportunities] = useState<OpportunityItem[] | null>(null);
  
  // Configuration State
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [context, setContext] = useState<string>("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setOpportunities(null); // Clear previous results while loading
    try {
      // Small delay for UX effect
      await new Promise(r => setTimeout(r, 800));
      const results = await generateOpportunities(selectedTech, selectedIndustry, context, modelId);
      setOpportunities(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Venture Synthesis</h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            Intersecting <span className="text-blue-400 font-semibold">Market Needs</span> with <span className="text-emerald-400 font-semibold">Research Capabilities</span> to discover new ventures.
          </p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Synthesis Parameters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Technology Select */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Technology Focus</label>
                <div className="relative">
                    <select 
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer transition-colors hover:border-slate-600"
                    >
                        <option value="All">All Technologies</option>
                        {SENSORS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
             </div>

             {/* Industry Select */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Industry</label>
                 <div className="relative">
                    <select 
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer transition-colors hover:border-slate-600"
                    >
                        <option value="All">All Industries</option>
                        {INDUSTRIES_LIST.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
             </div>
          </div>

          {/* Strategic Context */}
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategic Context / Specific Ideas</label>
             <textarea 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="E.g., Focus on low-cost solutions for developing markets, or prioritize extreme durability for rugged environments..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none min-h-[100px] resize-y transition-colors hover:border-slate-600"
             />
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-end">
             <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`px-8 py-4 rounded-lg font-bold text-white transition-all shadow-xl flex items-center gap-3 ${
                    isGenerating 
                    ? 'bg-slate-800 cursor-wait text-slate-400' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30 hover:scale-105 active:scale-95'
                }`}
                >
                {isGenerating ? (
                    <>
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Synthesizing Concepts...
                    </>
                ) : (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3V2"/><path d="M5 10a7 7 0 1 1 14 0 7 7 0 0 1 0 14H5a7 7 0 0 1 0-14z"/><path d="M5 10v14"/></svg>
                    Generate Concepts
                    </>
                )}
             </button>
          </div>
      </div>

      {/* Loading Animation */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8 animate-fade-in-up py-12">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Venture Synthesis Engine</h2>
                <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">
                    Scanning market signals & technical capabilities...
                </p>
            </div>
        </div>
      )}

      {/* Empty State */}
      {!opportunities && !isGenerating && (
        <div className="py-12 text-center space-y-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 opacity-50">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <p className="text-slate-500">
                Configure parameters above to start the synthesis engine.
            </p>
        </div>
      )}

      {/* Results List */}
      {!isGenerating && opportunities && (
      <div className="space-y-6">
        {opportunities?.map((opp, index) => (
          <div 
             key={opp.id} 
             className="animate-fade-in-up"
             style={{ animationDelay: `${index * 150}ms` }}
          >
            <SpotlightCard className="overflow-hidden border-slate-700/50 bg-[#0f172a]" spotlightColor="rgba(192, 132, 252, 0.15)">
                
                {/* Card Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                    <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                         {/* Dynamic Icon based on theme could go here, using generic for now */}
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 19a2 2 0 0 1-2-2v-1"/><path d="M9 19h5"/><path d="M19 19a2 2 0 0 0 2-2v-1"/><path d="M21 15h-5"/></svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{opp.theme}</h3>
                        <div className="text-xs text-purple-400 font-mono tracking-wider uppercase">Confidence Score: {opp.confidenceScore}%</div>
                    </div>
                    <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                            {opp.conceptTitle}
                        </span>
                    </div>
                </div>

                {/* Card Body Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                    
                    {/* Market Signal */}
                    <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            Market Signal
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {opp.marketSignal}
                        </p>
                    </div>

                    {/* Research Capability */}
                    <div className="p-6 space-y-3 bg-white/[0.01]">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Research Capability
                        </div>
                         <p className="text-sm text-slate-300 leading-relaxed">
                            {opp.researchCapability}
                        </p>
                    </div>

                    {/* Visual Mind Map & Action */}
                    <div className="p-6 flex flex-col justify-between space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                             Synthesized Opportunity
                        </div>
                        
                        <MindMap 
                            market={opp.marketSignal} 
                            tech={opp.researchCapability} 
                            opportunity={opp.synthesizedOpportunity}
                        />

                        <p className="text-sm text-white font-medium">
                            {opp.synthesizedOpportunity}
                        </p>

                        <button 
                            onClick={() => onLaunchProposal(opp)}
                            className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded shadow-lg shadow-purple-900/20 text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>
                             Launch Project Proposal
                        </button>
                    </div>

                </div>
            </SpotlightCard>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default OpportunityMatrixView;