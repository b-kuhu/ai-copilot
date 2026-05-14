import { createChatCompletion } from "./openaiService.js";
import { runTool } from "../services/toolRunner.js";

export async function processRequest (messages, toolName, toolInput) {
  if (toolName) {
    return await runTool(toolName, toolInput);
  }
  else {
    return await createChatCompletion(messages);
  }
}