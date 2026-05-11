# 🚀 AI System Migration Guide

## Overview

This guide documents the complete refactor of the AI provider infrastructure from a fragile, hardcoded system to an enterprise-grade, production-safe architecture.

## 🎯 What Changed

### **Before (Problems)**

❌ Hardcoded model names scattered across codebase  
❌ Deprecated models (gemini-1.5-flash-latest)  
❌ Typos in fallback strings  
❌ No validation  
❌ Silent failures  
❌ Weak fallback system  
❌ No observability  
❌ Cache confusion  
❌ Magic behavior  

### **After (Solutions)**

✅ Centralized model registry  
✅ Only stable, production models  
✅ Type-safe configuration  
✅ Runtime validation  
✅ Fail-fast errors  
✅ Intelligent fallback routing  
✅ Comprehensive logging  
✅ Cache-safe architecture  
✅ Explicit, observable behavior  

## 📁 New Architecture

```
shared/ai/
├── config/
│   ├── ai-models.ts          # ⭐ Single source of truth for all models
│   ├── provider-config.ts    # ⭐ Centralized provider configuration
│   └── validation.ts         # ⭐ Runtime validation system
├── providers/
│   └── provider-manager.ts   # ⭐ Completely refactored orchestration
├── agents/
│   └── supervisor.ts         # ✏️ Updated to use new system
└── scripts/
    └── validate-env.ts       # ⭐ New validation script
```

## 🔄 Migration Steps

### **Step 1: Understand New Architecture**

Read the new files:
1. `shared/ai/config/ai-models.ts` - Model registry
2. `shared/ai/config/provider-config.ts` - Provider config
3. `shared/ai/providers/provider-manager.ts` - Orchestration
4. `shared/ai/README.md` - Full documentation

### **Step 2: Update Environment Variables**

**Old:**
```bash
GEMINI_MODEL=gemini-1.5-flash-latest  # ❌ Deprecated
```

**New:**
```bash
GEMINI_MODEL=gemini-2.0-flash-exp     # ✅ Stable, production-ready
```

### **Step 3: Clean All Caches**

```bash
./clean-and-rebuild.sh
```

This removes:
- Next.js cache (`.next/`)
- Turbo cache (`.turbo/`)
- Node modules cache
- TypeScript build cache

### **Step 4: Validate Configuration**

```bash
./verify-ai-system.sh
```

This checks:
- Project structure
- Environment variables
- Model references
- Build caches
- TypeScript compilation
- Dependencies

### **Step 5: Test the System**

```bash
cd school-app
npm run dev
```

Watch for initialization logs:
```
🚀 Initializing AI Provider Manager...
📊 Environment Snapshot: { ... }
🔧 Initializing Gemini provider...
   Model: gemini-2.0-flash-exp
   Display Name: Gemini 2.0 Flash
   Stability: stable
✅ Gemini provider initialized successfully
✅ Provider Manager initialized with 1 provider(s)
```

## 🆕 New Features

### **1. Model Registry**

All models in one place (`ai-models.ts`):

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
  PRO: {
    id: "gemini-2.0-flash-thinking-exp",
    // ...
  },
};
```

### **2. Runtime Validation**

Validates configuration on startup:

```typescript
import { validateOrThrow } from "@edu/shared/ai/config/validation";

// Throws error if configuration is invalid
validateOrThrow();
```

### **3. Structured Logging**

Every operation is logged:

```
🚀 Initializing AI Provider Manager...
🔧 Initializing Gemini provider...
✅ Gemini provider initialized successfully
🎯 Selecting provider...
✅ Provider selected: { provider: "gemini", model: "gemini-2.0-flash-exp" }
```

### **4. Health Monitoring**

Check provider status:

```typescript
const health = providerManager.getHealthStatus();
console.log(health);
```

### **5. Intelligent Fallback**

Automatic fallback with logging:

```typescript
const model = await providerManager.getModelWithFallback("moderate");
// Automatically configures fallbacks based on available providers
```

### **6. Environment Snapshot**

Debug configuration easily:

```typescript
import { getEnvironmentSnapshot } from "@edu/shared/ai/config/validation";

