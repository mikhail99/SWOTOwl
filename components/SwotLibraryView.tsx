import React, { useState, useMemo } from 'react';
import { SwotAnalysis } from '../types';
import AnalysisResult from './AnalysisResult';
import SpotlightCard from './SpotlightCard';
import { INDUSTRIES_LIST, SENSORS_LIST } from '../constants';

// --- Data Definitions ---

const INDUSTRIES = ["All", ...INDUSTRIES_LIST];
const SENSORS = ["All", ...SENSORS_LIST];

const SENSOR_DATA: Record<string, SwotAnalysis> = {
  "SPAD": {
    topic: "SPAD (Single-Photon Avalanche Diode)",
    summary: "SPADs represent the pinnacle of silicon-based photon counting, transitioning from niche scientific instruments to ubiquitous sensors in mobile and automotive sectors. By operating diode structures above the breakdown voltage (Geiger mode), SPADs convert single incoming photons into macroscopic digital current pulses. This technology is the cornerstone of modern Direct Time-of-Flight (dToF) LiDAR, offering unrivaled timing precision. While Silicon-based SPADs face physical limitations in the SWIR spectrum and dynamic range challenges in bright sunlight, innovations in 3D-stacked backside-illuminated (BSI) architectures and coincident processing logic are mitigating these issues, cementing SPADs as a critical enabler for 3D computer vision.",
    strengths: [
      "Picosecond-level timing resolution enables high-precision Direct Time-of-Flight (dToF) measurements.",
      "Operates in Geiger-mode providing digital output (photon counting) eliminating read noise.",
      "CMOS compatibility allows for cost-effective mass production and 3D stacking with logic layers.",
      "Extreme sensitivity capable of detecting single photon events, superior for low-light imaging."
    ],
    weaknesses: [
      "Susceptible to 'pile-up' effects (saturation) in high ambient light (e.g., direct sunlight), causing distance distortion.",
      "Intrinsic 'dead time' after triggering limits dynamic range and maximum count rates.",
      "Lower Photon Detection Efficiency (PDE) in the Near-Infrared (NIR) spectrum compared to APDs or InGaAs sensors due to Silicon absorption limits.",
      "High Dark Count Rate (DCR) significantly impacts Signal-to-Noise Ratio (SNR) in uncooled environments."
    ],
    opportunities: [
      "Integration into consumer mobile devices for AR/VR depth sensing and computational photography (e.g., Apple LiDAR).",
      "Development of Quanta Image Sensors (QIS) to replace standard CIS in scientific and extreme low-light surveillance.",
      "Automotive Solid-State LiDAR utilizing addressable SPAD arrays for robust ADAS perception.",
      "Non-Line-of-Sight (NLOS) imaging techniques leveraging multi-bounce photon timing.",
      "Bio-medical applications in Fluorescence Lifetime Imaging Microscopy (FLIM)."
    ],
    threats: [
      "Emergence of Frequency Modulated Continuous Wave (FMCW) LiDAR which offers velocity data and interference immunity.",
      "Advancements in SWIR (Short-Wave Infrared) sensors (InGaAs, Ge-on-Si) which allow higher laser power and better fog penetration.",
      "Rapid commoditization leading to margin compression for sensor manufacturers."
    ],
    technicalViabilityScore: 92,
    marketReadinessScore: 85,
    keyPatents: ["US-9988776", "US-1122334"],
    relevantPapers: ["Review of SPAD Arrays (2023)"]
  },
  "SWIR": {
    topic: "SWIR (Short-Wave Infrared)",
    summary: "Imaging in the 1000-1700nm range, allowing vision through fog, smoke, and silicon wafers.",
    strengths: ["Penetrates atmospheric obscurants", "Material identification", "Night vision without glow", "See through silicon"],
    weaknesses: ["High cost (InGaAs)", "Lower resolution than visible", "Complex flip-chip bonding"],
    opportunities: ["Adverse weather vision", "Industrial sorting", "Semiconductor inspection"],
    threats: ["Emerging CQD sensors", "Ge-on-Si cost reduction"],
    technicalViabilityScore: 88,
    marketReadinessScore: 75,
    keyPatents: ["US-10203001", "WO-2022-5544"],
    relevantPapers: ["CQD SWIR Imaging Advances"]
  },
  "Hyperspectral": {
    topic: "Hyperspectral Imaging",
    summary: "Captures information across the electromagnetic spectrum, providing spectral signatures for every pixel.",
    strengths: ["Precise material identification", "Chemical composition analysis", "Non-invasive diagnostics"],
    weaknesses: ["Massive data volume", "Complex optical design", "Low temporal resolution (scanning)"],
    opportunities: ["Precision agriculture", "Medical diagnostics", "Recycling/waste sorting"],
    threats: ["Multispectral approximations", "AI-enhanced RGB analysis"],
    technicalViabilityScore: 78,
    marketReadinessScore: 70,
    keyPatents: ["US-8877665"],
    relevantPapers: ["Snapshot Hyperspectral Sensors"]
  },
  "Global Shutter": {
    topic: "Global Shutter CMOS",
    summary: "Sensor architecture that exposes all pixels simultaneously, eliminating motion artifacts.",
    strengths: ["Zero motion artifacts", "High speed imaging", "Simplified synchronization"],
    weaknesses: ["Higher read noise", "Lower dynamic range (typically)", "Higher cost per pixel"],
    opportunities: ["High-speed robotics", "VR/AR tracking cameras", "Driver monitoring"],
    threats: ["Fast rolling shutter algorithms", "Event-based sensors"],
    technicalViabilityScore: 95,
    marketReadinessScore: 98,
    keyPatents: ["US-11005566"],
    relevantPapers: ["Global Shutter Pixel Architectures"]
  },
  "RGB-D": {
    topic: "RGB-D (Depth)",
    summary: "Combines standard color imaging with depth information (Structured Light, ToF, or Stereo).",
    strengths: ["Rich 3D spatial data", "Established ecosystems", "Direct point cloud generation"],
    weaknesses: ["Range limitations", "Multipath interference", "Power consumption"],
    opportunities: ["Augmented Reality", "Robotic navigation (SLAM)", "Gesture control"],
    threats: ["Passive sensing improvements", "Monocular depth estimation (AI)"],
    technicalViabilityScore: 90,
    marketReadinessScore: 95,
    keyPatents: ["US-20100118123"],
    relevantPapers: ["RGB-D SLAM Survey"]
  },
  "LiDAR": {
    topic: "FMCW LiDAR",
    summary: "Frequency-Modulated Continuous Wave LiDAR providing instant velocity (Doppler) and range data per pixel.",
    strengths: ["Direct velocity measurement", "Immune to interference/glare", "High range precision", "Solid-state potential"],
    weaknesses: ["High computational complexity", "Stringent laser coherence requirements", "Current cost of optics"],
    opportunities: ["L4 Autonomous highway driving", "Long-range perimeter security", "Industrial metrology"],
    threats: ["High-res Radar fusion", "Stereo-vision improvements"],
    technicalViabilityScore: 89,
    marketReadinessScore: 80,
    keyPatents: ["US-10557921 (Intel/Mobileye)", "US-9874630 (Blackmore)"],
    relevantPapers: ["Silicon Photonics for FMCW LiDAR"]
  },
  "UWB": {
    topic: "UWB Radar (Impulse Radio)",
    summary: "Short-range, high-bandwidth radio technology used for precise localization and vital sign detection.",
    strengths: ["Sub-centimeter precision", "Penetrates non-metallic walls", "Low power consumption", "Multipath resistance"],
    weaknesses: ["Short effective range", "Antenna design complexity", "Spectrum regulation variances"],
    opportunities: ["In-cabin child presence detection", "Contactless vital sign monitoring", "Secure digital keys", "Indoor asset tracking"],
    threats: ["Wi-Fi Sensing (802.11bf)", "BLE Channel Sounding"],
    technicalViabilityScore: 94,
    marketReadinessScore: 92,
    keyPatents: ["US-10345450", "EP-3025123"],
    relevantPapers: ["UWB Radar for Vital Signs"]
  }
};

