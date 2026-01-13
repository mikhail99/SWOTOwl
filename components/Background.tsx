import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617] overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.2] bg-[bottom_1px_center]"></div>
      
      {/* Radar Sweep Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] opacity-[0.02]">
        <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_300deg,#3b82f6_360deg)] rounded-full animate-radar-spin blur-3xl"></div>
      </div>

      {/* Moving Ambient Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen animate-blob opacity-40"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] mix-blend-screen animate-blob animation-delay-2000 opacity-40"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] mix-blend-screen animate-blob animation-delay-4000 opacity-40"></div>
      
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" 
           style={{
             backgroundImage: 'linear-gradient(to bottom, transparent 50%, #000 50%)',
             backgroundSize: '100% 4px'
           }}>
      </div>

      {/* Radial Vignette for Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#020617]/20 to-[#020617] z-[2]"></div>
    </div>
  );
};

export default Background;