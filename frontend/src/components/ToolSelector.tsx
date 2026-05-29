import { useState } from "react";
import { ToolName } from "../types/copilot";

const options: { label: string; value: ToolName }[] = [
  { label: "Chat", value: "chat" },
  { label: "Analyze Job Description", value: "analyzeJD" },
  { label: "Resume Tailor", value: "resumeTailor" },
]; 
const ToolSelector = (selectedTool:ToolName, onChange:(tool:ToolName) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<ToolName>(selectedTool);
  
  return <div> 
    <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 bg-blue-500 text-white rounded">
     {selected}
    </button>
    {isOpen && (
      <div className="absolute mt-2 bg-white border rounded shadow">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setSelected(option.value);
              onChange(option.value);
              setIsOpen(false);
            }}
            className="block px-4 py-2 hover:bg-gray-200"
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
}

export default ToolSelector;