#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Log Viewer
# ═══════════════════════════════════════════════════════════════════════════
# Usage:
#   bash deploy/scripts/logs.sh              # All services
#   bash deploy/scripts/logs.sh backend      # Backend only
#   bash deploy/scripts/logs.sh postgres     # Postgres only
#   bash deploy/scripts/logs.sh nginx        # Nginx only

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.vps.yml"
ENV_FILE="$DEPLOY_DIR/.env.production"

SERVICE="${1:-}"

case "$SERVICE" in
    backend|api)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=100 backend-go
        ;;
    postgres|db)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=100 postgres
        ;;
    nginx|proxy)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=100 nginx
        ;;
    redis|cache)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=100 redis
        ;;
    migrate)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail=50 migrate
        ;;
    *)
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=50
        ;;
esac
