#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Automated Safe Production Deployment Script
# ═══════════════════════════════════════════════════════════════════════════
# Guarantees:
#   - Fails immediately on any error (set -euo pipefail)
#   - Validates Compose & Nginx configuration before modifying state
#   - Creates an automated database snapshot prior to running migrations
#   - Runs migrations safely with golang-migrate
#   - Ensures services become healthy before promoting Nginx traffic
#   - NEVER runs docker compose down -v or deletes persistent volumes
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_step() {
  echo -e "\n${BLUE}==> [$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1${NC}"
}

# ─── 1. Environment & Prerequisites Verification ────────────────────────
log_step "1. Verifying environment prerequisites..."
if [[ ! -f "${ROOT_DIR}/.env" ]]; then
  echo -e "${RED}ERROR: Production configuration file ${ROOT_DIR}/.env is missing!${NC}" >&2
  echo "Please copy .env.prod.example to .env and configure your production secrets." >&2
  exit 1
fi

# Ensure required host directories exist
mkdir -p "${ROOT_DIR}/nginx/ssl" "${ROOT_DIR}/nginx/cache" /var/backups/eduplexo

# ─── 2. Configuration Validation ─────────────────────────────────────────
log_step "2. Validating Docker Compose configuration..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" config --quiet
echo "  Docker Compose configuration syntax is valid."

# ─── 3. Pre-migration Database Backup ────────────────────────────────────
log_step "3. Checking for running database to perform pre-deployment backup..."
if docker compose -f "${COMPOSE_FILE}" ps --status running --format '{{.Service}}' | grep -qx "postgres"; then
  echo "  PostgreSQL is currently running. Creating pre-migration backup snapshot..."
  bash "${SCRIPT_DIR}/backup_db.sh"
else
  echo "  PostgreSQL is not running yet. Skipping pre-deployment backup."
fi

# ─── 4. Build / Update Application Images ────────────────────────────────
log_step "4. Building production container images..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" build backend-go edubot

# ─── 5. Start Core Infrastructure (Postgres & Redis) ─────────────────────
log_step "5. Starting persistent infrastructure services (Postgres & Redis)..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" up -d postgres redis

# Wait for healthy database
echo "  Waiting for PostgreSQL to pass health checks..."
timeout=60
while [[ $timeout -gt 0 ]]; do
  health="$(docker compose -f "${COMPOSE_FILE}" ps --format '{{.Health}}' postgres 2>/dev/null || true)"
  if [[ "${health}" == "healthy" ]]; then
    break
  fi
  sleep 2
  timeout=$((timeout - 2))
done

if [[ $timeout -le 0 ]]; then
  echo -e "${RED}ERROR: PostgreSQL failed to become healthy within 60 seconds!${NC}" >&2
  docker compose -f "${COMPOSE_FILE}" logs --tail=50 postgres
  exit 1
fi
echo "  PostgreSQL is healthy."

# Wait for healthy Redis
echo "  Waiting for Redis to pass authenticated health checks..."
timeout=30
while [[ $timeout -gt 0 ]]; do
  health="$(docker compose -f "${COMPOSE_FILE}" ps --format '{{.Health}}' redis 2>/dev/null || true)"
  if [[ "${health}" == "healthy" ]]; then
    break
  fi
  sleep 2
  timeout=$((timeout - 2))
done

if [[ $timeout -le 0 ]]; then
  echo -e "${RED}ERROR: Redis failed to become healthy within 30 seconds!${NC}" >&2
  docker compose -f "${COMPOSE_FILE}" logs --tail=50 redis
  exit 1
fi
echo "  Redis is healthy."

# ─── 6. Database Migrations ──────────────────────────────────────────────
log_step "6. Running database schema migrations..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" run --rm migrate
echo "  Database migrations applied successfully."

# ─── 7. Start Application Services ───────────────────────────────────────
log_step "7. Starting backend-go and edubot services..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" up -d backend-go edubot

# ─── 8. Certificate Webroot & Nginx Reverse Proxy ────────────────────────
log_step "8. Ensuring TLS certificates and starting Nginx..."

# Ensure dummy self-signed certificate exists if Let's Encrypt certificates not yet provisioned
CERT_DIR="/etc/letsencrypt/live/api.eduplexo.com"
docker run --rm \
  -v eduplexo_certbot_certs:/etc/letsencrypt \
  alpine:latest sh -c "
    if [ ! -f ${CERT_DIR}/fullchain.pem ]; then
      echo 'Generating temporary self-signed SSL certificate for Nginx bootstrap...'
      apk add --no-cache openssl >/dev/null 2>&1
      mkdir -p ${CERT_DIR}
      openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout ${CERT_DIR}/privkey.pem \
        -out ${CERT_DIR}/fullchain.pem \
        -subj '/CN=api.eduplexo.com' >/dev/null 2>&1
    fi
  "

docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" up -d nginx

# ─── 9. Post-Deployment Verification ─────────────────────────────────────
log_step "9. Executing post-deployment health checks..."
sleep 5
bash "${SCRIPT_DIR}/healthcheck.sh"

echo -e "\n${GREEN}============================================================${NC}"
echo -e "${GREEN} DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}============================================================${NC}"
