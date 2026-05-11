# 🚀 AI System Quick Reference

## ⚡ Quick Commands

```bash
# Verify AI system
./verify-ai-system.sh

# Clean and rebuild
./clean-and-rebuild.sh

# Validate environment
cd school-app && npm run validate:ai

# Start development
cd school-app && npm run dev
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `shared/ai/config/ai-models.ts` | Model registry (single source of truth) |
| `shared/ai/config/provider-config.ts` | Provider configuration |
| `shared/ai/config/validation.ts` | Runtime validation |
| `shared/ai/providers/provider-manager.ts` | Provider orchestration |
| `school-app/.env.local` | Environment variables |

---

## 🔧 Environment Variables

```bash
# Required (at least one)
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GROK_API_KEY=your_key_here

# Optional (uses defaults)
GEMINI_MODEL=gemini-2.0-flash-exp
OPENAI_MODEL=gpt-4o-mini
```

---

## 🎯 Stable Models

### Gemini (Recommended)
- `gemini-2.0-flash-exp` - Fast, efficient (default)
- `gemini-2.0-flash-thinking-exp` - Complex reasoning

### OpenAI
- `gpt-4o-mini` - Fast, affordable (default)
- `gpt-4o` - Most capable

### Grok
- `grok-beta` - Preview model

---

## 💻 Usage Examples

### Basic
```typescript
import { providerManager } from "@edu/shared/ai/providers/provider-manager";

const model = await providerManager.getModelWithFallback("moderate");
const response = await model.invoke([{ role: "user", content: "Hello" }]);
```

### With Tools
```typescript
import { providerManager } from "@edu/shared/ai/providers/provider-manager";
import { aiTools } from "@edu/shared/ai/tools/registry";

const model = await providerManager.getModelWithFallback("moderate", aiTools);
```

### Complexity Levels
```typescript
// Simple: Fast, cheap
const simple = await providerManager.getModelWithFallback("simple");

// Moderate: Balanced (default)
const moderate = await providerManager.getModelWithFallback("moderate");

// Complex: Most capable
const complex = await providerManager.getModelWithFallback("complex");
```

---

## 🐛 Troubleshooting

### Quick Fixes
```bash
# 1. Verify
./verify-ai-system.sh

# 2. Clean
./clean-and-rebuild.sh

# 3. Check env
cat school-app/.env.local | grep GEMINI

# 4. Restart
cd school-app && npm run dev
```

### Common Issues

| Issue | Fix |
|-------|-----|
| 404 Not Found | Clean caches, verify model name |
| No providers | Set API key in `.env.local` |
| Old model used | Clean `.next/`, restart |
| TypeScript errors | Rebuild shared package |

---

## 📊 Expected Logs

### Startup
```
🚀 Initializing AI Provider Manager...
✅ Gemini provider initialized successfully
✅ Provider Manager initialized with 1 provider(s)
```

### Request
```
🤖 Getting AI model...
🎯 Selecting provider...
✅ Provider selected: { provider: "gemini", model: "gemini-2.0-flash-exp" }
✅ Model ready
```

---

## ✅ Verification Checklist

- [ ] `./verify-ai-system.sh` passes
- [ ] No deprecated models
- [ ] Environment variables set
- [ ] Caches cleaned
- [ ] TypeScript compiles
- [ ] Dev server starts
- [ ] Logs show correct models
- [ ] Chatbot responds
- [ ] No 404 errors

---

## 📚 Documentation

- **Full Docs:** `shared/ai/README.md`
- **Migration:** `AI_SYSTEM_MIGRATION_GUIDE.md`
- **Complete:** `🎯_AI_REFACTOR_COMPLETE.md`
- **This File:** Quick reference

---

## 🎯 Success Indicators

✅ Verification passes  
✅ Correct models in logs  
✅ No 404 errors  
✅ Chatbot works  
✅ Fallbacks configured  

---

**Version:** 2.0.0  
**Status:** Production-Ready  
**Updated:** 2026-05-11
