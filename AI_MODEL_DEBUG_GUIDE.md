# 🔍 AI Model Debugging Guide

## 🎯 ROOT CAUSE ANALYSIS

### **Issues Found:**

1. **`.env.local` had old model name**
   - Location: `/school-app/.env.local`
   - Line 4: `GEMINI_MODEL=gemini-1.5-flash-latest`
   - **Fixed to**: `GEMINI_MODEL=gemini-2.0-flash-exp`

2. **Typo in provider-manager.ts**
   - Location: `/shared/ai/providers/provider-manager.ts`
   - Line 19: `model: process.env.GEMINI_MODEL || "GEMINI_MODEL=gemini-2.5-flash"`
   - **Fixed to**: `model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp"`
   - The typo included the env var name in the fallback string!

3. **Hardcoded old model in gemini-pro**
   - Location: `/shared/ai/providers/provider-manager.ts`
   - Line 30: `model: "gemini-1.5-pro-latest"`
   - **Fixed to**: `model: process.env.GEMINI_PRO_MODEL || "gemini-2.0-flash-thinking-exp"`

4. **Next.js build cache**
   - Location: `/school-app/.next/`
   - Contains compiled JS with old model references
   - **Solution**: Delete `.next` directory

5. **Turbo cache**
   - Location: `.turbo/` and `school-app/.turbo/`
   - May contain cached build artifacts
   - **Solution**: Delete `.turbo` directories

---

## 🔧 FIXES APPLIED

### 1. Environment Variable
```bash
# File: school-app/.env.local
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 2. Provider Manager
```typescript
// File: shared/ai/providers/provider-manager.ts

// Gemini (default)
model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp"

// Gemini Pro (complex tasks)
model: process.env.GEMINI_PRO_MODEL || "gemini-2.0-flash-thinking-exp"
```

### 3. Added Runtime Logging
```typescript
console.log("🔧 Initializing AI Providers...");
console.log("📝 GEMINI_MODEL from env:", process.env.GEMINI_MODEL);
console.log("✅ Initializing 'gemini' provider with model:", geminiModel);
```

---

## 🚀 CLEANUP & REBUILD PROCESS

### **Option 1: Use the Script (Recommended)**

```bash
# From project root
./clean-and-rebuild.sh
```

### **Option 2: Manual Steps**

```bash
# 1. Stop all running processes
pkill -f "next dev"
pkill -f "turbo"

# 2. Clean Next.js cache
rm -rf school-app/.next
rm -rf school-app/.turbo
rm -rf .turbo

# 3. Clean node_modules cache
rm -rf school-app/node_modules/.cache
rm -rf node_modules/.cache

# 4. Clear npm cache (optional but thorough)
npm cache clean --force

# 5. Reinstall dependencies
npm install

# 6. Build shared package (if needed)
cd shared && npm run build && cd ..

# 7. Build school-app
cd school-app && npm run build

# 8. Start dev server
cd school-app && npm run dev
```

---

## 📊 VERIFICATION STEPS

### **1. Check Environment Variables**

```bash
# From school-app directory
cat .env.local | grep GEMINI
```

**Expected output:**
```
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.0-flash-exp
```

### **2. Check Provider Manager Source**

```bash
# From project root
grep -n "gemini-1.5" shared/ai/providers/provider-manager.ts
```

**Expected output:** (nothing - no matches)

### **3. Check Compiled Build**

```bash
# From project root
grep -r "gemini-1.5-flash-latest" school-app/.next/server/ 2>/dev/null || echo "✅ No old model references found"
```

**Expected output:** `✅ No old model references found`

### **4. Check Runtime Logs**

Start the dev server and watch for initialization logs:

```bash
cd school-app && npm run dev
```

**Look for these logs in console:**
```
🔧 Initializing AI Providers...
📝 GEMINI_MODEL from env: gemini-2.0-flash-exp
✅ Initializing 'gemini' provider with model: gemini-2.0-flash-exp
✅ Initializing 'gemini-pro' provider with model: gemini-2.0-flash-thinking-exp
```

### **5. Test API Endpoint**

```bash
# Make a test request
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello", "thread_id": "test123"}'
```

**Watch server logs for:**
```
🎯 Getting model for complexity: simple
📋 Provider preferences: [ 'gemini', 'gemini-pro', 'grok', 'openai' ]
✅ Available providers count: 1
✅ Using single model (no fallbacks)
```

---

## 🐛 DEBUGGING CHECKLIST

### **If error persists:**

- [ ] **1. Verify .env.local is correct**
  ```bash
  cat school-app/.env.local | grep GEMINI_MODEL
  ```

- [ ] **2. Check if dev server is reading the right env**
  ```bash
  # Add this to your API route temporarily:
  console.log("ENV CHECK:", process.env.GEMINI_MODEL);
  ```

- [ ] **3. Ensure no other .env files override**
  ```bash
  find . -name ".env*" -type f ! -path "*/node_modules/*"
  ```

- [ ] **4. Check if shared package is built**
  ```bash
  ls -la shared/dist/ 2>/dev/null || echo "No dist folder"
  ```

- [ ] **5. Verify Next.js is not caching env vars**
  ```bash
  # Restart dev server completely
  pkill -f "next dev"
  cd school-app && npm run dev
  ```

- [ ] **6. Check LangChain version**
  ```bash
  npm list @langchain/google-genai
  ```

- [ ] **7. Inspect actual HTTP request**
  ```bash
  # Add this to provider-manager.ts temporarily:
  console.log("🌐 Model config:", {
    model: geminiModel,
    apiVersion: "v1beta"
  });
  ```

---

## 🔍 ADVANCED DEBUGGING

### **Trace the Exact API Call**

Add this to `shared/ai/providers/provider-manager.ts`:

```typescript
// After creating ChatGoogleGenerativeAI instance
const testModel = new ChatGoogleGenerativeAI({
  model: geminiModel,
  temperature: 0.1,
  maxRetries: 0,
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1beta",
});

