// validate input and throw error if invalid
export function validateRequest(req, res, next) {
  const { messages, toolName, toolInput } = req.body;
  if ((!messages || !Array.isArray(messages)) && !toolName) {
    return res.status(400).json({ error: 'Invalid input: messages must be an array' });
  }
  
  if(!toolName && toolInput) {
    return res.status(400).json({ error: 'Invalid input: toolInput provided without toolName' });
  }

  if(toolName && !toolInput) {
    return res.status(400).json({ error: 'Invalid input: toolName provided without toolInput' });
  }

  if (toolName === "analyzeJD" && !toolInput.jobDescription) {
    return res.status(400).json({ error: "jobDescription is required" });
  }

  if (
    toolName === "resumeTailor" &&
    (!toolInput.resumeText || !toolInput.jobDescription)
  ) {
    return res.status(400).json({
      error: "resumeText and jobDescription are required"
    });
  }
  next();

}