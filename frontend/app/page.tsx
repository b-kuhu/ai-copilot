
"use client"

import Login from "@/src/components/Login";
// import ToolSelector from "@/src/components/ToolSelector";
// import { ToolName } from "@/src/types/copilot";
import Link from "next/link";

export default function Home() {
  return <main>
    {/* <ToolSelector selectedTool="chat" onChange={(tool:ToolName) => console.log("Selected tool:", tool)} /> */}
    <Login/>
  </main>;
}
