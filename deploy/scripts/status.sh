#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Service Status Check
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.vps.yml"
ENV_FILE="$DEPLOY_DIR/.env.production"

echo "═══════════════════════════════════════════════════════════════════"
echo "  Eduplexo VPS Status"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Container status
echo "─── Containers ─────────────────────────────────────────────────────"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "  No containers running"
echo ""

# Health checks
echo "─── Health ─────────────────────────────────────────────────────────"
for container in eduplexo_backend eduplexo_nginx eduplexo_postgres eduplexo_redis; do
    STATUS=$(docker inspect "$container" --format='{{.State.Health.Status}}' 2>/dev/null || echo "not running")
    printf "  %-25s %s\n" "$container" "$STATUS"
done
echo ""

# Resource usage
echo "─── Resources ──────────────────────────────────────────────────────"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null | grep eduplexo || echo "  No containers running"
echo ""

# Disk usage
echo "─── Disk ─────────────────────────────────────────────────────────"
echo "  Docker volumes:"
docker system df -v 2>/dev/null | grep eduplexo || echo "  No volumes"
echo ""
echo "  Backup directory:"
du -sh "$DEPLOY_DIR/backups" 2>/dev/null || echo "  No backups"
echo ""

# System
echo "─── System ─────────────────────────────────────────────────────────"
echo "  Uptime: $(uptime -p 2>/dev/null || uptime)"
echo "  Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "  Disk:   $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
