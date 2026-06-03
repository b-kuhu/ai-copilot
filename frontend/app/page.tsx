
"use client"

import ToolSelector from "@/src/components/ToolSelector";
import { ToolName } from "@/src/types/copilot";

export default function Home() {
  return <main>
    <ToolSelector selectedTool="chat" onChange={(tool:ToolName) => console.log("Selected tool:", tool)} />
  </main>;
}
