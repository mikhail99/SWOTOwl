import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import ScannerInput from './components/ScannerInput';
import AnalysisResult from './components/AnalysisResult';
import SpotlightCard from './components/SpotlightCard';
import DecryptText from './components/DecryptText';
import SwotLibraryView from './components/SwotLibraryView';
import IntelligenceView from './components/IntelligenceView';
import ProjectAssessmentView from './components/ProjectAssessmentView';
import OpportunityMatrixView from './components/OpportunityMatrixView';
import { AnalysisState } from './types';
import { OpportunityItem, ProjectDetails } from './services/aiService';
import { INDUSTRIES_LIST, SENSORS_LIST } from './constants';

// Icons
const Icons = {
  Chip: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5" /><path d="M17 12h5" /><path d="M12 2v5" /><path d="M12 17v5" /><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  Flask: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg>,
  Newspaper: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>,
  Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
};

// Mock simulated data feed
const ACTIVITY_FEED = [
  { type: 'SCAN', text: 'Synthesis: Next-Gen LiDAR' },
  { type: 'PATENT', text: 'New Filing: US-2025-SPAD-X' },
  { type: 'MARKET', text: 'Alert: Automotive Sensor M&A' },
  { type: 'PAPER', text: 'Arxiv: NeRF Optimization' },
  { type: 'SCAN', text: 'Evaluating: Quantum Imaging' },
];

const ActivityTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = ACTIVITY_FEED[index];

  return (
    <div className="h-6 overflow-hidden relative">
      <div className="animate-fade-in-up key={index} text-xs font-mono text-slate-300 flex items-center justify-end gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${currentItem.type === 'SCAN' ? 'bg-emerald-400' :
          currentItem.type === 'PATENT' ? 'bg-amber-400' :
            currentItem.type === 'MARKET' ? 'bg-blue-400' : 'bg-purple-400'
          } animate-pulse`}></span>
        {currentItem.text}
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{
  title: string;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  spotlightColor?: string;
  onClick?: () => void;
}> = ({ title, subtitle, icon, children, className = "", delay = 0, spotlightColor, onClick }) => (
  <div
    className="h-full animate-fade-in-up"
    style={{ animationDelay: `${delay}ms`, opacity: 0 }} /* Opacity 0 to let animation fade it in */
  >
    <div className="h-full cursor-pointer" onClick={onClick}>
      <SpotlightCard className={`p-6 flex flex-col h-full group ${className}`} spotlightColor={spotlightColor}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-slate-800/50 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors border border-slate-700/50">
            {icon}
          </div>
          <div className="text-right">
            {children}
          </div>
        </div>
        <div className="mt-auto">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">{title}</h3>
          <div className="text-sm text-slate-400 mt-1">{subtitle}</div>
        </div>
      </SpotlightCard>
    </div>
  </div>
);

type ViewState = 'dashboard' | 'swot_library' | 'intelligence' | 'assessment' | 'opportunity_matrix';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
  });

  const [activeTab, setActiveTab] = useState<ViewState>('dashboard');
  const [projectProposalData, setProjectProposalData] = useState<ProjectDetails | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3-pro-preview");

  const handleNavClick = (tab: ViewState) => {
    setActiveTab(tab);
    // If we navigate away, we should ideally reset analysis or just hide it.
    // Resetting analysis status to idle effectively hides the analysis result view.
    setAnalysisState({ status: 'idle', data: null });
  };

  const handleLaunchProposal = (opportunity: OpportunityItem) => {
    // Attempt to map the AI-generated text to our specific lists using basic inclusion check.
    // If not found, it defaults to 'Other'.
    const foundSensor = SENSORS_LIST.find(s => opportunity.researchCapability.includes(s)) || 'Other';
    const foundIndustry = INDUSTRIES_LIST.find(i => opportunity.marketSignal.includes(i) || opportunity.theme.includes(i)) || 'Other';

    const proposalData: ProjectDetails = {
      title: opportunity.conceptTitle,
      technology: foundSensor,
      market: foundIndustry,
      description: `${opportunity.synthesizedOpportunity}\n\nContext:\n${opportunity.marketSignal}\n\nTechnological Enabler:\n${opportunity.researchCapability}`
    };

    setProjectProposalData(proposalData);
    setAnalysisState({ status: 'idle', data: null }); // Ensure analysis is reset so the form shows
    setActiveTab('assessment');
  };

  // Logic: Analysis takes over everything if it's active. 
  // Otherwise, we show the active tab content.
  const isAnalysisActive = analysisState.status !== 'idle';

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-slate-200">
      <Background />

      {/* Navigation */}
      <header className="relative z-50 px-6 py-5 flex flex-col md:flex-row justify-between items-center border-b border-white/5 bg-[#020617]/80 backdrop-blur-md sticky top-0">
        <div
          className="flex items-center gap-3 mb-4 md:mb-0 cursor-pointer"
          onClick={() => handleNavClick('dashboard')}
        >
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex gap-1">
            APEX<span className="text-blue-500">STRATEGIC</span>
          </span>
        </div>
        <nav className="flex gap-8 text-sm font-medium text-slate-400 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Command Center' },
            { id: 'opportunity_matrix', label: 'Venture Synthesis' },
            { id: 'assessment', label: 'Proposal Validator' },
            { id: 'swot_library', label: 'Tech Encyclopedia' },
            { id: 'intelligence', label: 'Global Intel' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as ViewState)}
              className={`whitespace-nowrap transition-colors ${activeTab === item.id && !isAnalysisActive ? 'text-white text-shadow-glow' : 'hover:text-blue-400'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden md:block w-8"></div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-10">

        {/* Render Dashboard if tab is dashboard AND analysis is idle */}
        {activeTab === 'dashboard' && !isAnalysisActive && (
          <div className="space-y-10">

            {/* Hero */}
            <div className="space-y-2 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Strategic Project Ideation System
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight h-[1.2em]">
                <DecryptText text="Apex Strategic AI" />
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                The premier platform for Computer Vision R&D. Synthesize market signals with research capabilities to generate and validate high-impact ventures.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="Knowledge Nodes"
                subtitle="Cached intelligence points"
                icon={<Icons.Database />}
                delay={100}
                spotlightColor="rgba(99, 102, 241, 0.2)"
              >
                <span className="text-2xl font-bold text-white font-mono">24.8k</span>
              </DashboardCard>

              <DashboardCard
                title="Reasoning Engine"
                subtitle={
                  <div className="relative inline-block mt-1 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="appearance-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 hover:bg-emerald-500/20 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <option value="gemini-3-pro-preview" className="bg-slate-950 text-slate-200">Gemini 3.0 Pro</option>
                      <option value="gemini-3-flash-preview" className="bg-slate-950 text-slate-200">Gemini 3.0 Flash</option>
                      <option value="gemini-2.5-flash-latest" className="bg-slate-950 text-slate-200">Gemini 2.5 Flash</option>
                      <option value="onnx-community/Qwen3-0.6B-ONNX" className="bg-slate-950 text-slate-200">Local Qwen 0.6B (WebGPU)</option>
                      <option value="onnx-community/Llama-3.2-1B-Instruct" className="bg-slate-950 text-slate-200">Local Llama 1B (WebGPU)</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                }
                icon={<Icons.Chip />}
                delay={200}
                spotlightColor="rgba(16, 185, 129, 0.2)"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  System Online
                </div>
              </DashboardCard>

              <DashboardCard
                title="Global Activity"
                subtitle="Live datastream"
                icon={<Icons.Activity />}
                delay={300}
                spotlightColor="rgba(245, 158, 11, 0.2)"
              >
                <ActivityTicker />
              </DashboardCard>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Primary Action Card: Venture Synthesis */}
              <div className="lg:col-span-2">
                <DashboardCard
                  title="Venture Synthesis Engine"
                  subtitle="Generate high-potential project concepts by intersecting Market Needs with Research Capabilities."
                  icon={<Icons.Rocket />}
                  delay={400}
                  spotlightColor="rgba(168, 85, 247, 0.2)"
                  onClick={() => handleNavClick('opportunity_matrix')}
                  className="bg-purple-900/10 border-purple-500/30"
                >
                  <div className="flex justify-end items-center">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow-lg shadow-purple-900/40 text-sm transition-colors">
                      Launch Generator →
                    </button>
                  </div>
                </DashboardCard>
              </div>

              {/* Secondary Actions */}
              <DashboardCard
                title="Global Intel"
                subtitle="Browse news & industry signals"
                icon={<Icons.Newspaper />}
                delay={500}
                onClick={() => handleNavClick('intelligence')}
              >
                <div className="text-right">
                  <button className="text-xs text-blue-400 hover:underline">Explore trends →</button>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Tech Encyclopedia"
                subtitle="Reference SWOTs and Patents"
                icon={<Icons.Flask />}
                delay={600}
                onClick={() => handleNavClick('swot_library')}
              >
                <div className="text-right">
                  <button className="text-xs text-blue-400 hover:underline">Browse database →</button>
                </div>
              </DashboardCard>

            </div>

          </div>
        )}

        {/* Content Pages */}
        {!isAnalysisActive && activeTab === 'opportunity_matrix' && <OpportunityMatrixView onLaunchProposal={handleLaunchProposal} modelId={selectedModel} />}
        {!isAnalysisActive && activeTab === 'assessment' && <ProjectAssessmentView onAnalyze={setAnalysisState} initialData={projectProposalData} modelId={selectedModel} />}
        {!isAnalysisActive && activeTab === 'swot_library' && <SwotLibraryView />}
        {!isAnalysisActive && activeTab === 'intelligence' && <IntelligenceView />}


        {/* Analysis View (Overlays everything if active) */}
        {isAnalysisActive && (
          <div className="w-full">
            {(analysisState.status === 'scanning' || analysisState.status === 'analyzing') && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in-up">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-4 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Deep Dive Analysis</h2>
                  <p className="text-slate-400 font-mono text-sm">
                    {analysisState.status === 'scanning' ? 'VALIDATING ASSUMPTIONS...' : 'GENERATING STRATEGIC REPORT...'}
                  </p>
                </div>
              </div>
            )}

            {analysisState.status === 'error' && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="p-4 bg-rose-500/10 rounded-full text-rose-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
                <p className="text-rose-400">{analysisState.error}</p>
                <button
                  onClick={() => setAnalysisState({ status: 'idle', data: null })}
                  className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white text-sm font-medium transition-colors"
                >
                  Return to Command Center
                </button>
              </div>
            )}

            {analysisState.status === 'complete' && analysisState.data && (
              <AnalysisResult
                data={analysisState.data}
                onBack={() => setAnalysisState({ status: 'idle', data: null })}
                backLabel="Return to Command Center"
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs font-mono">
          APEX STRATEGIC AI • POWERED BY GOOGLE GEMINI • V4.0
        </p>
      </footer>
    </div>
  );
};

export default App;