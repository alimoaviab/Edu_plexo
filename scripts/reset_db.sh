#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# EduPlexo — Complete PostgreSQL Database Reset & Bootstrap Script
# ═══════════════════════════════════════════════════════════════════════════
# Purpose:
#   Completely purges all data from PostgreSQL and Redis, applies all 
#   33+ database migrations from scratch, boots backend-go, and ensures
#   Super Admin credentials are ready for fresh production or staging testing.
#
# Usage:
#   sudo ./scripts/reset_db.sh [OPTIONS]
#
# Options:
#   -f, --force       Skip interactive confirmation prompt
#   --no-backup       Skip pre-wipe safety backup
#   --no-restart      Purge volume only without restarting containers
#   -h, --help        Show this help message
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

FORCE=false
SKIP_BACKUP=false
RESTART=true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -f|--force)
      FORCE=true
      shift
      ;;
    --no-backup)
      SKIP_BACKUP=true
      shift
      ;;
    --no-restart)
      RESTART=false
      shift
      ;;
    --restart)
      RESTART=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  -f, --force       Skip interactive confirmation prompt"
      echo "  --no-backup       Skip creating a pre-wipe safety backup"
      echo "  --no-restart      Only purge volumes without restarting"
      echo "  -h, --help        Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}" >&2
      exit 1
      ;;
  esac
done

# Determine compose file and volume name
if [[ -f "${ROOT_DIR}/docker-compose.prod.yml" ]]; then
  COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
  VOLUME_NAME="eduplexo_prod_postgres"
else
  COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
  VOLUME_NAME="eduplexo_postgres_data"
fi

echo -e "${BLUE}============================================================${NC}"
echo -e "${BOLD}${CYAN}   EduPlexo — Complete Database Reset & Bootstrap Tool${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "Target Compose File : ${BOLD}${COMPOSE_FILE}${NC}"
echo -e "Target Volume Name  : ${BOLD}${VOLUME_NAME}${NC}"
echo ""

# Interactive Confirmation
if [[ "${FORCE}" != true ]]; then
  echo -e "${YELLOW}${BOLD}WARNING: This action will PERMANENTLY ERASE all PostgreSQL data!${NC}"
  echo -e "All institutions, owners, subscriptions, payments, and users will be purged."
  echo ""
  read -r -p "Type 'RESET' to confirm complete wipe of [${VOLUME_NAME}]: " CONFIRMATION
  if [[ "${CONFIRMATION}" != "RESET" ]]; then
    echo -e "${GREEN}Aborted. No database data was modified.${NC}"
    exit 0
  fi
fi

# Pre-wipe Safety Backup
if [[ "${SKIP_BACKUP}" != true ]]; then
  if [[ -f "${SCRIPT_DIR}/backup_db.sh" ]]; then
    echo -e "\n${BLUE}>> Creating pre-reset safety backup...${NC}"
    if bash "${SCRIPT_DIR}/backup_db.sh"; then
      echo -e "${GREEN}  Pre-reset backup created successfully.${NC}"
    else
      echo -e "${YELLOW}  Backup script skipped or PostgreSQL was stopped. Proceeding...${NC}"
    fi
  fi
fi

# Stop and remove database & backend containers
echo -e "\n${BLUE}>> Stopping backend, database, and migration services...${NC}"
docker compose -f "${COMPOSE_FILE}" stop backend-go migrate postgres 2>/dev/null || true
docker compose -f "${COMPOSE_FILE}" rm -f -v migrate postgres 2>/dev/null || true

# Remove the PostgreSQL volume
echo -e "\n${BLUE}>> Removing PostgreSQL data volume: ${VOLUME_NAME}...${NC}"
if docker volume inspect "${VOLUME_NAME}" &>/dev/null; then
  docker volume rm -f "${VOLUME_NAME}"
  echo -e "${GREEN}  Volume '${VOLUME_NAME}' removed successfully.${NC}"
