import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }) : null;

export const analyzeManifesto = async (manifestoText: string, userIssues: string[]): Promise<any> => {
    if (!model) {
        console.warn("GEMINI_API_KEY is not set. Returning mock policy analysis.");
        return generateMockAnalysis(userIssues);
    }

    try {
        // Step 1: Extract
        const extractionPrompt = `
            Extract key policies from this manifesto, organized by category.
            Return ONLY a valid JSON object with the following structure, nothing else:
            { "categories": { "CategoryName": ["policy 1", "policy 2"] } }
            
            Manifesto:
            ${manifestoText}
        `;
        const extractionResult = await model.generateContent(extractionPrompt);
        let extractionText = extractionResult.response.text();
        
        // Clean up markdown code blocks if present
        if (extractionText.startsWith('```json')) {
            extractionText = extractionText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        }

        // Step 2: Map to user issues
        const mappingPrompt = `
            Based on these extracted policies:
            ${extractionText}

            Map these policies to the user's top issues: ${userIssues.join(', ')}
            Provide an impact score (1-10) for how well these policies address the user's issues.
            Return ONLY a valid JSON array of objects with the following structure, nothing else:
            [ { "category": "Issue Name", "title": "Policy Title", "description": "Brief description", "impact_score": 8 } ]
        `;
        const mappingResult = await model.generateContent(mappingPrompt);
        let mappingText = mappingResult.response.text();

        if (mappingText.startsWith('```json')) {
            mappingText = mappingText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        }

        return JSON.parse(mappingText);

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze manifesto using AI");
    }
};

export const compareCandidates = async (candidatesData: any[], userIssues: string[]): Promise<string> => {
    if (!model) {
        console.warn("GEMINI_API_KEY is not set. Returning mock comparison.");
        return "Based on your top issues, both candidates offer distinct approaches. Candidate A focuses more on infrastructure, while Candidate B emphasizes social safety nets.";
    }

    try {
        const comparisonPrompt = `
            Compare the following candidates based on the user's top issues: ${userIssues.join(', ')}
            
            Candidates Data:
            ${JSON.stringify(candidatesData, null, 2)}

            Provide a concise, neutral comparative summary (2-3 paragraphs) highlighting the key differences in their approaches to these issues.
            Focus on helping the user understand which candidate aligns better with their interests without showing bias.
        `;
        const result = await model.generateContent(comparisonPrompt);
        return result.response.text();

    } catch (error) {
        console.error("Gemini API Error (Comparison):", error);
        throw new Error("Failed to compare candidates using AI");
    }
};

const generateMockAnalysis = (issues: string[]) => {
    return issues.map(issue => ({
        category: issue,
        title: `Comprehensive ${issue} Reform`,
        description: `This candidate has a strong stance on ${issue}, proposing significant changes to improve outcomes and efficiency.`,
        impact_score: Math.floor(Math.random() * 5) + 5 // 5 to 9
    }));
};
