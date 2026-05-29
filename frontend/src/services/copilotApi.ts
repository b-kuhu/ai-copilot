import { Chat } from "openai/resources.mjs";
import { ChatMessage } from "../types/copilot";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// normal chat 
export async function sendChatMessage(messages: ChatMessage[]) {
    try {
        const res = await fetch(`${API_BASE_URL}/chat`,{
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body: JSON.stringify({ messages }),
      })
    
      if(!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      } 
      return await res.json();
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
}

// via tools 
export async function runTool(toolName: "analyzeJD" | "resumeTailor", toolInput: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/chat`,{
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body: JSON.stringify({ toolName, toolInput }),
      })
      if(!res.ok){
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (error) {
        console.error("Error running tool:", error);
        throw error;
    }
}
        