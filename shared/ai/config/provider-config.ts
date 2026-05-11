/**
 * Provider Configuration
 * 
 * Centralized configuration for all AI providers.
 * Environment variables are validated and typed here.
 */

import { GEMINI_MODELS, OPENAI_MODELS, GROK_MODELS, ModelMetadata } from "./ai-models";

export interface ProviderCredentials {
  apiKey: string;
  baseURL?: string;
  apiVersion?: string;
}

export interface ProviderConfig {
  name: "gemini" | "openai" | "grok";
  enabled: boolean;
  credentials: ProviderCredentials | null;
  defaultModel: ModelMetadata;
  fallbackModel?: ModelMetadata;
  timeout: number; // milliseconds
  maxRetries: number;
  temperature: number;
}

/**
 * Load and validate environment variables
 */
function getEnvVar(key: string, required: boolean = false): string | undefined {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`❌ Required environment variable missing: ${key}`);
  }
  
  return value;
}

/**
 * Validate API key format
 */
function validateApiKey(key: string | undefined, provider: string): boolean {
  if (!key) return false;
  
  // Basic validation - keys should be non-empty strings
  if (key.length < 10) {
    console.warn(`⚠️  ${provider} API key seems too short. Please verify.`);
    return false;
  }
  
  return true;
}

/**
 * Get Gemini configuration
 */
export function getGeminiConfig(): ProviderConfig {
  const apiKey = getEnvVar("GEMINI_API_KEY");
  const enabled = validateApiKey(apiKey, "Gemini");
  
  // Allow custom model via env, but validate it exists
  const customModelId = getEnvVar("GEMINI_MODEL");
  let defaultModel = GEMINI_MODELS.FLASH;
  
  if (customModelId) {
    const customModel = Object.values(GEMINI_MODELS).find((m) => m.id === customModelId);
    if (customModel) {
      defaultModel = customModel;
      console.log(`✅ Using custom Gemini model: ${customModelId}`);
    } else {
      console.warn(`⚠️  Custom GEMINI_MODEL "${customModelId}" not found. Using default: ${defaultModel.id}`);
    }
  }
  
  return {
    name: "gemini",
    enabled,
    credentials: enabled
      ? {
          apiKey: apiKey!,
          apiVersion: "v1beta",
        }
      : null,
    defaultModel,
    fallbackModel: GEMINI_MODELS.PRO,
    timeout: 30000, // 30 seconds
    maxRetries: 2,
    temperature: 0.1,
  };
}

/**
 * Get OpenAI configuration
 */
export function getOpenAIConfig(): ProviderConfig {
  const apiKey = getEnvVar("OPENAI_API_KEY");
  const enabled = validateApiKey(apiKey, "OpenAI");
  
  const customModelId = getEnvVar("OPENAI_MODEL");
  let defaultModel = OPENAI_MODELS.GPT4O_MINI;
  
  if (customModelId) {
    const customModel = Object.values(OPENAI_MODELS).find((m) => m.id === customModelId);
    if (customModel) {
      defaultModel = customModel;
      console.log(`✅ Using custom OpenAI model: ${customModelId}`);
    } else {
      console.warn(`⚠️  Custom OPENAI_MODEL "${customModelId}" not found. Using default: ${defaultModel.id}`);
    }
  }
  
  return {
    name: "openai",
    enabled,
    credentials: enabled
      ? {
          apiKey: apiKey!,
        }
      : null,
    defaultModel,
    fallbackModel: OPENAI_MODELS.GPT4O,
    timeout: 30000,
    maxRetries: 2,
    temperature: 0.2,
  };
}

/**
 * Get Grok configuration
 */
export function getGrokConfig(): ProviderConfig {
  const apiKey = getEnvVar("GROK_API_KEY");
  const enabled = validateApiKey(apiKey, "Grok");
  
  return {
    name: "grok",
    enabled,
    credentials: enabled
      ? {
          apiKey: apiKey!,
          baseURL: "https://api.x.ai/v1",
        }
      : null,
    defaultModel: GROK_MODELS.BETA,
    timeout: 30000,
    maxRetries: 2,
    temperature: 0.2,
  };
}

/**
 * Get all provider configurations
 */
export function getAllProviderConfigs(): ProviderConfig[] {
  return [getGeminiConfig(), getOpenAIConfig(), getGrokConfig()];
}

/**
 * Get enabled provider configurations
 */
export function getEnabledProviderConfigs(): ProviderConfig[] {
  return getAllProviderConfigs().filter((config) => config.enabled);
}

/**
 * Validate at least one provider is configured
 */
export function validateProvidersAvailable(): void {
  const enabled = getEnabledProviderConfigs();
  
  if (enabled.length === 0) {
    throw new Error(
      "❌ No AI providers configured! Please set at least one API key:\n" +
        "  - GEMINI_API_KEY\n" +
        "  - OPENAI_API_KEY\n" +
        "  - GROK_API_KEY"
    );
  }
  
  console.log(`✅ ${enabled.length} AI provider(s) configured: ${enabled.map((p) => p.name).join(", ")}`);
}
