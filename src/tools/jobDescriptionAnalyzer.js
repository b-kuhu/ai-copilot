import { createChatCompletion } from "../services/openaiService.js";

export default {
  name: 'analyzeJD',
  description: 'Analyzes job descriptions',
  async execute({ jobDescription }) {
    // build OpenAI prompt
    const prompt = `Analyze the following job description and extract key information such as required skills, experience, and responsibilities:\n\n${jobDescription}\n\n Return only valid JSON with keys: skills (array), opportunities (array), fitSummary (string).`;
    
    try {
        // call createChatCompletion, passing the prompt as messages
        const response = await createChatCompletion([{ role: 'user', content: prompt }]);
    
        // get text content from model response
        console.log('Raw model response:', response);
        const cleaned = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        // parse and return structured JSON
        const data = JSON.parse(cleaned);
        return data;
        
    } catch (error) {
        console.error('Error analyzing job description:', error);
        throw new Error('Failed to analyze job description');
    }
  }
};