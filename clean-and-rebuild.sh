#!/bin/bash

###############################################################################
# Complete AI System Clean and Rebuild Script
#
# Performs a thorough cleanup of all caches, builds, and artifacts,
# then rebuilds the entire system from scratch.
#
# This ensures no stale configuration or cached code affects the AI system.
#
# Usage: ./clean-and-rebuild.sh
###############################################################################

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║              AI SYSTEM CLEAN & REBUILD                               ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

step() {
    echo -e "${BLUE}▶${NC} $1"
}

success() {
    echo -e "${GREEN}✅${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

###############################################################################
# 1. Stop Running Processes
###############################################################################
step "Stopping any running processes..."

pkill -f "next dev" 2>/dev/null || true
pkill -f "turbo" 2>/dev/null || true
sleep 1

success "Processes stopped"

###############################################################################
# 2. Clean Next.js Cache
###############################################################################
step "Cleaning Next.js cache..."

rm -rf school-app/.next
rm -rf super-admin-app/.next 2>/dev/null || true
rm -rf sool-app/.next 2>/dev/null || true

success "Next.js cache cleaned"

###############################################################################
# 3. Clean Turbo Cache
###############################################################################
step "Cleaning Turbo cache..."

rm -rf .turbo
rm -rf school-app/.turbo
rm -rf shared/.turbo
rm -rf super-admin-app/.turbo 2>/dev/null || true

success "Turbo cache cleaned"

###############################################################################
# 4. Clean Node Modules Cache
###############################################################################
step "Cleaning node_modules cache..."

rm -rf school-app/node_modules/.cache
rm -rf node_modules/.cache
rm -rf shared/node_modules/.cache

success "Node modules cache cleaned"

###############################################################################
# 5. Clean TypeScript Build Cache
###############################################################################
step "Cleaning TypeScript build cache..."

rm -rf shared/dist
rm -rf shared/tsconfig.tsbuildinfo
rm -rf school-app/tsconfig.tsbuildinfo

success "TypeScript cache cleaned"

###############################################################################
# 6. Verify Environment Configuration
###############################################################################
step "Verifying environment configuration..."

if [ ! -f "school-app/.env.local" ]; then
    warn ".env.local not found. Please create it with required API keys."
else
    # Check for deprecated models
    if grep -q "gemini-1\.5" school-app/.env.local; then
        warn "Found deprecated Gemini 1.5 model in .env.local"
        echo "   Please update to: GEMINI_MODEL=gemini-2.0-flash-exp"
    else
        success "Environment configuration looks good"
    fi
fi

###############################################################################
# 7. Reinstall Dependencies (Optional)
###############################################################################
read -p "Do you want to reinstall dependencies? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    step "Reinstalling dependencies..."
    
    npm install
    
    success "Dependencies reinstalled"
else
    step "Skipping dependency reinstall"
fi

###############################################################################
# 8. Build Shared Package
###############################################################################
step "Building shared package..."

if [ -f "shared/package.json" ]; then
    cd shared
    if grep -q "\"build\"" package.json; then
        npm run build 2>/dev/null || warn "Shared package build failed or no build script"
    else
        warn "No build script in shared package"
    fi
    cd ..
fi

success "Shared package ready"

###############################################################################
# 9. Validate AI System
###############################################################################
step "Validating AI system configuration..."

if [ -f "verify-ai-system.sh" ]; then
    if ./verify-ai-system.sh; then
        success "AI system validation passed"
    else
        warn "AI system validation had warnings or errors"
        echo "   Review the output above and fix any issues"
    fi
else
    warn "verify-ai-system.sh not found, skipping validation"
fi

###############################################################################
# 10. Build School App
###############################################################################
step "Building school-app..."

cd school-app
npm run build

success "School app built successfully"
cd ..

###############################################################################
# COMPLETION
###############################################################################
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                    CLEAN & REBUILD COMPLETE                          ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ All caches cleaned${NC}"
echo -e "${GREEN}✅ System rebuilt${NC}"
echo -e "${GREEN}✅ Ready to start${NC}"
echo ""
echo "Next steps:"
echo "  1. cd school-app"
echo "  2. npm run dev"
echo "  3. Watch console for AI provider initialization logs"
echo "  4. Test the chatbot"
echo ""
echo "Look for these logs on startup:"
echo "  🚀 Initializing AI Provider Manager..."
echo "  ✅ Provider Manager initialized with X provider(s)"
echo ""
