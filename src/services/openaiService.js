import OpenAI from 'openai';
import config from '../config/index.js';

// Create openAI client instance 
const openaiClient = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL:'https://api.groq.com/openai/v1'
});

export async function createChatCompletion(messages) {
  try {
    const response = await openaiClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });
    return response.choices[0].message.content;
  } catch (error) {
    // console.error('Error creating chat completion:', error);
    throw error;
  }
}