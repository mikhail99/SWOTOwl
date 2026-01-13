import React from 'react';

const PATENTS = [
    { id: "US-2024-0012345", title: "Solid-state Lidar with beam steering phased array", assignee: "Lumina Tech", date: "2024-01-15", status: "Published" },
    { id: "US-2024-0098765", title: "Event-based sensor pixel architecture with HDR", assignee: "Prophesee", date: "2024-02-01", status: "Granted" },
    { id: "WO-2023-112233", title: "Method for monocular depth estimation using transformers", assignee: "Tesla Motors", date: "2023-11-20", status: "Filed" },
    { id: "US-2023-998877", title: "Display device with under-screen camera system", assignee: "Apple Inc.", date: "2023-10-10", status: "Granted" },
];

const PatentsView: React.FC = () => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="mb-8 flex justify-between items-end">
             <div>
                <h2 className="text-3xl font-bold text-white">Patent Watchlist</h2>
                <p className="text-slate-400 mt-2">Recent IP filings in relevant technology sectors.</p>
             </div>
             <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded text-sm transition-colors">
                Export CSV
             </button>
        </div>
        
         <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 border-b border-slate-700/50 bg-slate-800/50 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Publication ID</th>
                        <th className="p-4 font-semibold">Title</th>
                        <th className="p-4 font-semibold">Assignee</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody className="text-slate-200 divide-y divide-slate-800/50">
                    {PATENTS.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                            <td className="p-4 font-mono text-sm text-amber-400 group-hover:text-amber-300">{p.id}</td>
                            <td className="p-4 font-medium text-sm">{p.title}</td>
                            <td className="p-4 text-slate-400 text-sm">{p.assignee}</td>
                            <td className="p-4 text-slate-500 text-sm font-mono">{p.date}</td>
                            <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                    p.status === 'Granted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    'bg-slate-700/50 text-slate-300 border-slate-600'
                                }`}>
                                    {p.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default PatentsView;