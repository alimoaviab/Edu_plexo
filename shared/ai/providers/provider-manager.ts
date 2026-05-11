/**
 * AI Provider Manager
 * 
 * Enterprise-grade AI provider orchestration system.
 * 
 * Features:
 * - Centralized provider management
 * - Intelligent fallback routing
 * - Health checking
 * - Request tracing
 * - Structured logging
 * - Type-safe configuration
 * - Zero hardcoded values
 * 
 * Architecture:
 * - Single source of truth for all providers
 * - Explicit configuration over magic behavior
 * - Observable and debuggable
 * - Production-safe error handling
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  getGeminiConfig,
  getOpenAIConfig,
  getGrokConfig,
  ProviderConfig,
} from "../config/provider-config";
import { validateOrThrow, getEnvironmentSnapshot } from "../config/validation";
import { ModelCapability, hasCapabilities } from "../config/ai-models";

/**
 * Task complexity levels
 */
export type TaskComplexity = "simple" | "moderate" | "complex";

/**
 * Provider selection strategy
 */
export interface ProviderSelectionStrategy {
  complexity: TaskComplexity;
  requiresStreaming: boolean;
  requiresFunctionCalling: boolean;
  preferredProvider?: "gemini" | "openai" | "grok";
}

/**
 * Provider selection result
 */
export interface ProviderSelection {
  provider: "gemini" | "openai" | "grok";
  model: string;
  reason: string;
  fallbacks: Array<{ provider: string; model: string }>;
}

/**
 * Provider Manager
 * 
 * Manages all AI providers and handles intelligent routing.
 */
export class ProviderManager {
  private providers: Map<string, BaseChatModel> = new Map();
  private configs: Map<string, ProviderConfig> = new Map();
  private initialized: boolean = false;
  private initializationError: Error | null = null;

  constructor() {
    // Initialization happens lazily on first use
    // This allows the class to be imported without side effects
  }

  /**
   * Initialize all providers
   * 
   * This is called automatically on first use, but can be called
   * explicitly for eager initialization and validation.
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("🚀 Initializing AI Provider Manager...");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Validate configuration
      validateOrThrow();

      // Log environment snapshot
      const snapshot = getEnvironmentSnapshot();
      console.log("📊 Environment Snapshot:", JSON.stringify(snapshot, null, 2));

      // Initialize each provider
      await this.initializeGemini();
      await this.initializeOpenAI();
      await this.initializeGrok();

      // Verify at least one provider is available
      if (this.providers.size === 0) {
        throw new Error("No AI providers initialized. Check API keys and configuration.");
      }

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`✅ Provider Manager initialized with ${this.providers.size} provider(s)`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      this.initialized = true;
    } catch (error) {
      this.initializationError = error as Error;
      console.error("❌ Provider Manager initialization failed:", error);
      throw error;
    }
  }

  /**
   * Initialize Gemini provider
   */
  private async initializeGemini(): Promise<void> {
    const config = getGeminiConfig();
    this.configs.set("gemini", config);

    if (!config.enabled) {
      console.log("⏭️  Gemini: Skipped (no API key)");
      return;
    }

    try {
      console.log("🔧 Initializing Gemini provider...");
      console.log(`   Model: ${config.defaultModel.id}`);
      console.log(`   Display Name: ${config.defaultModel.displayName}`);
      console.log(`   Stability: ${config.defaultModel.stability}`);
      console.log(`   Capabilities: ${config.defaultModel.capabilities.join(", ")}`);

      const model = new ChatGoogleGenerativeAI({
        model: config.defaultModel.id,
        temperature: config.temperature,
        maxRetries: config.maxRetries,
        apiKey: config.credentials!.apiKey,
        apiVersion: config.credentials!.apiVersion,
        timeout: config.timeout,
      });

      this.providers.set("gemini", model);
      console.log("✅ Gemini provider initialized successfully");
    } catch (error) {
      console.error("❌ Gemini initialization failed:", error);
      throw error;
    }
  }

  /**
   * Initialize OpenAI provider
   */
  private async initializeOpenAI(): Promise<void> {
    const config = getOpenAIConfig();
    this.configs.set("openai", config);

    if (!config.enabled) {
      console.log("⏭️  OpenAI: Skipped (no API key)");
      return;
    }

    try {
      console.log("🔧 Initializing OpenAI provider...");
      console.log(`   Model: ${config.defaultModel.id}`);
      console.log(`   Display Name: ${config.defaultModel.displayName}`);
      console.log(`   Stability: ${config.defaultModel.stability}`);

      const model = new ChatOpenAI({
        modelName: config.defaultModel.id,
        temperature: config.temperature,
        maxRetries: config.maxRetries,
        openAIApiKey: config.credentials!.apiKey,
        timeout: config.timeout,
      });

      this.providers.set("openai", model);
      console.log("✅ OpenAI provider initialized successfully");
    } catch (error) {
      console.error("❌ OpenAI initialization failed:", error);
      throw error;
    }
  }

