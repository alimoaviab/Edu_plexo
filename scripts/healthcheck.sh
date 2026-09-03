#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Comprehensive Production Health Check & Verification Script
# ═══════════════════════════════════════════════════════════════════════════
# Verifies:
#   1. Docker Compose container statuses & exit codes
#   2. PostgreSQL database connectivity & readiness
#   3. Redis 7 cache authentication & pong response
#   4. Go Backend /health, /health/ready, /health/live
#   5. Edubot /chat/health endpoint (if active) or reports dormant state
#   6. Nginx /healthz local reverse-proxy responder
#   7. Public HTTPS endpoints (if DNS/TLS are live)
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

ERRORS=0

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE} Eduplexo Production Health Check — $(date -u +"%Y-%m-%dT%H:%M:%SZ")${NC}"
echo -e "${BLUE}============================================================${NC}"

check_pass() {
  echo -e "  [${GREEN}PASS${NC}] $1"
}

check_fail() {
  echo -e "  [${RED}FAIL${NC}] $1: $2"
  ERRORS=$((ERRORS + 1))
}

check_warn() {
  echo -e "  [${YELLOW}WARN${NC}] $1: $2"
}

# ─── 1. Container Status Check ───────────────────────────────────────────
echo -e "\n${BLUE}1. Inspecting Docker Container States...${NC}"
SERVICES=("postgres" "redis" "backend-go" "nginx")

for svc in "${SERVICES[@]}"; do
  STATUS="$(docker compose -f "${COMPOSE_FILE}" ps --format '{{.State}}' "${svc}" 2>/dev/null || echo "not-found")"
  HEALTH="$(docker compose -f "${COMPOSE_FILE}" ps --format '{{.Health}}' "${svc}" 2>/dev/null || echo "none")"
  
  if [[ "${STATUS}" == "running" ]]; then
    if [[ "${HEALTH}" == "healthy" || "${HEALTH}" == "" ]]; then
      check_pass "Service '${svc}' is running (health: ${HEALTH:-n/a})"
    else
      check_fail "Service '${svc}'" "running but health is '${HEALTH}'"
    fi
  else
    check_fail "Service '${svc}'" "state is '${STATUS}'"
  fi
done

# ─── 2. PostgreSQL Healthcheck ───────────────────────────────────────────
echo -e "\n${BLUE}2. Validating PostgreSQL Database...${NC}"
if docker compose -f "${COMPOSE_FILE}" exec -T postgres pg_isready -q; then
  check_pass "PostgreSQL is accepting connections"
else
  check_fail "PostgreSQL" "pg_isready returned non-zero"
fi

# ─── 3. Redis Authenticated Healthcheck ──────────────────────────────────
echo -e "\n${BLUE}3. Validating Redis Cache Layer...${NC}"
if [[ -f "${ROOT_DIR}/.env" ]]; then
  REDIS_PASSWORD="$(grep -E '^REDIS_PASSWORD=' "${ROOT_DIR}/.env" | cut -d '=' -f2- | tr -d ' "\r')"
fi
REDIS_PASSWORD="${REDIS_PASSWORD:-}"

REDIS_PING="$(docker compose -f "${COMPOSE_FILE}" exec -T redis redis-cli -a "${REDIS_PASSWORD}" ping 2>/dev/null | tr -d '\r\n' || true)"
if [[ "${REDIS_PING}" == *"PONG"* ]]; then
  check_pass "Redis authenticated PING -> PONG"
else
  check_fail "Redis" "authenticated ping failed (got: '${REDIS_PING}')"
fi

# ─── 4. Go Backend API Endpoints ────────────────────────────────────────
echo -e "\n${BLUE}4. Validating Go Backend Endpoints...${NC}"
BACKEND_HEALTH="$(docker compose -f "${COMPOSE_FILE}" exec -T nginx wget -qO- http://backend-go:8080/health 2>/dev/null || true)"
if [[ "${BACKEND_HEALTH}" == *"\"ok\":true"* ]]; then
  check_pass "Backend /health reported healthy: ${BACKEND_HEALTH}"