const MARKET_DATA: Record<string, SwotAnalysis> = {
  "Automotive": {
    topic: "Automotive Market",
    summary: "Sector focusing on ADAS and autonomous driving technologies.",
    strengths: ["High volume potential", "Technology driver", "Regulatory push for safety"],
    weaknesses: ["Long qualification cycles", "Strict reliability (AEC-Q100)", "Cost pressure"],
    opportunities: ["L4/L5 Autonomy", "In-cabin monitoring", "V2X Communication"],
    threats: ["Regulatory stalling", "Public trust in AI", "Supply chain disruptions"],
    technicalViabilityScore: 85,
    marketReadinessScore: 90,
    keyPatents: ["Waymo IP", "Tesla Vision"],
    relevantPapers: ["End-to-end Driving Models"]
  },
  "Consumer": {
    topic: "Consumer Electronics",
    summary: "Smartphones, AR/VR headsets, and home robotics.",
    strengths: ["Massive scale", "Rapid innovation cycles", "User adoption readiness"],
    weaknesses: ["Extreme cost sensitivity", "Space/Power constraints", "Privacy concerns"],
    opportunities: ["AR Glasses", "Metaverse interaction", "Biometric security"],
    threats: ["Market saturation", "Privacy regulation (GDPR)", "Hardware commoditization"],
    technicalViabilityScore: 95,
    marketReadinessScore: 98,
    keyPatents: ["Apple FaceID", "Samsung Fold"],
    relevantPapers: ["Mobile EfficientNet"]
  },
  "Medical": {
    topic: "Medical Imaging",
    summary: "Healthcare diagnostics, surgical robotics and patient monitoring.",
    strengths: ["High value/margin", "Life-saving impact", "Demand for precision"],
    weaknesses: ["Strict FDA/MDR regulation", "Slow adoption", "Data privacy (HIPAA)"],
    opportunities: ["AI-assisted diagnostics", "Remote patient monitoring", "Endoscopic vision"],
    threats: ["Liability issues", "Cybersecurity in hospitals"],
    technicalViabilityScore: 80,
    marketReadinessScore: 70,
    keyPatents: ["Intuitive Surgical IP"],
    relevantPapers: ["AI in Radiology"]
  },
  "Industrial": {
    topic: "Industrial (Industry 4.0)",
    summary: "Machine vision for automation, quality control, and logistics.",
    strengths: ["Clear ROI", "Controlled environments", "Acceptance of complex tech"],
    weaknesses: ["Integration complexity", "Legacy systems", "Skill gap in workforce"],
    opportunities: ["Lights-out manufacturing", "Predictive maintenance", "Logistics automation"],
    threats: ["Economic downturns", "Infrastructure cyber threats"],
    technicalViabilityScore: 92,
    marketReadinessScore: 88,
    keyPatents: ["Cognex Vision"],
    relevantPapers: ["Industrial IoT Vision"]
  },
  "Aerospace": {
    topic: "Aerospace & Defense",
    summary: "Avionics, UAVs, and satellite constellations requiring extreme reliability and SWaP-C optimization.",
    strengths: ["High barrier to entry", "Performance prioritized over cost", "Long-term contracts"],
    weaknesses: ["Extremely rigorous certification (DO-178C)", "ITAR/Export restrictions", "Slow design cycles"],
    opportunities: ["Autonomous UAV swarms", "Low-Earth Orbit (LEO) imaging", "Hypersonic guidance"],
    threats: ["Geopolitical instability", "Supply chain sovereignty", "Anti-satellite technologies"],
    technicalViabilityScore: 96,
    marketReadinessScore: 85,
    keyPatents: ["US-10996324 (Lockheed)", "US-9874630 (Blackmore)"],
    relevantPapers: ["Deep Learning for UAV Navigation"]
  },
  "Energy": {
    topic: "Energy & Infrastructure",
    summary: "Smart grid monitoring, renewable asset inspection, and oil & gas safety systems.",
    strengths: ["Critical infrastructure necessity", "Massive scale of deployment", "Governmental green incentives"],
    weaknesses: ["Harsh environmental conditions", "Remote connectivity gaps", "Legacy grid compatibility"],
    opportunities: ["Drone-based wind turbine inspection", "Thermal leak detection", "Nuclear reactor monitoring robotics"],
    threats: ["Cyber-physical attacks", "Fluctuating energy prices", "Regulatory shifts"],
    technicalViabilityScore: 88,
    marketReadinessScore: 82,
    keyPatents: ["US-2023005566 (Siemens)", "WO-2022-112233"],
    relevantPapers: ["Vision-based Power Line Inspection"]
  }
};

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

