#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# VPS Setup Script - Run this ONCE on VPS after first git clone
# ═══════════════════════════════════════════════════════════════════════════
# Creates symlink from vps/docker-compose.vps.yml to root docker-compose.yml
# so you can just run: docker compose up --build -d

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔧 Setting up VPS symlinks..."

# Create symlink for docker-compose
if [ -L "$SCRIPT_DIR/docker-compose.yml" ]; then
    echo "✓ Symlink already exists"
else
    echo "Creating symlink: docker-compose.yml -> vps/docker-compose.vps.yml"
    ln -sf vps/docker-compose.vps.yml "$SCRIPT_DIR/docker-compose.yml"
fi

# Check for .env file
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "⚠️  Creating .env symlink..."
    if [ -f "$SCRIPT_DIR/vps/.env.vps" ]; then
        ln -sf vps/.env.vps "$SCRIPT_DIR/.env"
        echo "✓ .env linked to vps/.env.vps"
    else
        echo "❌ ERROR: vps/.env.vps not found!"
        echo "Please create it first:"
        echo "  cd vps"
        echo "  cp .env.vps.example .env.vps"
        echo "  nano .env.vps  # Fill in your values"
        exit 1
    fi
fi

echo ""
echo "✅ VPS setup complete!"
echo ""
echo "Now you can deploy with:"
echo "  git pull"
echo "  docker compose up --build -d"
