import analyzeJD from "../tools/jobDescriptionAnalyzer.js";
import resumeTailor from "../tools/resumeTailor.js";

//map toolname to tool objects
const toolMap = {
    analyzeJD: analyzeJD,
    resumeTailor: resumeTailor
}

export async function runTool(toolName, toolInput) {
    const tool = toolMap[toolName];
    if (!tool) {
        throw new Error(`Tool not found: ${toolName}`);
    }
    return await tool.execute(toolInput);
}   