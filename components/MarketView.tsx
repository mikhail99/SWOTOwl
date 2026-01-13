import React from 'react';
import SpotlightCard from './SpotlightCard';

const MARKETS = [
  { title: "Lidar Consolidation Phase", date: "2 hrs ago", trend: "+12%", summary: "Major mergers expected in Q3 as automotive giants acquire startup tech." },
  { title: "Neuromorphic Vision Adoption", date: "5 hrs ago", trend: "+85%", summary: "Event-based sensors seeing rapid uptake in drone navigation systems." },
  { title: "Thermal Imaging in Mobile", date: "1 day ago", trend: "+5%", summary: "Cost reduction in microbolometers enabling consumer adoption." },
  { title: "GenAI in Medical Imaging", date: "2 days ago", trend: "+120%", summary: "Regulatory approval for AI-diagnostic assistants spiking investment." },
  { title: "Automotive CMOS shortage", date: "3 days ago", trend: "-15%", summary: "Supply chain constraints returning for high-end ADAS sensors." },
];

const MarketView: React.FC = () => (
  <div className="space-y-6 animate-fade-in-up">
    <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-bold text-white">Market Intelligence</h2>
            <p className="text-slate-400 mt-2">Real-time signals from industry news and financial reports.</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-2xl font-mono font-bold text-emerald-400">MARKET: BULLISH</div>
            <div className="text-xs text-slate-500">CONFIDENCE: 88%</div>
        </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MARKETS.map((m, i) => (
        <SpotlightCard key={i} className="p-6 h-full border-blue-500/20 bg-slate-900/40" spotlightColor="rgba(59, 130, 246, 0.1)">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-slate-500">{m.date}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${m.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>{m.trend}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{m.summary}</p>
        </SpotlightCard>
      ))}
    </div>
  </div>
);

export default MarketView;