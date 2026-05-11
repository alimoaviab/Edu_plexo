import { ProviderManager } from "../providers/provider-manager";
import { aiTools } from "../tools/registry";
import { studentAnalysisPrompt } from "../skills/student-analysis";

import { systemPrompt } from "../skills/system-prompt";

const providerManager = new ProviderManager();

export async function supervisorNode(state: any, config: any) {
  const complexity = state.complexity || "moderate";
  const modelWithTools = await providerManager.getModelWithFallback(complexity, aiTools);

  const messages = [...state.messages];

  // ✅ Add personalization context to system prompt
  let personalization = "";
  if (state.schoolName || state.userName) {
    personalization = "\n==================================================\nUSER CONTEXT\n============\n";
    if (state.schoolName) personalization += `School: ${state.schoolName}\n`;
    if (state.userName) personalization += `User: ${state.userName} (${state.userRole || "Staff"})\n`;
    personalization += "==================================================\n";
  }

  const systemMessage = {
    role: "system",
    content: `${systemPrompt}
${personalization}
Specialized Skills Active:
${studentAnalysisPrompt}
`
  };

  const response = await modelWithTools.invoke([systemMessage, ...messages], config);

  return { messages: [response] };
}
