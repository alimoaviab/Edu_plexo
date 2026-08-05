#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# EduPlexo VPS Auto Linker
# ═══════════════════════════════════════════════════════════════════════════
# Run once on VPS so you can just type: docker compose up --build -d
# ═══════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔧 Setting up VPS symlinks for docker-compose.api.yml..."

# Symlink docker-compose.yml to docker-compose.api.yml
ln -sf docker-compose.api.yml "$SCRIPT_DIR/docker-compose.yml"
echo "✓ docker-compose.yml linked to docker-compose.api.yml"

# Remove dev override on VPS if present
if [ -f "$SCRIPT_DIR/docker-compose.override.yml" ]; then
    rm -f "$SCRIPT_DIR/docker-compose.override.yml"
    echo "✓ Cleaned up dev docker-compose.override.yml"
fi

# Ensure .env exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    if [ -f "$SCRIPT_DIR/.env.prod" ]; then
        cp "$SCRIPT_DIR/.env.prod" "$SCRIPT_DIR/.env"
        echo "✓ Created .env from .env.prod"
    fi
fi

echo ""
echo "✅ VPS Setup complete! Now you can deploy anytime with simple commands:"
echo "  git pull"
echo "  docker compose up --build -d"
