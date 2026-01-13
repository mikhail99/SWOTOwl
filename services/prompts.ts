/**
 * Prompts optimized for small local models (0.6B - 1B parameters)
 * These are simpler and more direct than prompts for larger models
 */

import { ProjectDetails } from './aiService';

/**
 * SWOT Analysis prompt for local models
 * Uses simpler structure that small models can follow
 */
export function buildSwotPrompt(project: ProjectDetails, context: string = ""): string {
    return `You are a technical analyst. Analyze this project using the context provided.
Do NOT use placeholders like [brackets]. Be specific.

PROJECT:
Title: ${project.title}
Description: ${project.description}
Technology: ${project.technology}
Market: ${project.market}

${context ? `CONTEXT (recent research and market signals):\n${context}\n` : ''}

EXAMPLE FORMAT:
STRENGTHS:
1. High quantum efficiency in NIR spectrum.
2. Direct CMOS integration.

WEAKNESSES:
1. High power consumption.
2. Sensitive to ambient temperature.

OPPORTUNITIES:
1. Automotive LiDAR miniaturization.
2. Low-cost industrial scanners.

THREATS:
1. FMCW LiDAR competition.
2. Regulatory export limits.

SUMMARY:
The technology is highly viable for short-range sensing but needs optimization for thermal stability.

Generate your analysis now.`;
}

/**
 * Parse SWOT response from local model (less structured output)
 */
export function parseSwotResponse(text: string): any {
    const sections = {
        topic: '',
        strengths: [] as string[],
        weaknesses: [] as string[],
        opportunities: [] as string[],
        threats: [] as string[],
        summary: '',
        technicalViabilityScore: 70, // Default for local
        marketReadinessScore: 60,    // Default for local
    };

    const lines = text.split('\n');
    let currentSection = '';

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.toUpperCase().startsWith('STRENGTHS')) {
            currentSection = 'strengths';
        } else if (trimmed.toUpperCase().startsWith('WEAKNESSES')) {
            currentSection = 'weaknesses';
        } else if (trimmed.toUpperCase().startsWith('OPPORTUNITIES')) {
            currentSection = 'opportunities';
        } else if (trimmed.toUpperCase().startsWith('THREATS')) {
            currentSection = 'threats';
        } else if (trimmed.toUpperCase().startsWith('SUMMARY')) {
            currentSection = 'summary';
        } else if (trimmed && currentSection) {
            if (currentSection === 'summary') {
                sections.summary += trimmed + ' ';
            } else {
                // Parse numbered or bulleted points
                const pointMatch = trimmed.match(/^[\d\-\*\.]+\s*(.+)/);
                if (pointMatch && currentSection in sections) {
                    (sections[currentSection as keyof typeof sections] as any[]).push(pointMatch[1]);
                }
            }
        }
    }

    sections.summary = sections.summary.trim();
    return sections;
}

/**
 * Ideation prompt for local models
 */
export function buildIdeationPrompt(technology: string, industry: string, context: string): string {
    return `You are a Strategic R&D Architect. 
Generate 3 novel product concepts for ${technology} in the ${industry} industry.
${context ? `User Context: ${context}` : ''}

CRITICAL: Do NOT use brackets or placeholders in your response. Output real, concrete ideas.

EXAMPLE FORMAT:
---
TITLE: QuantumDepth 3000
THEME: Industrial Metrology
MARKET: High-precision quality control in semiconductor manufacturing.
RESEARCH: Sub-picosecond timing precision in SPAD detectors.
CONCEPT: A direct ToF scanner capable of sub-millimeter accurate 3D maps of circuit boards.
SCORE: 85
---

Generate 3 unique concepts now.`;
}

/**
 * Parse Ideation response
 */
export function parseIdeationResponse(text: string): any[] {
    const opportunities: any[] = [];
    const blocks = text.split('---');

    for (const block of blocks) {
        if (!block.includes('TITLE:')) continue;

        const lines = block.split('\n');
        const item: any = { id: `local_${Math.random().toString(36).substr(2, 9)}` };

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('TITLE:')) item.conceptTitle = trimmed.replace('TITLE:', '').trim();
            if (trimmed.startsWith('THEME:')) item.theme = trimmed.replace('THEME:', '').trim();
            if (trimmed.startsWith('MARKET:')) item.marketSignal = trimmed.replace('MARKET:', '').trim();
            if (trimmed.startsWith('RESEARCH:')) item.researchCapability = trimmed.replace('RESEARCH:', '').trim();
            if (trimmed.startsWith('CONCEPT:')) item.synthesizedOpportunity = trimmed.replace('CONCEPT:', '').trim();
            if (trimmed.startsWith('SCORE:')) item.confidenceScore = parseInt(trimmed.replace('SCORE:', '').trim()) || 70;
        }

        if (item.conceptTitle) opportunities.push(item);
    }

    return opportunities;
}
