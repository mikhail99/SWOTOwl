
export interface SwotAnalysis {
  topic: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  technicalViabilityScore: number;
  marketReadinessScore: number;
  summary: string;
  keyPatents?: string[];
  relevantPapers?: string[];
  webSources?: { title: string; uri: string }[];
}

export interface AnalysisState {
  status: 'idle' | 'scanning' | 'analyzing' | 'complete' | 'error';
  data: SwotAnalysis | null;
  error?: string;
}
