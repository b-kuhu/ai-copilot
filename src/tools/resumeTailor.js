import { createChatCompletion } from "../services/openaiService.js";

export default {
    name: 'resumeTailor',
    description: 'Tailors a resume to better fit a specific job description',
    async execute( { resumeText, jobDescription }) {
        // build OpenAI prompt
        const prompt = `Given the following resume and job description, tailor the resume to better fit the job. Focus on highlighting relevant skills, experience, and achievements that match the job requirements. Return only the tailored resume text in structured json format.
        {
        "summary": "...",
        "matchedSkills": [],
        "missingSkills": [],
        "suggestedBullets": [],
        "tailoredResume": "..."
        }
        \n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`;  

        try {
            const response = await createChatCompletion([{ role: 'user', content: prompt }]);

            const cleaned = response
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            const data = JSON.parse(cleaned);
            return data;
        } catch (error) {
            console.error('Error occurred while tailoring resume:', error);
            throw error
        }

    }    
}