import React from 'react';

const PAPERS = [
    { title: "3D Gaussian Splatting for Real-Time Radiance Field Rendering", authors: "Kerbl et al.", conference: "SIGGRAPH 2023", tags: ["Rendering", "NeRF"] },
    { title: "Segment Anything", authors: "Kirillov et al.", conference: "ICCV 2023", tags: ["Segmentation", "Foundation Model"] },
    { title: "YOLO-World: Real-Time Open-Vocabulary Object Detection", authors: "Cheng et al.", conference: "CVPR 2024", tags: ["Detection", "Real-time"] },
    { title: "Event-based Vision: A Survey", authors: "Gallego et al.", conference: "TPAMI 2022", tags: ["Neuromorphic", "Survey"] },
    { title: "Learning to Fly by Crashing", authors: "Gandhi et al.", conference: "IROS 2017", tags: ["Robotics", "Reinforcement Learning"] }
];

const ResearchView: React.FC = () => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Research (ArXiv)</h2>
            <p className="text-slate-400 mt-2">Curated feed of breakthrough papers in Computer Vision.</p>
        </div>

        <div className="space-y-4">
            {PAPERS.map((p, i) => (
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
                        <div className="flex gap-2">
                            {p.tags.map((t, idx) => (
                                <span key={idx} className="px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ResearchView;