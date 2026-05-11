/**
 * Runtime Validation System
 * 
 * Validates AI system configuration at startup and runtime.
 * Fails fast with clear error messages if configuration is invalid.
 */

import {
  getAllProviderConfigs,
  getEnabledProviderConfigs,
  validateProvidersAvailable,
} from "./provider-config";
import { isValidModel, getModelMetadata, ModelStability } from "./ai-models";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check Node environment
  if (!process.env.NODE_ENV) {
    warnings.push("NODE_ENV not set. Defaulting to development.");
  }
  
  // Validate provider configs
  const allConfigs = getAllProviderConfigs();
  const enabledConfigs = getEnabledProviderConfigs();
  
  if (enabledConfigs.length === 0) {
    errors.push("No AI providers configured. Set at least one API key.");
  }
  
  // Validate each enabled provider
  for (const config of enabledConfigs) {
    // Validate API key
    if (!config.credentials?.apiKey) {
      errors.push(`${config.name}: API key is missing or invalid`);
    }
    
    // Validate default model
    if (!isValidModel(config.defaultModel.id)) {
      errors.push(`${config.name}: Default model "${config.defaultModel.id}" is not recognized`);
    }
    
    // Check for deprecated models
    const modelMeta = getModelMetadata(config.defaultModel.id);
    if (modelMeta?.stability === ModelStability.DEPRECATED) {
      errors.push(`${config.name}: Model "${config.defaultModel.id}" is deprecated`);
    }
    
    // Warn about experimental models
    if (modelMeta?.stability === ModelStability.EXPERIMENTAL) {
      warnings.push(`${config.name}: Model "${config.defaultModel.id}" is experimental`);
    }
    
    // Validate fallback model if present
    if (config.fallbackModel && !isValidModel(config.fallbackModel.id)) {
      errors.push(`${config.name}: Fallback model "${config.fallbackModel.id}" is not recognized`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate model configuration
 */
export function validateModelConfig(modelId: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!isValidModel(modelId)) {
    errors.push(`Model "${modelId}" is not in the registry`);
    return { valid: false, errors, warnings };
  }
  
  const model = getModelMetadata(modelId);
  if (!model) {
    errors.push(`Model "${modelId}" metadata not found`);
    return { valid: false, errors, warnings };
  }
  
  // Check stability
  if (model.stability === ModelStability.DEPRECATED) {
    errors.push(`Model "${modelId}" is deprecated and should not be used`);
  }
  
  if (model.stability === ModelStability.EXPERIMENTAL) {
    warnings.push(`Model "${modelId}" is experimental. Use with caution.`);
  }
  
  if (model.stability === ModelStability.PREVIEW) {
    warnings.push(`Model "${modelId}" is in preview. May have breaking changes.`);
  }
  
  // Check if recommended
  if (!model.recommended) {
    warnings.push(`Model "${modelId}" is not recommended for production use`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Run full system validation
 */
export function validateAISystem(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log("🔍 Validating AI system configuration...");
  
  // Validate environment
  const envResult = validateEnvironment();
  errors.push(...envResult.errors);
  warnings.push(...envResult.warnings);
  
  // Validate each enabled provider's models
  const enabledConfigs = getEnabledProviderConfigs();
  for (const config of enabledConfigs) {
    const modelResult = validateModelConfig(config.defaultModel.id);
    errors.push(...modelResult.errors.map((e) => `${config.name}: ${e}`));
    warnings.push(...modelResult.warnings.map((w) => `${config.name}: ${w}`));
    
    if (config.fallbackModel) {
      const fallbackResult = validateModelConfig(config.fallbackModel.id);
      errors.push(...fallbackResult.errors.map((e) => `${config.name} fallback: ${e}`));
      warnings.push(...fallbackResult.warnings.map((w) => `${config.name} fallback: ${w}`));
    }
  }
  
  // Print results
  if (errors.length > 0) {
    console.error("❌ AI System Validation FAILED:");
    errors.forEach((err) => console.error(`   - ${err}`));
  }
  
  if (warnings.length > 0) {
    console.warn("⚠️  AI System Validation Warnings:");
    warnings.forEach((warn) => console.warn(`   - ${warn}`));
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ AI system validation passed");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Fail-fast validation on startup
 * Throws error if configuration is invalid
 */
export function validateOrThrow(): void {
  const result = validateAISystem();
  
  if (!result.valid) {
    throw new Error(
      `AI System Configuration Invalid:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}

/**
 * Generate environment snapshot for debugging
 */
export function getEnvironmentSnapshot(): Record<string, any> {
  const configs = getAllProviderConfigs();
  
  return {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    providers: configs.map((config) => ({
      name: config.name,
      enabled: config.enabled,
      hasApiKey: !!config.credentials?.apiKey,
      defaultModel: config.defaultModel.id,
      fallbackModel: config.fallbackModel?.id,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
    })),
    enabledCount: configs.filter((c) => c.enabled).length,
  };
}
