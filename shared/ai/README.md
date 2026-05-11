# AI Provider Infrastructure

Enterprise-grade AI provider orchestration system for the EduPlexo platform.

## 🏗️ Architecture

```
shared/ai/
├── config/
│   ├── ai-models.ts          # Model registry (single source of truth)
│   ├── provider-config.ts    # Provider configuration
│   └── validation.ts         # Runtime validation
├── providers/
│   └── provider-manager.ts   # Provider orchestration
├── agents/
│   └── supervisor.ts         # Main agent node
├── core/
│   ├── graph.ts             # LangGraph workflow
│   └── state.ts             # Agent state
├── tools/
│   └── registry.ts          # Tool definitions
├── skills/
│   ├── system-prompt.ts     # System prompts
│   └── student-analysis.ts  # Specialized skills
└── scripts/
    └── validate-env.ts      # Environment validation
```

## 🎯 Design Principles

### 1. **Zero Hardcoded Values**
- All models defined in `ai-models.ts`
- All configuration in `provider-config.ts`
- Environment variables validated at runtime

### 2. **Explicit Over Implicit**
- No magic behavior
- Clear provider selection logic
- Observable decision-making

### 3. **Fail Fast**
- Validate configuration on startup
- Clear error messages
- No silent failures

### 4. **Production-Safe**
- Only stable models by default
- Intelligent fallback routing
- Comprehensive logging

### 5. **Observable**
- Structured logging
- Request tracing
- Health monitoring

## 🚀 Quick Start

### 1. Configure Environment

```bash
# school-app/.env.local
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional, uses default if not set

OPENAI_API_KEY=your_key_here       # Optional
OPENAI_MODEL=gpt-4o-mini           # Optional

GROK_API_KEY=your_key_here         # Optional
```

### 2. Validate Configuration

```bash
# Run validation
./verify-ai-system.sh

# Or manually
cd school-app
ts-node ../shared/ai/scripts/validate-env.ts
```

### 3. Start Application

```bash
cd school-app
npm run dev
```

Watch for initialization logs:
```
🚀 Initializing AI Provider Manager...
✅ Gemini provider initialized successfully
✅ Provider Manager initialized with 1 provider(s)
```

## 📚 Usage

### Basic Usage

```typescript
import { providerManager } from "@edu/shared/ai/providers/provider-manager";

// Get model with automatic fallback
const model = await providerManager.getModelWithFallback("moderate");

// Use the model
const response = await model.invoke([{ role: "user", content: "Hello" }]);
```

### With Tools

```typescript
import { providerManager } from "@edu/shared/ai/providers/provider-manager";
import { aiTools } from "@edu/shared/ai/tools/registry";

// Get model with tools bound
const model = await providerManager.getModelWithFallback("moderate", aiTools);

// Model now has function calling capabilities
const response = await model.invoke([{ role: "user", content: "Analyze student data" }]);
```

### Complexity Levels

```typescript
// Simple tasks: Fast, cheap models
const simpleModel = await providerManager.getModelWithFallback("simple");

// Moderate tasks: Balanced approach (default)
const moderateModel = await providerManager.getModelWithFallback("moderate");

// Complex tasks: Most capable models
const complexModel = await providerManager.getModelWithFallback("complex");
```

## 🔧 Configuration

### Model Registry

All models are defined in `config/ai-models.ts`:

```typescript
export const GEMINI_MODELS = {
  FLASH: {
    id: "gemini-2.0-flash-exp",
    provider: "gemini",
    displayName: "Gemini 2.0 Flash",
    stability: ModelStability.STABLE,
    capabilities: [/* ... */],
    maxTokens: 8192,
    recommended: true,
  },
  // ...
};
```

### Provider Configuration

Providers are configured in `config/provider-config.ts`:

```typescript
export function getGeminiConfig(): ProviderConfig {
  return {
    name: "gemini",
    enabled: validateApiKey(process.env.GEMINI_API_KEY),
    credentials: { /* ... */ },
    defaultModel: GEMINI_MODELS.FLASH,
    fallbackModel: GEMINI_MODELS.PRO,
    timeout: 30000,
    maxRetries: 2,
    temperature: 0.1,
  };
}
```

### Adding a New Model

1. Add to `config/ai-models.ts`:
```typescript
export const GEMINI_MODELS = {
  // ...
  NEW_MODEL: {
    id: "gemini-3.0-ultra",
    provider: "gemini",
    displayName: "Gemini 3.0 Ultra",
    stability: ModelStability.STABLE,
    capabilities: [/* ... */],
    maxTokens: 32768,
    recommended: true,
  },
};
```

2. Update provider config if needed:
```typescript
defaultModel: GEMINI_MODELS.NEW_MODEL,
```

3. Validate:
```bash
./verify-ai-system.sh
```

### Adding a New Provider

