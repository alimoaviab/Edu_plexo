#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — SSL Certificate Renewal
# ═══════════════════════════════════════════════════════════════════════════
# Add to crontab:
#   0 3 * * 1 /opt/eduplexo/deploy/scripts/renew-ssl.sh >> /var/log/eduplexo-ssl.log 2>&1

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.vps.yml"
ENV_FILE="$DEPLOY_DIR/.env.production"

echo "[$(date)] Attempting SSL certificate renewal..."

docker run --rm \
    -v "$DEPLOY_DIR/certbot/conf:/etc/letsencrypt" \
    -v "$DEPLOY_DIR/certbot/www:/var/www/certbot" \
    certbot/certbot renew --quiet

# Reload nginx to pick up new certs
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T nginx nginx -s reload 2>/dev/null || true

echo "[$(date)] SSL renewal check complete."