const snapshot = getEnvironmentSnapshot();
console.log(snapshot);
```

## 🔧 Configuration Guide

### **Adding a New Model**

1. Add to `config/ai-models.ts`:
```typescript
export const GEMINI_MODELS = {
  // ...
  NEW_MODEL: {
    id: "gemini-3.0-ultra",
    provider: "gemini",
    displayName: "Gemini 3.0 Ultra",
    stability: ModelStability.STABLE,
    capabilities: [
      ModelCapability.TEXT_GENERATION,
      ModelCapability.FUNCTION_CALLING,
      ModelCapability.STREAMING,
    ],
    maxTokens: 32768,
    recommended: true,
  },
};
```

2. Use it:
```bash
# .env.local
GEMINI_MODEL=gemini-3.0-ultra
```

3. Validate:
```bash
./verify-ai-system.sh
```

### **Adding a New Provider**

Example: Adding Anthropic Claude

1. Add models to `config/ai-models.ts`:
```typescript
export const ANTHROPIC_MODELS = {
  CLAUDE_3_5: {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    displayName: "Claude 3.5 Sonnet",
    stability: ModelStability.STABLE,
    capabilities: [/* ... */],
    maxTokens: 200000,
    recommended: true,
  },
};
```

2. Add config to `config/provider-config.ts`:
```typescript
export function getAnthropicConfig(): ProviderConfig {
  const apiKey = getEnvVar("ANTHROPIC_API_KEY");
  const enabled = validateApiKey(apiKey, "Anthropic");
  
  return {
    name: "anthropic",
    enabled,
    credentials: enabled ? { apiKey: apiKey! } : null,
    defaultModel: ANTHROPIC_MODELS.CLAUDE_3_5,
    timeout: 30000,
    maxRetries: 2,
    temperature: 0.2,
  };
}
```

3. Add initialization to `providers/provider-manager.ts`:
```typescript
private async initializeAnthropic(): Promise<void> {
  const config = getAnthropicConfig();
  this.configs.set("anthropic", config);
  
  if (!config.enabled) {
    console.log("⏭️  Anthropic: Skipped (no API key)");
    return;
  }
  
  // Initialize Anthropic model...
}
```

4. Call in `initialize()`:
```typescript
await this.initializeAnthropic();
```

## 🐛 Troubleshooting

### **Issue: Old model still being used**

**Symptoms:**
- 404 errors for `gemini-1.5-flash-latest`
- Logs show old model name

**Solution:**
```bash
# 1. Check environment
cat school-app/.env.local | grep GEMINI_MODEL

# 2. Search for hardcoded references
grep -r "gemini-1.5" shared/ai/ school-app/app/

# 3. Clean caches
./clean-and-rebuild.sh

# 4. Verify
./verify-ai-system.sh
```

### **Issue: No providers available**

**Symptoms:**
- Error: "No AI providers available"

**Solution:**
```bash
# Check API keys
cat school-app/.env.local | grep API_KEY

# Set at least one API key
echo "GEMINI_API_KEY=your_key_here" >> school-app/.env.local

# Restart
cd school-app && npm run dev
```

### **Issue: TypeScript errors**

**Symptoms:**
- Import errors
- Type errors

**Solution:**
```bash
# Check TypeScript compilation
cd school-app && npm run check

# Rebuild shared package
cd ../shared && npm run build

# Clean and rebuild
cd .. && ./clean-and-rebuild.sh
```

### **Issue: Stale cache**

**Symptoms:**
- Changes not reflected
- Old behavior persists

**Solution:**
```bash
# Nuclear option
rm -rf school-app/.next
rm -rf .turbo
rm -rf school-app/.turbo
rm -rf node_modules/.cache

# Restart
cd school-app && npm run dev
```

## 📊 Verification Checklist

After migration, verify:

- [ ] `./verify-ai-system.sh` passes
- [ ] No deprecated model references in code
- [ ] Environment variables set correctly
- [ ] Build caches cleaned
- [ ] TypeScript compiles without errors
- [ ] Dev server starts successfully
- [ ] Initialization logs show correct models
- [ ] Chatbot responds successfully
- [ ] No 404 errors in console

## 🎓 Best Practices

### **DO:**

✅ Use centralized model registry  
✅ Validate configuration on startup  
✅ Use structured logging  
✅ Handle errors explicitly  
✅ Clean caches after changes  
✅ Run verification scripts  
✅ Monitor initialization logs  
✅ Use stable models in production  

### **DON'T:**

❌ Hardcode model names  
❌ Use deprecated models  
❌ Skip validation  
❌ Ignore errors  
❌ Rely on cached builds  
❌ Use experimental models in production  
❌ Modify node_modules  
❌ Commit API keys  

## 📚 Additional Resources

- **Full Documentation:** `shared/ai/README.md`
- **Model Registry:** `shared/ai/config/ai-models.ts`
- **Provider Config:** `shared/ai/config/provider-config.ts`
- **Validation:** `shared/ai/config/validation.ts`
- **Verification Script:** `verify-ai-system.sh`
- **Clean Script:** `clean-and-rebuild.sh`

## 🆘 Getting Help

If you encounter issues:

1. **Run verification:**
   ```bash
   ./verify-ai-system.sh
   ```

2. **Check logs:**
   - Look for initialization logs
   - Check for error messages
   - Verify model names

3. **Clean and rebuild:**
   ```bash
   ./clean-and-rebuild.sh
   ```

4. **Review documentation:**
   - `shared/ai/README.md`
   - This migration guide

## ✅ Success Criteria

You'll know the migration is successful when:

1. ✅ Verification script passes
2. ✅ No deprecated model references
3. ✅ Initialization logs show correct models
4. ✅ Chatbot responds successfully
5. ✅ No 404 errors
6. ✅ Fallback system works
7. ✅ All providers initialize correctly

## 🎉 Conclusion

The AI system is now:

- **Production-safe:** Only stable models
- **Observable:** Comprehensive logging
- **Maintainable:** Centralized configuration
- **Reliable:** Intelligent fallbacks
- **Debuggable:** Clear error messages
- **Scalable:** Easy to add providers/models

---

**Migration Date:** 2026-05-11  
**Version:** 2.0.0  
**Status:** Complete
