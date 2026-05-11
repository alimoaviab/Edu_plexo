#!/usr/bin/env ts-node
/**
 * Environment Validation Script
 * 
 * Validates AI system configuration before deployment.
 * Run this before starting the application to catch configuration errors early.
 * 
 * Usage:
 *   ts-node shared/ai/scripts/validate-env.ts
 *   npm run validate:ai
 */

import { validateAISystem, getEnvironmentSnapshot } from "../config/validation";
import { getAllProviderConfigs } from "../config/provider-config";
import { ALL_MODELS } from "../config/ai-models";

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║                                                                      ║");
console.log("║              AI SYSTEM ENVIRONMENT VALIDATION                        ║");
console.log("║                                                                      ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝");
console.log("");

// Run validation
const result = validateAISystem();

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📊 CONFIGURATION SUMMARY");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Show environment snapshot
const snapshot = getEnvironmentSnapshot();
console.log(JSON.stringify(snapshot, null, 2));

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🤖 AVAILABLE MODELS");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

Object.entries(ALL_MODELS).forEach(([key, model]) => {
  const status = model.recommended ? "✅" : "⚠️ ";
  console.log(`${status} ${model.displayName} (${model.id})`);
  console.log(`   Provider: ${model.provider}`);
  console.log(`   Stability: ${model.stability}`);
  console.log(`   Max Tokens: ${model.maxTokens}`);
  console.log("");
});

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📋 VALIDATION RESULT");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (result.valid) {
  console.log("✅ VALIDATION PASSED");
  console.log("");
  console.log("Your AI system is properly configured and ready to use.");
  process.exit(0);
} else {
  console.log("❌ VALIDATION FAILED");
  console.log("");
  console.log("Errors:");
  result.errors.forEach((err) => console.log(`  ❌ ${err}`));
  console.log("");
  console.log("Please fix the errors above before starting the application.");
  process.exit(1);
}