else
  echo -e "${YELLOW}  Volume '${VOLUME_NAME}' does not exist or was already removed.${NC}"
fi

# Re-create clean volume
echo -e "\n${BLUE}>> Initializing clean volume: ${VOLUME_NAME}...${NC}"
docker volume create "${VOLUME_NAME}" >/dev/null
echo -e "${GREEN}  Clean PostgreSQL volume '${VOLUME_NAME}' initialized.${NC}"

# Flush Redis cache
echo -e "\n${BLUE}>> Purging Redis cache to prevent stale sessions/locks...${NC}"
docker compose -f "${COMPOSE_FILE}" restart redis 2>/dev/null || docker compose -f "${COMPOSE_FILE}" up -d redis 2>/dev/null || true
echo -e "${GREEN}  Redis cache refreshed.${NC}"

# Restart & Migration Flow
if [[ "${RESTART}" == true ]]; then
  echo -e "\n${BLUE}>> Starting fresh PostgreSQL instance...${NC}"
  docker compose -f "${COMPOSE_FILE}" up -d postgres

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
    exit 1
  fi
  echo -e "${GREEN}  PostgreSQL is healthy and accepting connections.${NC}"

  echo -e "\n${BLUE}>> Applying all 33+ database migrations on clean database...${NC}"
  docker compose -f "${COMPOSE_FILE}" run --rm migrate
  echo -e "${GREEN}  All migrations applied successfully!${NC}"

  echo -e "\n${BLUE}>> Booting backend-go (auto-bootstraps Super Admin & system school)...${NC}"
  docker compose -f "${COMPOSE_FILE}" up -d backend-go

  echo "  Waiting for backend-go to initialize..."
  sleep 4

  echo -e "\n${GREEN}============================================================${NC}"
  echo -e "${GREEN}${BOLD}   DATABASE RESET & RE-INITIALIZATION COMPLETE!${NC}"
  echo -e "${GREEN}============================================================${NC}"
  echo ""
  echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}${BOLD}║                 EDUPLEXO SYSTEM CREDENTIALS                  ║${NC}"
  echo -e "${CYAN}${BOLD}╠══════════════════════════════════════════════════════════════╣${NC}"
  echo -e "${CYAN}${BOLD}║${NC} ${BOLD}1. SUPER ADMIN PORTAL${NC} (Platform Operations & Approvals)      ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   URL      : ${BOLD}https://admin.eduplexo.com/login${NC}                 ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Email    : ${BOLD}${GREEN}super@gmail.com${NC}                                 ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Password : ${BOLD}${GREEN}Test@123${NC}                                        ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Role     : ${BOLD}super_admin${NC}                                     ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}                                                              ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC} ${BOLD}2. OWNER / INSTITUTION PORTAL${NC} (School Management)             ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   URL      : ${BOLD}https://app.eduplexo.com/login${NC}                   ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Email    : ${BOLD}${GREEN}owner@gmail.com${NC}                                 ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Password : ${BOLD}${GREEN}Test@123${NC}                                        ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Role     : ${BOLD}owner${NC}                                           ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}                                                              ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC} ${BOLD}3. NEW OWNER REGISTRATION & EMAIL OTP${NC}                         ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Signup   : ${BOLD}https://app.eduplexo.com/signup${NC}                  ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}   Flow     : 6-digit Brevo OTP verification → 14-day trial    ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}              → Upgrade plan → Upload proof → Super Admin      ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}║${NC}              approves at admin.eduplexo.com/payments          ${CYAN}${BOLD}║${NC}"
  echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
else
  echo -e "\n${GREEN}============================================================${NC}"
  echo -e "${GREEN} POSTGRESQL DATA SUCCESSFULLY REMOVED!${NC}"
  echo -e "${GREEN}============================================================${NC}"
  echo -e "Next steps to boot fresh database:"
  echo -e "  Run: ${BOLD}sudo ./scripts/reset_db.sh --restart -f${NC}"
fi
