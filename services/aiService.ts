import { GoogleGenAI, Type } from "@google/genai";
import { SwotAnalysis } from "../types";
import { llmService } from "./llmService";
import { buildSwotPrompt, parseSwotResponse, buildIdeationPrompt, parseIdeationResponse } from "./prompts";

// Helper to get API key safely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export interface ProjectDetails {
  title: string;
  technology: string;
  market: string;
  description: string;
}

export interface OpportunityItem {
  id: string;
  theme: string;
  marketSignal: string;
  researchCapability: string;
  synthesizedOpportunity: string;
  conceptTitle: string;
  confidenceScore: number;
}

const COMMON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
    technicalViabilityScore: { type: Type.NUMBER, description: "0 to 100 score" },
    marketReadinessScore: { type: Type.NUMBER, description: "0 to 100 score" },
    summary: { type: Type.STRING, description: "A concise executive summary of the technology." },
    keyPatents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hypothetical or real related patent classifications/areas" },
    relevantPapers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Types of research papers relevant to this" }
  },
  required: ["topic", "strengths", "weaknesses", "opportunities", "threats", "technicalViabilityScore", "marketReadinessScore", "summary"],
};

const extractSources = (response: any): { title: string; uri: string }[] => {
  if (!response.candidates?.[0]?.groundingMetadata?.groundingChunks) return [];

  // Filter for chunks that have web data
  const sources = response.candidates[0].groundingMetadata.groundingChunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri && web.title);

  // Deduplicate based on URI
  const uniqueSources: { title: string; uri: string }[] = [];
  const seenUris = new Set();

  for (const source of sources) {
    if (!seenUris.has(source.uri)) {
      seenUris.add(source.uri);
      uniqueSources.push(source);
    }
  }

  return uniqueSources;
};

/**
 * Main switch for analysis
 */
export const analyzeTech = async (topic: string, modelId: string = "gemini-3-pro-preview"): Promise<SwotAnalysis> => {
  if (modelId.startsWith('gemini')) {
    return analyzeTechGemini(topic, modelId);
  } else {
    return analyzeTechLocal(topic, modelId);
  }
}

const analyzeTechGemini = async (topic: string, modelId: string): Promise<SwotAnalysis> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configured the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an elite Strategic Technical Intelligence Analyst specializing in Computer Vision, Sensor Design, and Autonomous Systems.
    Your task is to evaluate technical projects, patents, and research papers to provide a comprehensive SWOT analysis.
    
    CRITICAL: You have access to Google Search. Use it to find REAL, VERIFIABLE recent developments, patents from 2024-2025, and actual Arxiv papers.
    
    Focus on:
    1. Technical feasibility (physics, engineering limits).
    2. Novelty compared to existing Arxiv papers and Patents.
    3. Market trends and commercial viability.
    
    Be critical, precise, and data-driven in your tone.
  `;

  const prompt = `Conduct a deep-dive strategic analysis on: "${topic}". 
  Evaluate it specifically within the context of computer vision and sensor technology.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: COMMON_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysis = JSON.parse(text) as SwotAnalysis;
    analysis.webSources = extractSources(response);

    return analysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

const analyzeTechLocal = async (topic: string, modelId: string): Promise<SwotAnalysis> => {
  const status = llmService.getStatus();
  if (!status.ready) {
    await llmService.loadModel(modelId);
  }

  const project: ProjectDetails = {
    title: topic,
    technology: topic,
    market: "General Tech",
    description: `Perform a deep technical SWOT analysis on ${topic}.`
  };

  const prompt = buildSwotPrompt(project);
  const response = await llmService.generate(prompt);
  const analysis = parseSwotResponse(response);

  analysis.topic = topic;
  return analysis;
}

/**
 * Main switch for Project Evaluation
 */
export const evaluateProject = async (details: ProjectDetails, modelId: string = "gemini-3-pro-preview"): Promise<SwotAnalysis> => {
  if (modelId.startsWith('gemini')) {
    return evaluateProjectGemini(details, modelId);
  } else {
    return evaluateProjectLocal(details, modelId);
  }
}

