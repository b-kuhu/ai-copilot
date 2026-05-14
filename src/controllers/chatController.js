import { processRequest  } from "../services/copilotService.js";

export async function handleChat(req, res) {
  const { messages, toolName, toolInput } = req.body;
  try {
    const response = await processRequest(messages,toolName, toolInput);
    res.json({ response });
  } catch (error) {
    console.log('Error handling chat request:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
}