else
  check_fail "Backend /health" "response was: '${BACKEND_HEALTH}'"
fi

BACKEND_READY="$(docker compose -f "${COMPOSE_FILE}" exec -T nginx wget -qO- http://backend-go:8080/health/ready 2>/dev/null || true)"
if [[ "${BACKEND_READY}" == *"\"ok\":true"* ]]; then
  check_pass "Backend /health/ready verified"
else
  check_fail "Backend /health/ready" "response was: '${BACKEND_READY}'"
fi

BACKEND_LIVE="$(docker compose -f "${COMPOSE_FILE}" exec -T nginx wget -qO- http://backend-go:8080/health/live 2>/dev/null || true)"
if [[ "${BACKEND_LIVE}" == *"\"alive\""* ]]; then
  check_pass "Backend /health/live verified"
else
  check_fail "Backend /health/live" "response was: '${BACKEND_LIVE}'"
fi

# ─── 5. Edubot AI Service Endpoint (Optional / Future AI) ────────────────
echo -e "\n${BLUE}5. Validating Edubot Microservice (Optional)...${NC}"
EDUBOT_RUNNING="$(docker compose -f "${COMPOSE_FILE}" ps --format '{{.State}}' edubot 2>/dev/null || echo "not-found")"
if [[ "${EDUBOT_RUNNING}" == "running" ]]; then
  EDUBOT_HEALTH="$(docker compose -f "${COMPOSE_FILE}" exec -T nginx wget -qO- http://edubot:8001/chat/health 2>/dev/null || true)"
  if [[ "${EDUBOT_HEALTH}" == *"\"status\":"* ]]; then
    check_pass "Edubot /chat/health responded: ${EDUBOT_HEALTH}"
  else
    check_fail "Edubot /chat/health" "response was: '${EDUBOT_HEALTH}'"
  fi
else
  check_pass "Edubot microservice is dormant (disabled for current non-AI release; ready for activation)"
fi

# ─── 6. Nginx Local Health Endpoint ─────────────────────────────────────
echo -e "\n${BLUE}6. Validating Nginx Reverse Proxy...${NC}"
NGINX_LOCAL="$(wget -qO- http://127.0.0.1:80/healthz 2>/dev/null || curl -fsSL http://127.0.0.1:80/healthz 2>/dev/null || true)"
if [[ "${NGINX_LOCAL}" == *"ok"* ]]; then
  check_pass "Nginx local responder (port 80 /healthz) is active"
else
  check_fail "Nginx local" "failed to reach http://127.0.0.1:80/healthz"
fi

# ─── 7. Public HTTPS Endpoints (Optional / Best Effort) ─────────────────
echo -e "\n${BLUE}7. Validating Public Domain Routing...${NC}"
if curl -fsSL --connect-timeout 5 https://api.eduplexo.com/health >/dev/null 2>&1; then
  check_pass "Public HTTPS https://api.eduplexo.com/health is reachable and returns 200"
else
  check_warn "Public HTTPS api.eduplexo.com" "DNS or TLS certificate may not be provisioned yet"
fi

if [[ "${EDUBOT_RUNNING}" == "running" ]]; then
  if curl -fsSL --connect-timeout 5 https://bot.eduplexo.com/chat/health >/dev/null 2>&1; then
    check_pass "Public HTTPS https://bot.eduplexo.com/chat/health is reachable and returns 200"
  else
    check_warn "Public HTTPS bot.eduplexo.com" "DNS or TLS certificate may not be provisioned yet"
  fi
fi

echo -e "\n============================================================"
if [[ ${ERRORS} -eq 0 ]]; then
  echo -e "${GREEN}ALL CRITICAL HEALTH CHECKS PASSED SUCCESSFULLY!${NC}"
  echo -e "============================================================"
  exit 0
else
  echo -e "${RED}HEALTH CHECK FAILED WITH ${ERRORS} ERROR(S).${NC}"
  echo -e "============================================================"
  exit 1
fi
