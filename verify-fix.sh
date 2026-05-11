#!/bin/bash

echo "🔍 Verifying AI Model Configuration..."
echo ""

# Check 1: Environment variable
echo "1️⃣ Checking .env.local..."
if grep -q "GEMINI_MODEL=gemini-2.0-flash-exp" school-app/.env.local; then
    echo "   ✅ GEMINI_MODEL is set to gemini-2.0-flash-exp"
else
    echo "   ❌ GEMINI_MODEL not set correctly"
    echo "   Current value:"
    grep "GEMINI_MODEL" school-app/.env.local
fi
echo ""

# Check 2: Provider manager source
echo "2️⃣ Checking provider-manager.ts..."
if grep -q "gemini-1.5" shared/ai/providers/provider-manager.ts; then
    echo "   ❌ Old model references still found!"
    grep -n "gemini-1.5" shared/ai/providers/provider-manager.ts
else
    echo "   ✅ No old model references in source"
fi
echo ""

# Check 3: Build cache
echo "3️⃣ Checking build cache..."
if [ -d "school-app/.next" ]; then
    echo "   ⚠️  .next directory exists (may contain old cache)"
    if grep -r "gemini-1.5-flash-latest" school-app/.next/server/ 2>/dev/null; then
        echo "   ❌ Old model found in build cache!"
        echo "   Run: rm -rf school-app/.next"
    else
        echo "   ✅ No old model in build cache"
    fi
else
    echo "   ✅ .next directory clean (doesn't exist)"
fi
echo ""

# Check 4: Turbo cache
echo "4️⃣ Checking Turbo cache..."
if [ -d ".turbo" ] || [ -d "school-app/.turbo" ]; then
    echo "   ⚠️  Turbo cache exists"
    echo "   Run: rm -rf .turbo school-app/.turbo"
else
    echo "   ✅ Turbo cache clean"
fi
echo ""

# Check 5: All env files
echo "5️⃣ Checking all .env files..."
find . -name ".env*" -type f ! -path "*/node_modules/*" -exec echo "   📄 {}" \; -exec grep "GEMINI_MODEL" {} \; 2>/dev/null
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Fixes applied:"
echo "   • .env.local updated to gemini-2.0-flash-exp"
echo "   • provider-manager.ts fixed (removed typo and hardcoded model)"
echo "   • Added runtime logging for debugging"
echo "   • Cleaned build caches"
echo ""
echo "🚀 Next steps:"
echo "   1. cd school-app"
echo "   2. npm run dev"
echo "   3. Watch console for: '🔧 Initializing AI Providers...'"
echo "   4. Test chatbot"
echo ""
echo "📝 If issues persist, see: AI_MODEL_DEBUG_GUIDE.md"
echo ""
