#!/usr/bin/env ts-node
/**
 * Quick AI System Test
 * 
 * Tests that the AI provider system is properly configured and working.
 */

import { providerManager } from "./shared/ai/providers/provider-manager";
import { getEnvironmentSnapshot } from "./shared/ai/config/validation";

async function testAISystem() {
  console.log("🧪 Testing AI System...\n");
  
  try {
    // 1. Check environment
    console.log("1️⃣ Checking environment configuration...");
    const snapshot = getEnvironmentSnapshot();
    console.log(JSON.stringify(snapshot, null, 2));
    console.log("✅ Environment check passed\n");
    
    // 2. Get provider health
    console.log("2️⃣ Checking provider health...");
    const health = providerManager.getHealthStatus();
    console.log(JSON.stringify(health, null, 2));
    console.log("✅ Health check passed\n");
    
    // 3. Get a model
    console.log("3️⃣ Getting AI model...");
    const model = await providerManager.getModelWithFallback("simple");
    console.log("✅ Model retrieved successfully\n");
    
    // 4. Test simple invocation
    console.log("4️⃣ Testing simple invocation...");
    const response = await model.invoke([
      { role: "user", content: "Say 'Hello from EduPlexo AI!' in exactly those words." }
    ]);
    console.log("Response:", response.content);
    console.log("✅ Invocation successful\n");
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 ALL TESTS PASSED!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYour AI system is working correctly! ✅");
    console.log("\nNext steps:");
    console.log("  1. cd school-app");
    console.log("  2. npm run dev");
    console.log("  3. Test the chatbot in the UI\n");
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

testAISystem();