const SwotLibraryView: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeSensor, setActiveSensor] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'combined'>('grid');

  // Logic to synthesize a combined OR individual SWOT analysis
  const combinedData = useMemo(() => {
    // If both are All, no specific analysis to show
    if (activeIndustry === "All" && activeSensor === "All") return null;

    const sensor = SENSOR_DATA[activeSensor];
    const market = MARKET_DATA[activeIndustry];

    // Case 1: Both selected -> Combined Analysis
    if (activeIndustry !== "All" && activeSensor !== "All") {
        if (!sensor || !market) return null;
        return {
        topic: `${sensor.topic.split('(')[0].trim()} in ${market.topic}`,
        summary: `Strategic alignment analysis of ${sensor.topic} technology applied specifically to the ${market.topic}. Evaluates technical fit against market constraints.`,
        strengths: [
            ...sensor.strengths.slice(0, 2),
            ...market.strengths.slice(0, 2),
            `Synergy: ${sensor.strengths[0]} meets ${market.topic} needs`
        ],
        weaknesses: [
            ...sensor.weaknesses.slice(0, 2),
            ...market.weaknesses.slice(0, 2),
            `Barrier: ${market.weaknesses[0]} vs ${sensor.topic} maturity`
        ],
        opportunities: [
            ...sensor.opportunities.slice(0, 1),
            ...market.opportunities.slice(0, 1),
            `Strategic: Applying ${sensor.topic} for ${market.opportunities[0]}`
        ],
        threats: [
            ...market.threats.slice(0, 2),
            ...sensor.threats.slice(0, 1)
        ],
        technicalViabilityScore: Math.round((sensor.technicalViabilityScore + market.technicalViabilityScore) / 2),
        marketReadinessScore: Math.round((sensor.marketReadinessScore + market.marketReadinessScore) / 2),
        keyPatents: [...(sensor.keyPatents || []), ...(market.keyPatents || [])],
        relevantPapers: [...(sensor.relevantPapers || []), ...(market.relevantPapers || [])]
        } as SwotAnalysis;
    }

    // Case 2: Only Sensor selected
    if (activeSensor !== "All" && sensor) {
        return sensor;
    }

    // Case 3: Only Industry selected
    if (activeIndustry !== "All" && market) {
        return market;
    }

    return null;
  }, [activeIndustry, activeSensor]);

  // Determine what to show in the grid
  const visibleSensors = activeSensor === "All" 
    ? Object.values(SENSOR_DATA) 
    : [SENSOR_DATA[activeSensor]];
    
  const visibleMarkets = activeIndustry === "All" 
    ? Object.values(MARKET_DATA) 
    : [MARKET_DATA[activeIndustry]];

  const handleIndustryChange = (ind: string) => {
    setActiveIndustry(ind);
    if (ind !== "All" || activeSensor !== "All") {
      setViewMode('combined');
    } else {
      setViewMode('grid');
    }
  };

  const handleSensorChange = (sen: string) => {
    setActiveSensor(sen);
    if (activeIndustry !== "All" || sen !== "All") {
      setViewMode('combined');
    } else {
      setViewMode('grid');
    }
  };

  const resetSelection = () => {
    setActiveIndustry("All");
    setActiveSensor("All");
    setViewMode('grid');
  };

  const handleGridCardClick = () => {
     setViewMode('combined');
  };

  if (viewMode === 'combined' && combinedData) {
    return (
      <AnalysisResult 
        data={combinedData} 
        onBack={() => setViewMode('grid')} 
        backLabel="Back to Selection"
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
         <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">SWOT Library</h2>
            <p className="text-slate-400 max-w-xl">
              Select an <span className="text-blue-400">Industry</span> or a <span className="text-emerald-400">Sensor Technology</span> to view strategic analysis. Combine both for specific insights.
            </p>
         </div>
         { (activeIndustry !== "All" || activeSensor !== "All") && (
            <button 
              onClick={resetSelection}
              className="text-xs text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-4"
            >
              Reset Filters
            </button>
         )}
       </div>

       {/* Filters */}
       <div className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50">
          
          {/* Industry Segments */}
          <div className="space-y-3">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Industry Segments</div>
             <div className="flex flex-wrap gap-3">
                {INDUSTRIES.map(ind => (
                  <FilterPill 
                    key={ind} 
                    label={ind} 
                    active={activeIndustry === ind} 
                    onClick={() => handleIndustryChange(ind)}
                    color="blue"
                  />
                ))}
             </div>
          </div>

          {/* Sensor Tech */}
          <div className="space-y-3">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Sensor Technologies</div>
             <div className="flex flex-wrap gap-3">
                {SENSORS.map(sen => (
                  <FilterPill 
                    key={sen} 
                    label={sen} 
                    active={activeSensor === sen} 
                    onClick={() => handleSensorChange(sen)}
                    color="emerald"
                  />
                ))}
             </div>
          </div>
       </div>

       {/* Grid Content */}
       <div className="space-y-10 mt-8">
          
          {/* Only show Markets if specific industry is selected OR All is selected */}
          {activeSensor === "All" && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-lg font-bold text-blue-100 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                 {activeIndustry === "All" ? "Target Markets" : "Selected Market"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleMarkets.map((item, idx) => (
                    <div key={idx} className="h-full cursor-pointer" onClick={handleGridCardClick}>
                      <SpotlightCard className="p-6 h-full flex flex-col group border-blue-500/10 hover:border-blue-500/30 bg-blue-900/5" spotlightColor="rgba(59, 130, 246, 0.15)">
                        <div className="flex justify-between items-start mb-4">
                            <div className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">Market</div>
                            <div className="text-xs font-mono text-slate-500">{item.marketReadinessScore}/100</div>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{item.topic}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{item.summary}</p>
                        <div className="mt-auto pt-4 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Analysis →
                        </div>
                      </SpotlightCard>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Only show Sensors if specific sensor is selected OR All is selected */}
          {activeIndustry === "All" && (
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-lg font-bold text-emerald-100 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                 {activeSensor === "All" ? "Sensor Technologies" : "Selected Technology"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleSensors.map((item, idx) => (
                    <div key={idx} className="h-full cursor-pointer" onClick={handleGridCardClick}>
                      <SpotlightCard className="p-6 h-full flex flex-col group border-emerald-500/10 hover:border-emerald-500/30 bg-emerald-900/5" spotlightColor="rgba(16, 185, 129, 0.15)">
                        <div className="flex justify-between items-start mb-4">
                            <div className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Sensor</div>
                            <div className="text-xs font-mono text-slate-500">{item.technicalViabilityScore}/100</div>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{item.topic}</h4>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{item.summary}</p>
                        <div className="mt-auto pt-4 text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Analysis →
                        </div>
                      </SpotlightCard>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Helper Message if partial selection */}
          {activeIndustry !== "All" && activeSensor === "All" && (
             <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500 bg-slate-900/20">
                You can also select a <span className="text-emerald-400 font-bold">Sensor Technology</span> to view a combined analysis.
             </div>
          )}

           {activeSensor !== "All" && activeIndustry === "All" && (
             <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500 bg-slate-900/20">
                You can also select an <span className="text-blue-400 font-bold">Industry Segment</span> to view a combined analysis.
             </div>
          )}

       </div>
    </div>
  );
};

export default SwotLibraryView;