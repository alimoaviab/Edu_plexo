#!/bin/bash

###############################################################################
# AI System Verification Script
#
# Comprehensive verification of AI provider infrastructure.
# Checks configuration, models, caches, and runtime readiness.
#
# Usage: ./verify-ai-system.sh
###############################################################################

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              AI SYSTEM VERIFICATION                                  ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

###############################################################################
# 1. Check Project Structure
###############################################################################
section "PROJECT STRUCTURE"

if [ -d "shared/ai" ]; then
    pass "shared/ai directory exists"
else
    fail "shared/ai directory not found"
fi

if [ -d "school-app" ]; then
    pass "school-app directory exists"
else
    fail "school-app directory not found"
fi

if [ -f "shared/ai/config/ai-models.ts" ]; then
    pass "ai-models.ts exists"
else
    fail "ai-models.ts not found"
fi

if [ -f "shared/ai/config/provider-config.ts" ]; then
    pass "provider-config.ts exists"
else
    fail "provider-config.ts not found"
fi

if [ -f "shared/ai/providers/provider-manager.ts" ]; then
    pass "provider-manager.ts exists"
else
    fail "provider-manager.ts not found"
fi

###############################################################################
# 2. Check Environment Variables
###############################################################################
section "ENVIRONMENT VARIABLES"

if [ -f "school-app/.env.local" ]; then
    pass ".env.local exists"
    
    # Check for API keys
    if grep -q "GEMINI_API_KEY=" school-app/.env.local; then
        if grep -q "GEMINI_API_KEY=AIza" school-app/.env.local; then
            pass "GEMINI_API_KEY is set"
        else
            warn "GEMINI_API_KEY exists but may be invalid"
        fi
    else
        warn "GEMINI_API_KEY not found"
    fi
    
    if grep -q "OPENAI_API_KEY=" school-app/.env.local; then
        pass "OPENAI_API_KEY is set"
    else
        info "OPENAI_API_KEY not found (optional)"
    fi
    
    if grep -q "GROK_API_KEY=" school-app/.env.local; then
        pass "GROK_API_KEY is set"
    else
        info "GROK_API_KEY not found (optional)"
    fi
    
    # Check model configuration
    if grep -q "GEMINI_MODEL=" school-app/.env.local; then
        MODEL=$(grep "GEMINI_MODEL=" school-app/.env.local | cut -d'=' -f2)
        info "GEMINI_MODEL set to: $MODEL"
        
        # Check for deprecated models
        if echo "$MODEL" | grep -q "1.5"; then
            fail "Using deprecated Gemini 1.5 model: $MODEL"
        elif echo "$MODEL" | grep -q "2.0-flash-exp\|2.0-flash-thinking-exp"; then
            pass "Using valid Gemini 2.0 model"
        else
            warn "Unknown Gemini model: $MODEL"
        fi
    else
        info "GEMINI_MODEL not set (will use default)"
    fi
else
    fail ".env.local not found in school-app/"
fi

###############################################################################
# 3. Check for Deprecated Model References
###############################################################################
section "DEPRECATED MODEL CHECK"

info "Searching for deprecated model references..."

# Search in source files (excluding node_modules)
DEPRECATED_REFS=$(grep -r "gemini-1\.5" shared/ai/ school-app/app/ 2>/dev/null | grep -v node_modules | grep -v ".next" || true)

if [ -z "$DEPRECATED_REFS" ]; then
    pass "No deprecated model references found in source"
else
    fail "Found deprecated model references:"
    echo "$DEPRECATED_REFS"
fi

# Check for hardcoded model strings
HARDCODED=$(grep -r "gemini-.*-latest" shared/ai/ school-app/app/ 2>/dev/null | grep -v node_modules | grep -v ".next" || true)

if [ -z "$HARDCODED" ]; then
    pass "No hardcoded model strings found"
else
    fail "Found hardcoded model strings:"
    echo "$HARDCODED"
fi

###############################################################################
# 4. Check Build Caches
###############################################################################
section "BUILD CACHE STATUS"

if [ -d "school-app/.next" ]; then
    warn ".next directory exists (may contain stale cache)"
    info "Run: rm -rf school-app/.next"
else
    pass ".next directory clean"
fi

if [ -d ".turbo" ] || [ -d "school-app/.turbo" ]; then
    warn "Turbo cache exists (may contain stale cache)"
    info "Run: rm -rf .turbo school-app/.turbo"
else
    pass "Turbo cache clean"
fi

if [ -d "school-app/node_modules/.cache" ]; then
    warn "node_modules cache exists"
else
    pass "node_modules cache clean"
fi

###############################################################################
# 5. Check TypeScript Compilation
###############################################################################
section "TYPESCRIPT COMPILATION"

info "Checking TypeScript compilation..."

if command -v tsc &> /dev/null; then
    if cd shared && tsc --noEmit 2>&1 | grep -q "error TS"; then
        fail "TypeScript compilation errors in shared/"
    else
        pass "shared/ TypeScript compiles successfully"
    fi
    cd ..
    
    if cd school-app && tsc --noEmit 2>&1 | grep -q "error TS"; then
        fail "TypeScript compilation errors in school-app/"
    else
        pass "school-app/ TypeScript compiles successfully"
    fi
    cd ..
else
    warn "TypeScript not found, skipping compilation check"
fi

###############################################################################
# 6. Check Dependencies
###############################################################################
section "DEPENDENCIES"

if [ -f "package.json" ]; then
    if grep -q "@langchain/google-genai" package.json || grep -q "@langchain/google-genai" school-app/package.json; then
        pass "@langchain/google-genai is installed"
    else
        fail "@langchain/google-genai not found in package.json"
    fi
    
    if grep -q "@langchain/openai" package.json || grep -q "@langchain/openai" school-app/package.json; then
        pass "@langchain/openai is installed"
    else
        warn "@langchain/openai not found (optional)"
    fi
fi

###############################################################################
# 7. Run Environment Validation
###############################################################################
section "ENVIRONMENT VALIDATION"

if [ -f "shared/ai/scripts/validate-env.ts" ]; then
    info "Running environment validation..."
    
    # Try to run validation script
    if command -v ts-node &> /dev/null; then
        if cd school-app && ts-node ../shared/ai/scripts/validate-env.ts; then
            pass "Environment validation passed"
        else
            fail "Environment validation failed"
        fi
        cd ..
    else
        warn "ts-node not found, skipping validation script"
    fi
else
    warn "validate-env.ts not found"
fi

###############################################################################
# SUMMARY
###############################################################################
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                        VERIFICATION SUMMARY                          ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Passed:${NC}   $PASSED"
echo -e "${RED}❌ Failed:${NC}   $FAILED"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ AI SYSTEM VERIFICATION PASSED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Your AI system is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. cd school-app"
    echo "  2. npm run dev"
    echo "  3. Test the chatbot"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ AI SYSTEM VERIFICATION FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo ""
    echo "Common fixes:"
    echo "  • Set required API keys in school-app/.env.local"
    echo "  • Remove deprecated model references"
    echo "  • Clean build caches: ./clean-and-rebuild.sh"
    echo "  • Check TypeScript errors"
    echo ""
    exit 1
fi
