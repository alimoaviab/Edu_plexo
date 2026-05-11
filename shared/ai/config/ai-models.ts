/**
 * AI Model Configuration Registry
 * 
 * CRITICAL: This is the single source of truth for all AI models.
 * DO NOT hardcode model names anywhere else in the codebase.
 * 
 * Model Selection Criteria:
 * - Use ONLY stable, production-ready models
 * - Avoid experimental, preview, or deprecated models
 * - Prefer models with official API support and SLA guarantees
 */

export enum ModelCapability {
  TEXT_GENERATION = "text_generation",
  FUNCTION_CALLING = "function_calling",
  STREAMING = "streaming",
  VISION = "vision",
  LONG_CONTEXT = "long_context",
}

export enum ModelStability {
  STABLE = "stable",           // Production-ready, recommended
  PREVIEW = "preview",          // Beta, use with caution
  EXPERIMENTAL = "experimental", // Not for production
  DEPRECATED = "deprecated",    // Will be removed
}

export interface ModelMetadata {
  id: string;
  provider: "gemini" | "openai" | "grok";
  displayName: string;
  stability: ModelStability;
  capabilities: ModelCapability[];
  maxTokens: number;
  costPer1kTokens: number; // USD
  latencyMs: number; // Typical response time
  recommended: boolean;
  notes?: string;
}

/**
 * Gemini Models
 * Documentation: https://ai.google.dev/gemini-api/docs/models/gemini
 */
export const GEMINI_MODELS: Record<string, ModelMetadata> = {
  // PRIMARY: Fast, efficient, production-ready
  FLASH: {
    id: "gemini-2.0-flash-exp",
    provider: "gemini",
    displayName: "Gemini 2.0 Flash",
    stability: ModelStability.STABLE,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
      ModelCapability.VISION,
    ],
    maxTokens: 8192,
    costPer1kTokens: 0.0001,
    latencyMs: 500,
    recommended: true,
    notes: "Best for most use cases. Fast, cost-effective, reliable.",
  },

  // ADVANCED: More capable, higher quality
  PRO: {
    id: "gemini-2.0-flash-thinking-exp",
    provider: "gemini",
    displayName: "Gemini 2.0 Flash Thinking",
    stability: ModelStability.STABLE,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
      ModelCapability.LONG_CONTEXT,
    ],
    maxTokens: 32768,
    costPer1kTokens: 0.0005,
    latencyMs: 1200,
    recommended: true,
    notes: "For complex reasoning, analysis, and long-context tasks.",
  },
} as const;

/**
 * OpenAI Models
 * Documentation: https://platform.openai.com/docs/models
 */
export const OPENAI_MODELS: Record<string, ModelMetadata> = {
  GPT4O_MINI: {
    id: "gpt-4o-mini",
    provider: "openai",
    displayName: "GPT-4o Mini",
    stability: ModelStability.STABLE,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
      ModelCapability.VISION,
    ],
    maxTokens: 16384,
    costPer1kTokens: 0.00015,
    latencyMs: 800,
    recommended: true,
    notes: "Fast, affordable, high-quality. Good fallback option.",
  },

  GPT4O: {
    id: "gpt-4o",
    provider: "openai",
    displayName: "GPT-4o",
    stability: ModelStability.STABLE,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
      ModelCapability.VISION,
      ModelCapability.LONG_CONTEXT,
    ],
    maxTokens: 128000,
    costPer1kTokens: 0.005,
    latencyMs: 1500,
    recommended: false,
    notes: "Most capable but expensive. Use for critical tasks only.",
  },
} as const;

/**
 * Grok Models
 * Documentation: https://docs.x.ai/
 */
export const GROK_MODELS: Record<string, ModelMetadata> = {
  BETA: {
    id: "grok-beta",
    provider: "grok",
    displayName: "Grok Beta",
    stability: ModelStability.PREVIEW,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
    ],
    maxTokens: 8192,
    costPer1kTokens: 0.0002,
    latencyMs: 1000,
    recommended: false,
    notes: "Preview model. Use as fallback only.",
  },
} as const;

/**
 * All available models registry
 */
export const ALL_MODELS = {
  ...GEMINI_MODELS,
  ...OPENAI_MODELS,
  ...GROK_MODELS,
} as const;

/**
 * Get model metadata by ID
 */
export function getModelMetadata(modelId: string): ModelMetadata | null {
  return Object.values(ALL_MODELS).find((m) => m.id === modelId) || null;
}

/**
 * Validate if a model ID is supported
 */
export function isValidModel(modelId: string): boolean {
  return Object.values(ALL_MODELS).some((m) => m.id === modelId);
}

/**
 * Get recommended models by provider
 */
export function getRecommendedModels(provider: "gemini" | "openai" | "grok"): ModelMetadata[] {
  return Object.values(ALL_MODELS).filter(
    (m) => m.provider === provider && m.recommended && m.stability === ModelStability.STABLE
  );
}

/**
 * Validate model has required capabilities
 */
export function hasCapabilities(modelId: string, required: ModelCapability[]): boolean {
  const model = getModelMetadata(modelId);
  if (!model) return false;
  return required.every((cap) => model.capabilities.includes(cap));
}
