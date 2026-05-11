/**
 * Supervisor Agent Node
 * 
 * Main orchestration node for the AI agent system.
 * Handles model selection, tool binding, and response generation.
 */

import { providerManager } from "../providers/provider-manager";
import { aiTools } from "../tools/registry";
import { studentAnalysisPrompt } from "../skills/student-analysis";
import { systemPrompt } from "../skills/system-prompt";

export async function supervisorNode(state: any, config: any) {
  console.log("🧠 Supervisor Node: Processing request");
  
  // Determine task complexity
  const complexity = state.complexity || "moderate";
  console.log(`   Complexity: ${complexity}`);
  
  try {
    // Get model with intelligent fallback
    const modelWithTools = await providerManager.getModelWithFallback(complexity, aiTools);
    
    // Prepare messages
    const messages = [...state.messages];
    
    const systemMessage = {
      role: "system",
      content: `${systemPrompt}

Specialized Skills Active:
${studentAnalysisPrompt}
`
    };
    
    console.log("📤 Invoking AI model...");
    
    // Invoke model
    const response = await modelWithTools.invoke([systemMessage, ...messages], config);
    
    console.log("✅ Supervisor Node: Response received");
    
    return { messages: [response] };
  } catch (error) {
    console.error("❌ Supervisor Node: Error", error);
    throw error;
  }
}
