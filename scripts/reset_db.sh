#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Safe PostgreSQL Data Reset / Purge Script
# ═══════════════════════════════════════════════════════════════════════════
# Purpose:
#   Completely removes the PostgreSQL data volume on the VPS to start
#   with a fresh, clean database state.
#
# Safety Measures:
#   - Creates an automatic safety backup before deletion (unless --no-backup)
#   - Requires explicit interactive confirmation (unless --force)
#   - Safely stops database dependencies before removing volumes
#   - Only removes the PostgreSQL volume; preserves Redis, SSL, uploads, etc.
#
# Usage:
#   sudo ./scripts/reset_db.sh [OPTIONS]
#
# Options:
#   -f, --force       Skip interactive confirmation prompt
#   --no-backup       Do not create a safety backup before purging data
#   --restart         Automatically start fresh postgres and apply migrations
#   -h, --help        Show this help message
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

FORCE=false
SKIP_BACKUP=false
RESTART=false

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
      echo "  --restart         Start fresh database and apply migrations immediately"
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
echo -e "${BLUE} Eduplexo — PostgreSQL Data Removal / Reset Tool${NC}"
echo -e "${BLUE}============================================================${NC}"
echo -e "Target Compose File : ${COMPOSE_FILE}"
echo -e "Target Volume Name  : ${BOLD}${VOLUME_NAME}${NC}"
echo ""

# Confirmation Prompt
if [[ "${FORCE}" != true ]]; then
  echo -e "${YELLOW}${BOLD}WARNING: This action will PERMANENTLY ERASE all PostgreSQL data!${NC}"
  echo -e "All schemas, tables, school records, users, and audit logs will be deleted."
  echo ""
  read -r -p "Type 'RESET' to confirm deletion of volume [${VOLUME_NAME}]: " CONFIRMATION
  if [[ "${CONFIRMATION}" != "RESET" ]]; then
    echo -e "${GREEN}Aborted. No data was modified.${NC}"
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
      echo -e "${YELLOW}  Backup script failed or PostgreSQL was not running. Proceeding with caution...${NC}"
    fi
  fi
fi

# Stop and remove containers attached to the database
echo -e "\n${BLUE}>> Stopping database and dependent services...${NC}"
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

# Re-create empty volume
echo -e "\n${BLUE}>> Initializing clean volume: ${VOLUME_NAME}...${NC}"
docker volume create "${VOLUME_NAME}" >/dev/null
echo -e "${GREEN}  Clean PostgreSQL volume '${VOLUME_NAME}' initialized.${NC}"

# Optional automatic restart & migration
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

  echo -e "\n${BLUE}>> Running database migrations on fresh database...${NC}"
  docker compose -f "${COMPOSE_FILE}" run --rm migrate

  echo -e "\n${BLUE}>> Starting backend-go...${NC}"
  docker compose -f "${COMPOSE_FILE}" up -d backend-go

  echo -e "\n${GREEN}============================================================${NC}"
  echo -e "${GREEN} DATABASE RESET AND RE-INITIALIZATION COMPLETE!${NC}"
  echo -e "${GREEN}============================================================${NC}"
else
  echo -e "\n${GREEN}============================================================${NC}"
  echo -e "${GREEN} POSTGRESQL DATA SUCCESSFULLY REMOVED!${NC}"
  echo -e "${GREEN}============================================================${NC}"
  echo -e "Next steps to boot fresh database:"
  echo -e "  1. Run migrations and start services:"
  echo -e "     ${BOLD}sudo ./scripts/deploy.sh${NC}"
  echo -e "  OR manually:"
  echo -e "     ${BOLD}docker compose -f docker-compose.prod.yml up -d postgres${NC}"
  echo -e "     ${BOLD}docker compose -f docker-compose.prod.yml run --rm migrate${NC}"
  echo -e "     ${BOLD}docker compose -f docker-compose.prod.yml up -d backend-go${NC}"
fi
