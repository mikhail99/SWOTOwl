import React, { useState, useMemo } from 'react';
import SpotlightCard from './SpotlightCard';
import { INDUSTRIES_LIST, SENSORS_LIST } from '../constants';

// --- Data Definitions ---

const INDUSTRIES = ["All", ...INDUSTRIES_LIST];
const SENSORS = ["All", ...SENSORS_LIST];

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: 'blue' | 'emerald';
}

const FilterPill: React.FC<FilterPillProps> = ({ label, active, onClick, color = 'blue' }) => {
  const activeStyles = color === 'blue'
    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-500/20'
    : 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-500/20';

  const hoverStyles = color === 'blue'
    ? 'hover:text-blue-100 hover:border-blue-500/50 hover:shadow-blue-900/20'
    : 'hover:text-emerald-100 hover:border-emerald-500/50 hover:shadow-emerald-900/20';

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border transform active:scale-95 ${
        active
          ? `${activeStyles} scale-105`
          : `bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 ${hoverStyles} hover:scale-105`
      }`}
    >
      {label}
    </button>
  );
};

// --- Mock Data with Tags ---

const MARKET_DATA = [
  { title: "Lidar Consolidation Phase", date: "2 hrs ago", trend: "+12%", summary: "Major mergers expected in Q3 as automotive giants acquire startup tech.", industries: ["Automotive", "Industrial"], sensors: ["LiDAR"] },
  { title: "Neuromorphic Vision Adoption", date: "5 hrs ago", trend: "+85%", summary: "Event-based sensors seeing rapid uptake in drone navigation systems.", industries: ["Aerospace", "Industrial", "Consumer"], sensors: ["Global Shutter"] },
  { title: "Thermal Imaging in Mobile", date: "1 day ago", trend: "+5%", summary: "Cost reduction in microbolometers enabling consumer adoption.", industries: ["Consumer"], sensors: ["SWIR"] },
  { title: "GenAI in Medical Imaging", date: "2 days ago", trend: "+120%", summary: "Regulatory approval for AI-diagnostic assistants spiking investment.", industries: ["Medical"], sensors: ["All"] },
  { title: "Automotive CMOS shortage", date: "3 days ago", trend: "-15%", summary: "Supply chain constraints returning for high-end ADAS sensors.", industries: ["Automotive"], sensors: ["Global Shutter", "RGB-D"] },
];

const RESEARCH_DATA = [
  { title: "3D Gaussian Splatting for Real-Time Radiance Field Rendering", authors: "Kerbl et al.", conference: "SIGGRAPH 2023", tags: ["Rendering", "NeRF"], industries: ["Consumer", "Automotive"], sensors: ["RGB-D", "LiDAR"] },
  { title: "Segment Anything", authors: "Kirillov et al.", conference: "ICCV 2023", tags: ["Segmentation", "Foundation Model"], industries: ["All"], sensors: ["All"] },
  { title: "YOLO-World: Real-Time Open-Vocabulary Object Detection", authors: "Cheng et al.", conference: "CVPR 2024", tags: ["Detection", "Real-time"], industries: ["Automotive", "Industrial"], sensors: ["All"] },
  { title: "Event-based Vision: A Survey", authors: "Gallego et al.", conference: "TPAMI 2022", tags: ["Neuromorphic", "Survey"], industries: ["Industrial", "Automotive"], sensors: ["Global Shutter"] },
  { title: "Learning to Fly by Crashing", authors: "Gandhi et al.", conference: "IROS 2017", tags: ["Robotics", "Reinforcement Learning"], industries: ["Aerospace"], sensors: ["RGB-D"] }
];

const PATENT_DATA = [
  { id: "US-2024-0012345", title: "Solid-state Lidar with beam steering phased array", assignee: "Lumina Tech", date: "2024-01-15", status: "Published", industries: ["Automotive", "Industrial"], sensors: ["LiDAR"] },
  { id: "US-2024-0098765", title: "Event-based sensor pixel architecture with HDR", assignee: "Prophesee", date: "2024-02-01", status: "Granted", industries: ["Industrial", "Consumer"], sensors: ["Global Shutter"] },
  { id: "WO-2023-112233", title: "Method for monocular depth estimation using transformers", assignee: "Tesla Motors", date: "2023-11-20", status: "Filed", industries: ["Automotive"], sensors: ["RGB-D"] },
  { id: "US-2023-998877", title: "Display device with under-screen camera system", assignee: "Apple Inc.", date: "2023-10-10", status: "Granted", industries: ["Consumer"], sensors: ["RGB-D"] },
  { id: "US-2023-5544332", title: "UWB based vital sign monitoring system", assignee: "MedTech Co", date: "2023-09-15", status: "Published", industries: ["Medical"], sensors: ["UWB"] },
];

const IntelligenceView: React.FC = () => {
  const [infoType, setInfoType] = useState<'market' | 'research' | 'patents'>('market');
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeSensor, setActiveSensor] = useState("All");

  const filterItem = (item: any) => {
    const matchesIndustry = activeIndustry === "All" || item.industries.includes("All") || item.industries.includes(activeIndustry);
    const matchesSensor = activeSensor === "All" || item.sensors.includes("All") || item.sensors.includes(activeSensor);
    return matchesIndustry && matchesSensor;
  };

  const filteredMarket = useMemo(() => MARKET_DATA.filter(filterItem), [activeIndustry, activeSensor]);
  const filteredResearch = useMemo(() => RESEARCH_DATA.filter(filterItem), [activeIndustry, activeSensor]);
  const filteredPatents = useMemo(() => PATENT_DATA.filter(filterItem), [activeIndustry, activeSensor]);

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Intelligence Hub</h2>
          <p className="text-slate-400 max-w-xl">
            Unified stream of market signals, academic research, and IP filings.
          </p>
        </div>
        
        {/* Type Selector */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          {(['market', 'research', 'patents'] as const).map((type) => (
             <button
                key={type}
                onClick={() => setInfoType(type)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                   infoType === type 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                   : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
             >
                {type}
             </button>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
          <div className="space-y-3">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Industry Context</div>
             <div className="flex flex-wrap gap-3">
                {INDUSTRIES.map(ind => (
                  <FilterPill 
                    key={ind} 
                    label={ind} 
                    active={activeIndustry === ind} 
                    onClick={() => setActiveIndustry(ind)}
                    color="blue"
                  />
                ))}
             </div>
          </div>
          <div className="space-y-3">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Technology Focus</div>
             <div className="flex flex-wrap gap-3">
                {SENSORS.map(sen => (
                  <FilterPill 
                    key={sen} 
                    label={sen} 
                    active={activeSensor === sen} 
                    onClick={() => setActiveSensor(sen)}
                    color="emerald"
                  />
                ))}
             </div>
          </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        
        {/* Market View */}
        {infoType === 'market' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredMarket.length > 0 ? filteredMarket.map((m, i) => (
                <SpotlightCard key={i} className="p-6 h-full border-blue-500/20 bg-slate-900/40" spotlightColor="rgba(59, 130, 246, 0.1)">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono text-slate-500">{m.date}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${m.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>{m.trend}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{m.summary}</p>
                    <div className="flex gap-2 flex-wrap mt-auto">
                        {m.industries.map((tag, idx) => (
                           tag !== 'All' && <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{tag}</span>
                        ))}
                    </div>
                </SpotlightCard>
            )) : (
                <div className="col-span-full py-12 text-center text-slate-500 italic">No market trends found for this filter combination.</div>
            )}
          </div>
        )}

        {/* Research View */}
        {infoType === 'research' && (
           <div className="space-y-4 animate-fade-in-up">
              {filteredResearch.length > 0 ? filteredResearch.map((p, i) => (
                <div key={i} className="group relative p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:bg-slate-800/60">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-100 group-hover:text-indigo-300 transition-colors mb-2">{p.title}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 font-mono items-center">
                                <span className="text-slate-400">{p.authors}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span>{p.conference}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end max-w-xs">
                            {p.tags.map((t, idx) => (
                                <span key={idx} className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
              )) : (
                 <div className="py-12 text-center text-slate-500 italic">No research papers found for this filter combination.</div>
              )}
           </div>
        )}

        {/* Patents View */}
        {infoType === 'patents' && (
           <div className="animate-fade-in-up">
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-700/50 bg-slate-800/50 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Publication ID</th>
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold hidden md:table-cell">Assignee</th>
                            <th className="p-4 font-semibold hidden md:table-cell">Date</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-200 divide-y divide-slate-800/50">
                        {filteredPatents.length > 0 ? filteredPatents.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="p-4 font-mono text-sm text-amber-400 group-hover:text-amber-300 whitespace-nowrap">{p.id}</td>
                                <td className="p-4 font-medium text-sm">
                                    {p.title}
                                    <div className="flex gap-2 mt-1 md:hidden">
                                        <span className="text-xs text-slate-500">{p.assignee}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-400 text-sm hidden md:table-cell">{p.assignee}</td>
                                <td className="p-4 text-slate-500 text-sm font-mono hidden md:table-cell">{p.date}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                        p.status === 'Granted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        'bg-slate-700/50 text-slate-300 border-slate-600'
                                    }`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                             <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No patents found for this filter combination.</td></tr>
                        )}
                    </tbody>
                </table>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default IntelligenceView;