export type ToolName = "chat" | "analyzeJD" | "resumeTailor";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AnalyzeJDInput = {
  jobDescription: string;
};

export type ResumeTailorInput = {
  resumeText: string;
  jobDescription: string;
};

export type AnalyzeJDResponse = {
  skills?: string[];
  opportunities?: string[];
  fitSummary?: string;
};

export type ResumeTailorResponse = {
  summary?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
  suggestedBullets?: string[];
  tailoredResume?: string;
};

