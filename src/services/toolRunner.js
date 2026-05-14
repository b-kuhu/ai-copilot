import analyzeJD from "../tools/jobDescriptionAnalyzer.js";

//map toolname to tool objects
const toolMap = {
    analyzeJD: analyzeJD,
}

export async function runTool(toolName, toolInput) {
    const tool = toolMap[toolName];
    if (!tool) {
        throw new Error(`Tool not found: ${toolName}`);
    }
    return await tool.execute(toolInput);
}   