const evaluateProjectGemini = async (details: ProjectDetails, modelId: string): Promise<SwotAnalysis> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configured the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Venture Technologist and R&D Assessor for Computer Vision systems.
    Evaluate the provided project proposal with extreme scrutiny.
    
    Use Google Search to validate claims against current state-of-the-art research and market competitors.
    
    Assess:
    1. Innovation: Is this novel or a commodity?
    2. Feasibility: Are there physics or manufacturing bottlenecks?
    3. Market Fit: Does the target market actually need this specific solution?

    Provide a candid SWOT analysis.
  `;

  const prompt = `
    Conduct a Strategic Project Assessment for:
    
    Project Title: ${details.title}
    Core Technology: ${details.technology}
    Target Market: ${details.market}
    Technical Description: ${details.description}
    
    Output the result as a structured SWOT analysis JSON.
    For 'topic', use the Project Title.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: COMMON_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysis = JSON.parse(text) as SwotAnalysis;
    analysis.webSources = extractSources(response);

    return analysis;
  } catch (error) {
    console.error("Project evaluation failed:", error);
    throw error;
  }
};

const evaluateProjectLocal = async (details: ProjectDetails, modelId: string): Promise<SwotAnalysis> => {
  const status = llmService.getStatus();
  if (!status.ready) {
    await llmService.loadModel(modelId);
  }

  const prompt = buildSwotPrompt(details);
  const response = await llmService.generate(prompt);
  const analysis = parseSwotResponse(response);

  analysis.topic = details.title;
  return analysis;
}

/**
 * Main switch for Opportunity Generation
 */
export const generateOpportunities = async (
  technology: string = "All",
  industry: string = "All",
  context: string = "",
  modelId: string = "gemini-3-pro-preview"
): Promise<OpportunityItem[]> => {
  if (modelId.startsWith('gemini')) {
    return generateOpportunitiesGemini(technology, industry, context, modelId);
  } else {
    return generateOpportunitiesLocal(technology, industry, context, modelId);
  }
}

const generateOpportunitiesGemini = async (
  technology: string,
  industry: string,
  context: string,
  modelId: string
): Promise<OpportunityItem[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configured the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const techConstraint = technology !== "All" ? `Focus strictly on ${technology} technology.` : "Consider all advanced sensor technologies (LiDAR, SPAD, SWIR, etc).";
  const marketConstraint = industry !== "All" ? `Focus strictly on the ${industry} industry.` : "Consider all high-growth sectors (Automotive, Medical, Industrial, etc).";
  const userContext = context ? `Strategic Context/Ideas provided by user: "${context}". Ensure concepts align with this context.` : "";

  const systemInstruction = `
    You are a Strategic R&D Architect for a high-tech sensor company.
    Your goal is to synthesize new product opportunities by intersecting emerging Market Needs with advanced Research Capabilities.
    
    Constraints:
    1. ${techConstraint}
    2. ${marketConstraint}
    3. ${userContext}
    
    Process (Chain of Ideas):
    1. Scan the landscape based on constraints.
    2. Match problems with sensor capabilities.
    3. Generate 3 distinct, high-value product concepts.
    4. Filter for Technical Feasibility x Market Value.
  `;

  const OPPORTUNITY_SCHEMA = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        theme: { type: Type.STRING, description: "Broad category, e.g. 'AR/VR Evolution'" },
        marketSignal: { type: Type.STRING, description: "The demand or problem statement" },
        researchCapability: { type: Type.STRING, description: "The technical solution or enabler" },
        synthesizedOpportunity: { type: Type.STRING, description: "The resulting product concept" },
        conceptTitle: { type: Type.STRING, description: "A catchy name for the project" },
        confidenceScore: { type: Type.NUMBER, description: "0-100 rating of success probability" }
      },
      required: ["id", "theme", "marketSignal", "researchCapability", "synthesizedOpportunity", "conceptTitle", "confidenceScore"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate the top 3 strategic R&D opportunities based on the defined constraints.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: OPPORTUNITY_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as OpportunityItem[];
  } catch (error) {
    console.error("Opportunity generation failed:", error);
    throw error;
  }
};

const generateOpportunitiesLocal = async (
  technology: string,
  industry: string,
  context: string,
  modelId: string
): Promise<OpportunityItem[]> => {
  const status = llmService.getStatus();
  if (!status.ready) {
    await llmService.loadModel(modelId);
  }

  const prompt = buildIdeationPrompt(technology, industry, context);
  const response = await llmService.generate(prompt);
  return parseIdeationResponse(response);
}