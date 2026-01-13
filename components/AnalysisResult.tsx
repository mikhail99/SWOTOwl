import React from 'react';
import { SwotAnalysis } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisResultProps {
  data: SwotAnalysis;
  onBack: () => void;
  backLabel?: string;
}

const Card: React.FC<{ title: string; items: string[]; type: 'strength' | 'weakness' | 'opportunity' | 'threat' }> = ({ title, items, type }) => {
  const styles = {
    strength: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', title: 'text-emerald-400' },
    weakness: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', title: 'text-rose-400' },
    opportunity: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', title: 'text-blue-400' },
    threat: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', title: 'text-amber-400' },
  };

  const style = styles[type];

  return (
    <div className={`p-6 rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-${type === 'strength' ? 'emerald' : type === 'opportunity' ? 'blue' : 'rose'}-900/10`}>
      <h3 className={`text-sm font-bold mb-4 uppercase tracking-wider font-mono flex items-center gap-2 ${style.title}`}>
        <span className="w-2 h-2 rounded-full bg-current"></span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onBack, backLabel = "Back to Dashboard" }) => {
  const chartData = [
    { subject: 'Viability', A: data.technicalViabilityScore, fullMark: 100 },
    { subject: 'Readiness', A: data.marketReadinessScore, fullMark: 100 },
    { subject: 'Innovation', A: (data.strengths.length / (data.strengths.length + data.weaknesses.length)) * 100, fullMark: 100 },
    { subject: 'Risk', A: (data.threats.length / (data.threats.length + data.opportunities.length)) * 100, fullMark: 100 },
    { subject: 'Impact', A: (data.opportunities.length * 20) > 100 ? 100 : data.opportunities.length * 20, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Nav Back */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        {backLabel}
      </button>

      {/* Header & Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5"/><path d="M17 12h5"/><path d="M12 2v5"/><path d="M12 17v5"/><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{data.topic}</h2>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg">{data.summary}</p>
          
          <div className="flex gap-3 flex-wrap">
            {data.keyPatents && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M9 18h6"/></svg>
                 <span>Patent Analysis Included</span>
               </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-medium">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
               <span>Arxiv Referenced</span>
            </div>
            {data.webSources && data.webSources.length > 0 && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                 <span>Verified Grounding</span>
               </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col relative">
          <h3 className="text-slate-400 text-sm font-semibold mb-4">TECHNOLOGY SCORE</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 right-0 left-0 text-center">
               <div className="text-4xl font-bold text-white tracking-tighter">{Math.round((data.technicalViabilityScore + data.marketReadinessScore) / 2)}</div>
               <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Aggregate Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Strengths" items={data.strengths} type="strength" />
        <Card title="Weaknesses" items={data.weaknesses} type="weakness" />
        <Card title="Opportunities" items={data.opportunities} type="opportunity" />
        <Card title="Threats" items={data.threats} type="threat" />
      </div>

      {/* Verified Sources Section */}
      {data.webSources && data.webSources.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-slate-800">
           <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
             Verified Intelligence Sources
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.webSources.map((source, idx) => (
                 <a 
                   key={idx} 
                   href={source.uri} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between h-full"
                 >
                    <div className="text-sm font-medium text-slate-300 group-hover:text-blue-300 line-clamp-2 mb-2">
                      {source.title}
                    </div>
                    <div className="text-xs text-slate-500 font-mono truncate flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {new URL(source.uri).hostname}
                    </div>
                 </a>
              ))}
           </div>
        </div>
      )}
      
    </div>
  );
};

export default AnalysisResult;