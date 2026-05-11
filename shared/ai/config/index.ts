/**
 * AI Configuration Module
 * 
 * Central exports for all AI configuration.
 * Import from here for clean, organized code.
 */

// Model Registry
export {
  GEMINI_MODELS,
  OPENAI_MODELS,
  GROK_MODELS,
  ALL_MODELS,
  ModelCapability,
  ModelStability,
  getModelMetadata,
  isValidModel,
  getRecommendedModels,
  hasCapabilities,
  type ModelMetadata,
} from "./ai-models";

// Provider Configuration
export {
  getGeminiConfig,
  getOpenAIConfig,
  getGrokConfig,
  getAllProviderConfigs,
  getEnabledProviderConfigs,
  validateProvidersAvailable,
  type ProviderConfig,
  type ProviderCredentials,
} from "./provider-config";

// Validation
export {
  validateEnvironment,
  validateModelConfig,
  validateAISystem,
  validateOrThrow,
  getEnvironmentSnapshot,
  type ValidationResult,
} from "./validation";