1. Add model definitions to `config/ai-models.ts`
2. Add provider config function to `config/provider-config.ts`
3. Add initialization method to `providers/provider-manager.ts`
4. Update validation in `config/validation.ts`

## 🐛 Debugging

### Enable Verbose Logging

The system already includes comprehensive logging. Watch for:

```
🚀 Initializing AI Provider Manager...
🔧 Initializing Gemini provider...
   Model: gemini-2.0-flash-exp
   Display Name: Gemini 2.0 Flash
   Stability: stable
✅ Gemini provider initialized successfully
```

### Check Provider Health

```typescript
const health = providerManager.getHealthStatus();
console.log(health);
```

### Validate Environment

```bash
./verify-ai-system.sh
```

### Common Issues

#### Issue: "No AI providers available"
**Solution:** Set at least one API key in `.env.local`

#### Issue: "Model not found" 404 error
**Solution:** 
1. Check model name in `.env.local`
2. Verify model exists in `ai-models.ts`
3. Clean caches: `./clean-and-rebuild.sh`

#### Issue: Stale configuration
**Solution:**
```bash
rm -rf school-app/.next
cd school-app && npm run dev
```

## 🧪 Testing

### Validate Configuration

```bash
# Full system validation
./verify-ai-system.sh

# Environment validation only
cd school-app
ts-node ../shared/ai/scripts/validate-env.ts
```

### Test Provider Initialization

```typescript
import { providerManager } from "@edu/shared/ai/providers/provider-manager";

// Force re-initialization (useful for testing)
await providerManager.reinitialize();

// Check health
const health = providerManager.getHealthStatus();
console.log(health);
```

## 📊 Monitoring

### Startup Logs

Watch for these on application startup:

```
🚀 Initializing AI Provider Manager...
📊 Environment Snapshot: { ... }
🔧 Initializing Gemini provider...
✅ Gemini provider initialized successfully
✅ Provider Manager initialized with 1 provider(s)
```

### Request Logs

Watch for these on each AI request:

```
🤖 Getting AI model...
🎯 Selecting provider...
   Complexity: moderate
   Streaming: true
   Function Calling: true
✅ Provider selected: { provider: "gemini", model: "gemini-2.0-flash-exp" }
🔧 Binding 5 tool(s) to model
✅ Model ready
```

### Error Logs

Errors are logged with full context:

```
❌ Provider Manager initialization failed: No API keys configured
❌ Gemini initialization failed: Invalid API key
```

## 🔒 Security

### API Key Management

- Never commit API keys to git
- Use `.env.local` for local development
- Use environment variables in production
- Rotate keys regularly

### Model Access Control

- Only stable models enabled by default
- Experimental models require explicit opt-in
- Deprecated models blocked at validation

## 🚀 Deployment

### Pre-Deployment Checklist

```bash
# 1. Validate configuration
./verify-ai-system.sh

# 2. Run TypeScript checks
cd school-app && npm run check

# 3. Build application
npm run build

# 4. Test in production mode
npm start
```

### Environment Variables

Set these in your deployment platform:

```bash
GEMINI_API_KEY=your_production_key
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional

# Optional providers
OPENAI_API_KEY=your_openai_key
GROK_API_KEY=your_grok_key
```

### Monitoring

Monitor these metrics in production:

- Provider initialization success rate
- Model selection distribution
- Fallback trigger rate
- Average response time
- Error rate by provider

## 📖 API Reference

### ProviderManager

```typescript
class ProviderManager {
  // Get model with intelligent fallback
  async getModelWithFallback(
    complexity: TaskComplexity,
    tools?: any[]
  ): Promise<BaseChatModel>
  
  // Get provider health status
  getHealthStatus(): Record<string, any>
  
  // Force re-initialization
  async reinitialize(): Promise<void>
}
```

### Configuration Functions

```typescript
// Get provider configurations
function getGeminiConfig(): ProviderConfig
function getOpenAIConfig(): ProviderConfig
function getGrokConfig(): ProviderConfig
function getAllProviderConfigs(): ProviderConfig[]
function getEnabledProviderConfigs(): ProviderConfig[]

// Validation
function validateProvidersAvailable(): void
function validateAISystem(): ValidationResult
function validateOrThrow(): void
```

### Model Registry Functions

```typescript
// Model queries
function getModelMetadata(modelId: string): ModelMetadata | null
function isValidModel(modelId: string): boolean
function getRecommendedModels(provider: string): ModelMetadata[]
function hasCapabilities(modelId: string, required: ModelCapability[]): boolean
```

## 🤝 Contributing

### Adding Features

1. Update model registry if needed
2. Update provider configuration
3. Update validation logic
4. Add tests
5. Update documentation

### Code Style

- Use TypeScript strict mode
- Add JSDoc comments
- Use structured logging
- Handle errors explicitly
- No magic values

## 📝 License

Internal use only - EduPlexo Platform

---

**Last Updated:** 2026-05-11  
**Version:** 2.0.0  
**Status:** Production-Ready
