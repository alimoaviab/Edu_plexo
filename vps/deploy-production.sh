#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Production Deployment Script - VPS Only
# ═══════════════════════════════════════════════════════════════════════════
# This script MUST be run on the VPS server, not locally.
# 
# Usage:
#   cd ~/prictice-projrct
#   bash vps/deploy-production.sh

set -e  # Exit on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VPS_DIR="$PROJECT_ROOT/vps"
COMPOSE_FILE="$VPS_DIR/docker-compose.vps.yml"
ENV_FILE="$VPS_DIR/.env.vps"

log_info "════════════════════════════════════════════════════════════════"
log_info "EduPlexo Production Deployment"
log_info "════════════════════════════════════════════════════════════════"
echo ""

# ─── Step 1: Validate Environment ─────────────────────────────────────────
log_info "Step 1: Validating environment..."

if [ ! -f "$ENV_FILE" ]; then
    log_error ".env.vps file not found!"
    log_error "Please create it first:"
    echo ""
    echo "  cd $VPS_DIR"
    echo "  cp .env.vps.example .env.vps"
    echo "  nano .env.vps  # Fill in your secrets"
    echo ""
    exit 1
fi

if grep -q "CHANGE_ME" "$ENV_FILE" 2>/dev/null; then
    log_error ".env.vps contains CHANGE_ME placeholders!"
    log_error "Please fill in all secrets before deploying."
    exit 1
fi

log_success "Environment file validated"
echo ""

# ─── Step 2: Check Git Status ─────────────────────────────────────────────
log_info "Step 2: Checking git status..."
cd "$PROJECT_ROOT"

CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
log_info "Current branch: $CURRENT_BRANCH"
log_info "Current commit: $CURRENT_COMMIT"

if git status --porcelain | grep -q "^"; then
    log_warn "Working directory has uncommitted changes"
fi

log_success "Git status checked"
echo ""

# ─── Step 3: Stop Existing Containers ────────────────────────────────────
log_info "Step 3: Stopping existing containers..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down 2>/dev/null || log_warn "No existing containers to stop"

log_success "Existing containers stopped"
echo ""

# ─── Step 4: Build Fresh Images ───────────────────────────────────────────
log_info "Step 4: Building Docker images (this may take a few minutes)..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache backend-go

log_success "Docker images built"
echo ""

# ─── Step 5: Start Infrastructure ─────────────────────────────────────────
log_info "Step 5: Starting infrastructure (PostgreSQL + Redis)..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d postgres redis

log_info "Waiting for database to be ready..."
sleep 10

log_success "Infrastructure started"
echo ""

# ─── Step 6: Run Migrations ───────────────────────────────────────────────
log_info "Step 6: Running database migrations..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up migrate

MIGRATE_EXIT=$(docker inspect eduplexo_migrate --format='{{.State.ExitCode}}' 2>/dev/null || echo "1")
if [ "$MIGRATE_EXIT" != "0" ]; then
    log_warn "Migration exit code: $MIGRATE_EXIT"
    log_warn "Check logs: docker logs eduplexo_migrate"
fi

log_success "Migrations completed"
echo ""

# ─── Step 7: Start Application Services ───────────────────────────────────
log_info "Step 7: Starting backend and edubot..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d backend-go edubot

log_info "Waiting for backend to start..."
sleep 15

log_success "Application services started"
echo ""

# ─── Step 8: Start Nginx ──────────────────────────────────────────────────
log_info "Step 8: Starting nginx..."

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d nginx

log_success "Nginx started"
echo ""

# ─── Step 9: Health Checks ────────────────────────────────────────────────
log_info "Step 9: Running health checks..."
echo ""

sleep 5

# Check container status
log_info "Container Status:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo ""

# Check backend health
log_info "Testing backend health..."
if docker exec eduplexo_backend wget -q -O - http://localhost:8080/health/live 2>/dev/null; then
    log_success "Backend is healthy"
else
    log_warn "Backend health check failed"
fi

echo ""

# ─── Step 10: Show Logs ───────────────────────────────────────────────────
log_info "Step 10: Recent backend logs:"
echo ""
docker logs eduplexo_backend --tail 20

echo ""

# ─── Deployment Complete ──────────────────────────────────────────────────
log_info "════════════════════════════════════════════════════════════════"
log_success "Deployment Complete!"
log_info "════════════════════════════════════════════════════════════════"
echo ""
log_info "Deployed commit: $CURRENT_COMMIT"
log_info "API Health: http://localhost:8080/health/live"
echo ""
log_info "Useful commands:"
echo "  View logs:    docker logs eduplexo_backend -f"
echo "  Restart:      docker compose -f $COMPOSE_FILE --env-file $ENV_FILE restart backend-go"
echo "  Stop all:     docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down"
echo ""
log_info "════════════════════════════════════════════════════════════════"
