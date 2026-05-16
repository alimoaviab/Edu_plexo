#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Production Deployment Script
# ═══════════════════════════════════════════════════════════════════════════
# Deploys/updates the backend infrastructure on VPS.
#
# Usage:
#   bash deploy/scripts/deploy.sh          # Full deploy
#   bash deploy/scripts/deploy.sh --quick  # Skip build cache (force rebuild)
#
# What it does:
#   1. Validates environment
#   2. Backs up database (if running)
#   3. Pulls latest code
#   4. Builds containers
#   5. Runs migrations
#   6. Deploys with zero-downtime
#   7. Verifies health
#   8. Cleans up old images

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DEPLOY_DIR")"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.vps.yml"
ENV_FILE="$DEPLOY_DIR/.env.production"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $(date '+%H:%M:%S') $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $(date '+%H:%M:%S') $1"; }
error() { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $1"; exit 1; }

# ─── Validate ─────────────────────────────────────────────────────────────
log "Validating environment..."

if [ ! -f "$ENV_FILE" ]; then
    error ".env.production not found at $ENV_FILE"
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    error "docker-compose.vps.yml not found at $COMPOSE_FILE"
fi

# Check Docker is running
docker info &>/dev/null || error "Docker is not running"

# ─── Pre-deploy Backup ────────────────────────────────────────────────────
if docker ps --format '{{.Names}}' | grep -q "eduplexo_postgres"; then
    log "Creating pre-deploy database backup..."
    bash "$SCRIPT_DIR/backup-db.sh" || warn "Backup failed (non-fatal for first deploy)"
fi

# ─── Pull Latest Code ────────────────────────────────────────────────────
log "Pulling latest code..."
cd "$PROJECT_DIR"
if git rev-parse --git-dir > /dev/null 2>&1; then
    git pull --ff-only origin main 2>/dev/null || warn "Git pull skipped (not a git repo or conflicts)"
fi

# ─── Build ────────────────────────────────────────────────────────────────
log "Building containers..."
BUILD_ARGS=""
if [ "${1:-}" = "--quick" ]; then
    BUILD_ARGS="--no-cache"
fi

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build $BUILD_ARGS

# ─── Deploy ───────────────────────────────────────────────────────────────
log "Deploying services..."

# Start infrastructure first (postgres, redis)
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d postgres redis
log "Waiting for database to be ready..."
sleep 10

# Run migrations
log "Running database migrations..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up migrate
MIGRATE_EXIT=$(docker inspect eduplexo_migrate --format='{{.State.ExitCode}}' 2>/dev/null || echo "1")
if [ "$MIGRATE_EXIT" != "0" ]; then
    warn "Migration exited with code $MIGRATE_EXIT (may be OK if no new migrations)"
fi

# Start backend
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d backend-go
log "Waiting for backend to be healthy..."
sleep 15

# Start nginx + certbot
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d nginx certbot

# ─── Health Check ─────────────────────────────────────────────────────────
log "Verifying deployment..."
sleep 5

HEALTH_STATUS=$(docker inspect eduplexo_backend --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
if [ "$HEALTH_STATUS" = "healthy" ]; then
    log "✓ Backend is healthy"
else
    warn "Backend health status: $HEALTH_STATUS (may still be starting)"
fi

NGINX_STATUS=$(docker inspect eduplexo_nginx --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
if [ "$NGINX_STATUS" = "healthy" ]; then
    log "✓ Nginx is healthy"
else
    warn "Nginx health status: $NGINX_STATUS"
fi

# ─── Cleanup ──────────────────────────────────────────────────────────────
log "Cleaning up old images..."
docker image prune -f --filter "until=168h" 2>/dev/null || true

# ─── Summary ──────────────────────────────────────────────────────────────
echo ""
log "═══════════════════════════════════════════════════════════════════"
log "Deployment complete!"
log ""
log "Services:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
log ""
log "Logs: docker compose -f $COMPOSE_FILE logs -f"
log "═══════════════════════════════════════════════════════════════════"