  /**
   * Initialize Grok provider
   */
  private async initializeGrok(): Promise<void> {
    const config = getGrokConfig();
    this.configs.set("grok", config);

    if (!config.enabled) {
      console.log("⏭️  Grok: Skipped (no API key)");
      return;
    }

    try {
      console.log("🔧 Initializing Grok provider...");
      console.log(`   Model: ${config.defaultModel.id}`);
      console.log(`   Display Name: ${config.defaultModel.displayName}`);

      const model = new ChatOpenAI({
        modelName: config.defaultModel.id,
        temperature: config.temperature,
        maxRetries: config.maxRetries,
        configuration: {
          baseURL: config.credentials!.baseURL,
        },
        openAIApiKey: config.credentials!.apiKey,
        timeout: config.timeout,
      });

      this.providers.set("grok", model);
      console.log("✅ Grok provider initialized successfully");
    } catch (error) {
      console.error("❌ Grok initialization failed:", error);
      throw error;
    }
  }

  /**
   * Select best provider based on strategy
   */
  private selectProvider(strategy: ProviderSelectionStrategy): ProviderSelection {
    console.log("🎯 Selecting provider...");
    console.log(`   Complexity: ${strategy.complexity}`);
    console.log(`   Streaming: ${strategy.requiresStreaming}`);
    console.log(`   Function Calling: ${strategy.requiresFunctionCalling}`);

    // Define provider preferences based on complexity
    let preferences: Array<"gemini" | "openai" | "grok"> = [];

    if (strategy.preferredProvider) {
      preferences = [strategy.preferredProvider];
    } else if (strategy.complexity === "simple") {
      // Simple tasks: prefer fast, cheap models
      preferences = ["gemini", "openai", "grok"];
    } else if (strategy.complexity === "complex") {
      // Complex tasks: prefer capable models
      preferences = ["openai", "gemini", "grok"];
    } else {
      // Moderate tasks: balanced approach
      preferences = ["gemini", "openai", "grok"];
    }

    // Filter to available providers
    const available = preferences.filter((p) => this.providers.has(p));

    if (available.length === 0) {
      throw new Error("No AI providers available");
    }

    const selected = available[0];
    const config = this.configs.get(selected)!;
    const fallbacks = available.slice(1).map((p) => ({
      provider: p,
      model: this.configs.get(p)!.defaultModel.id,
    }));

    const selection: ProviderSelection = {
      provider: selected,
      model: config.defaultModel.id,
      reason: `Selected ${selected} for ${strategy.complexity} complexity task`,
      fallbacks,
    };

    console.log("✅ Provider selected:", JSON.stringify(selection, null, 2));

    return selection;
  }

  /**
   * Get model with intelligent fallback
   * 
   * This is the main entry point for getting an AI model.
   * It handles provider selection, fallback configuration, and tool binding.
   */
  public async getModelWithFallback(
    complexity: TaskComplexity = "moderate",
    tools?: any[]
  ): Promise<BaseChatModel> {
    // Ensure initialization
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.initializationError) {
      throw this.initializationError;
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🤖 Getting AI model...");

    // Select provider
    const strategy: ProviderSelectionStrategy = {
      complexity,
      requiresStreaming: true,
      requiresFunctionCalling: !!tools && tools.length > 0,
    };

    const selection = this.selectProvider(strategy);

    // Get primary model
    let model = this.providers.get(selection.provider)!;

    // Bind tools if provided
    if (tools && tools.length > 0) {
      console.log(`🔧 Binding ${tools.length} tool(s) to model`);
      model = model.bindTools(tools) as BaseChatModel;
    }

    // Configure fallbacks
    if (selection.fallbacks.length > 0) {
      console.log(`🔄 Configuring ${selection.fallbacks.length} fallback(s)`);
      const fallbackModels = selection.fallbacks
        .map((f) => this.providers.get(f.provider))
        .filter((m): m is BaseChatModel => m !== undefined);

      if (fallbackModels.length > 0) {
        // Bind tools to fallback models too
        const fallbacksWithTools = tools
          ? fallbackModels.map((m) => m.bindTools(tools) as BaseChatModel)
          : fallbackModels;

        model = model.withFallbacks({ fallbacks: fallbacksWithTools }) as BaseChatModel;
        console.log("✅ Fallbacks configured");
      }
    }

    console.log("✅ Model ready");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return model;
  }

  /**
   * Get provider health status
   */
  public getHealthStatus(): Record<string, any> {
    return {
      initialized: this.initialized,
      error: this.initializationError?.message,
      providers: Array.from(this.providers.keys()),
      configs: Array.from(this.configs.entries()).map(([name, config]) => ({
        name,
        enabled: config.enabled,
        model: config.defaultModel.id,
      })),
    };
  }

  /**
   * Force re-initialization
   * Useful for testing or after configuration changes
   */
  public async reinitialize(): Promise<void> {
    console.log("🔄 Reinitializing Provider Manager...");
    this.initialized = false;
    this.initializationError = null;
    this.providers.clear();
    this.configs.clear();
    await this.initialize();
  }
}

// Export singleton instance
export const providerManager = new ProviderManager();
