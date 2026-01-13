import React from 'react';

interface MindMapProps {
   market: string;
   tech: string;
   opportunity: string;
}

const MindMap: React.FC<MindMapProps> = ({ market, tech, opportunity }) => {
   return (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center relative overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-6 select-none">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-grid-slate-900/[0.3] bg-[size:20px_20px]"></div>

         <svg className="w-full h-full absolute inset-0 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
               <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(168, 85, 247)', stopOpacity: 0.6 }} />
               </linearGradient>
               <linearGradient id="gradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgb(16, 185, 129)', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(168, 85, 247)', stopOpacity: 0.6 }} />
               </linearGradient>
            </defs>

            {/* Left to Center Line */}
            <path
               d="M 20 50 C 35 50, 35 50, 50 50"
               stroke="url(#gradLeft)"
               strokeWidth="1"
               fill="none"
               strokeDasharray="2,2"
               className="animate-dash"
            />

            {/* Right to Center Line */}
            <path
               d="M 80 50 C 65 50, 65 50, 50 50"
               stroke="url(#gradRight)"
               strokeWidth="1"
               fill="none"
               strokeDasharray="2,2"
               className="animate-dash-reverse"
            />

            {/* Flow Particles */}
            <circle r="1" fill="#60a5fa">
               <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M 20 50 C 35 50, 35 50, 48 50"
               />
            </circle>
            <circle r="1" fill="#34d399">
               <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M 80 50 C 65 50, 65 50, 52 50"
               />
            </circle>
         </svg>

         <div className="flex justify-between items-center w-full relative z-10 gap-2">

            {/* Left Node: Market Need */}
            <div className="flex flex-col items-center gap-3 flex-1 group">
               <div className="w-14 h-14 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300 relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
               </div>
               <div className="text-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">Market</span>
                  <p className="text-[9px] text-slate-400 max-w-[80px] line-clamp-2 leading-tight mx-auto">{market}</p>
               </div>
            </div>

            {/* Center Node: Synthesis */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 z-20">
               <div className="relative group cursor-default">
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-purple-500/50 flex items-center justify-center shadow-2xl relative z-10 group-hover:border-purple-400 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v8" /><path d="m4.93 4.93 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 22 4-10 4 10" /><path d="M9 22h6" />
                     </svg>
                  </div>
               </div>
               <div className="text-center mt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300 font-bold uppercase tracking-widest">
                     Venture
                  </span>
               </div>
            </div>

            {/* Right Node: Research Capability */}
            <div className="flex flex-col items-center gap-3 flex-1 group">
               <div className="w-14 h-14 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
               </div>
               <div className="text-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">Tech</span>
                  <p className="text-[9px] text-slate-400 max-w-[80px] line-clamp-2 leading-tight mx-auto">{tech}</p>
               </div>
            </div>

         </div>
      </div>
   );
};

export default MindMap;