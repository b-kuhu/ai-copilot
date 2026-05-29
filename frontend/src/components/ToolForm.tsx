import { ToolName } from "../types/copilot";

interface ToolSelectorProps {
   selectedTool: ToolName;
   chatInput: string;
   jobDescription: string;
   resumeText: string;
   onChatInputChange: (value: string) => void;
   onJobDescriptionChange: (value: string) => void;
   onResumeTextChange: (value: string) => void;
}
const ToolSelector = ({ selectedTool, chatInput, jobDescription, resumeText, onChatInputChange, onJobDescriptionChange, onResumeTextChange }: ToolSelectorProps) => {
   if(selectedTool === "chat") {
    return <input type="textarea" value={chatInput} onChange={(e) => onChatInputChange(e.target.value)} placeholder="Type your message..." />;
   }
   if(selectedTool === "analyzeJD") {
    return <input type="textarea" value={jobDescription} onChange={(e) => onJobDescriptionChange(e.target.value)} placeholder="Enter job description..." />;
   }
   if(selectedTool === "resumeTailor") {
    return <input type="textarea" value={resumeText} onChange={(e) => onResumeTextChange(e.target.value)} placeholder="Enter resume text..." />;
   }
}

export default ToolSelector;