#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Automated Production Deployment Script
# ═══════════════════════════════════════════════════════════════════════════
# Target Host: Contabo VPS (Ubuntu 24.04 LTS — 212.47.79.212)
# Usage:
#   cd /opt/eduplexo
#   sudo ./scripts/deploy.sh
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_step() {
  echo -e "\n${BLUE}============================================================${NC}"
  echo -e "${BLUE}>> $1${NC}"
  echo -e "${BLUE}============================================================${NC}"
}

# ─── 1. Prerequisite Checks ───────────────────────────────────────────────
log_step "1. Validating deployment prerequisites..."

if ! command -v docker &>/dev/null; then
  echo -e "${RED}ERROR: Docker is not installed or not in PATH!${NC}" >&2
  exit 1
fi

if ! docker compose version &>/dev/null; then
  echo -e "${RED}ERROR: Docker Compose v2 is required!${NC}" >&2
  exit 1
fi

if [[ ! -f "${ROOT_DIR}/.env" ]]; then
  echo -e "${RED}ERROR: Production environment file ${ROOT_DIR}/.env is missing!${NC}" >&2
  echo -e "${YELLOW}Copy .env.prod.example to .env and configure all required secrets.${NC}" >&2
  exit 1
fi

# Ensure correct file permissions on secrets
chmod 600 "${ROOT_DIR}/.env"

# ─── 2. Validate Compose Syntax & Environment Variables ───────────────────
log_step "2. Validating docker-compose.prod.yml configuration..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" config --quiet

# ─── 3. Pre-Deployment Database Backup ───────────────────────────────────
log_step "3. Checking for existing database to backup..."
if docker compose -f "${COMPOSE_FILE}" ps --status running postgres 2>/dev/null | grep -q postgres; then
  echo "  Active PostgreSQL container detected. Executing pre-deployment backup..."
  bash "${SCRIPT_DIR}/backup_db.sh"
else
  echo "  PostgreSQL is not running yet. Skipping pre-deployment backup."
fi

# ─── 4. Build / Update Application Images ────────────────────────────────
log_step "4. Building production container images..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" build backend-go
# Future AI: add edubot to build command when activating Edubot

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
log_step "7. Starting backend-go service..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ROOT_DIR}/.env" up -d backend-go
# Future AI: add edubot to up command when activating Edubot

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