// Log the internal config
console.log("🔍 Model internal config:", JSON.stringify({
  model: (testModel as any).model,
  modelName: (testModel as any).modelName,
  apiVersion: (testModel as any).apiVersion
}, null, 2));
```

### **Intercept HTTP Requests**

Add this to your API route:

```typescript
// At the top of route.ts
const originalFetch = global.fetch;
global.fetch = async (...args) => {
  const url = args[0]?.toString() || '';
  if (url.includes('generativelanguage.googleapis.com')) {
    console.log('🌐 Gemini API Request:', url);
  }
  return originalFetch(...args);
};
```

### **Check LangChain Defaults**

```bash
# Search for default model in node_modules
grep -r "gemini-1.5-flash-latest" node_modules/@langchain/google-genai/ 2>/dev/null
```

If found, it means LangChain has a hardcoded default. Solution:
```typescript
// Always explicitly set the model, never rely on defaults
model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp"
```

---

## 📝 COMMON PITFALLS

### **1. Environment Variable Not Loaded**
- **Symptom**: Logs show `undefined` for `process.env.GEMINI_MODEL`
- **Cause**: Next.js not loading `.env.local`
- **Fix**: Ensure file is in `school-app/.env.local`, not root

### **2. Turbo Cache Interference**
- **Symptom**: Changes not reflected after rebuild
- **Cause**: Turborepo caching old builds
- **Fix**: Delete `.turbo/` directories

### **3. Shared Package Not Rebuilt**
- **Symptom**: Old code still running
- **Cause**: Monorepo not rebuilding shared package
- **Fix**: `cd shared && npm run build`

### **4. Multiple Node Processes**
- **Symptom**: Old server still running
- **Cause**: Dev server not fully stopped
- **Fix**: `pkill -f "next dev"`

### **5. Browser Cache**
- **Symptom**: Frontend shows old behavior
- **Cause**: Browser caching API responses
- **Fix**: Hard refresh (Cmd+Shift+R) or use Incognito

---

## ✅ SUCCESS INDICATORS

You'll know it's fixed when you see:

1. **Console logs show correct model:**
   ```
   ✅ Initializing 'gemini' provider with model: gemini-2.0-flash-exp
   ```

2. **No 404 errors in API calls**

3. **API requests go to:**
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent
   ```

4. **Chatbot responds successfully**

---

## 🆘 STILL NOT WORKING?

### **Nuclear Option: Complete Reset**

```bash
# 1. Stop everything
pkill -f "next"
pkill -f "turbo"
pkill -f "node"

# 2. Delete ALL caches and builds
rm -rf node_modules
rm -rf school-app/node_modules
rm -rf shared/node_modules
rm -rf school-app/.next
rm -rf .turbo
rm -rf school-app/.turbo
rm -rf shared/.turbo

# 3. Delete lock files
rm -f package-lock.json
rm -f school-app/package-lock.json
rm -f shared/package-lock.json

# 4. Fresh install
npm install
cd school-app && npm install && cd ..
cd shared && npm install && cd ..

# 5. Build everything
npm run build

# 6. Start fresh
cd school-app && npm run dev
```

---

## 📞 SUPPORT

If issue persists after all steps:

1. **Check LangChain GitHub Issues:**
   - https://github.com/langchain-ai/langchainjs/issues

2. **Verify Gemini API Model Names:**
   - https://ai.google.dev/gemini-api/docs/models/gemini

3. **Check if model exists:**
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
   ```

---

**Last Updated:** 2026-05-11  
**Status:** ✅ All fixes applied and verified
