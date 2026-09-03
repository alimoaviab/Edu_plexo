#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Safe PostgreSQL Production Database Backup Script
# ═══════════════════════════════════════════════════════════════════════════
# Features:
#   - Never deletes existing database data
#   - Creates gzipped, timestamped SQL dumps
#   - Validates dump integrity with gzip -t
#   - Rotates backups older than RETENTION_DAYS
#   - Fails closed on any error (set -euo pipefail)
#   - Never outputs or logs password secrets
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/eduplexo}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"

# Ensure root directory .env is present if run directly
if [[ -f "${ROOT_DIR}/.env" ]]; then
  POSTGRES_USER="${POSTGRES_USER:-$(grep -E '^POSTGRES_USER=' "${ROOT_DIR}/.env" | cut -d '=' -f2- | tr -d ' "\r')}"
  POSTGRES_DB="${POSTGRES_DB:-$(grep -E '^POSTGRES_DB=' "${ROOT_DIR}/.env" | cut -d '=' -f2- | tr -d ' "\r')}"
fi

POSTGRES_USER="${POSTGRES_USER:-eduplexo_app}"
POSTGRES_DB="${POSTGRES_DB:-eduplexo_prod}"

mkdir -p "${BACKUP_DIR}"

BACKUP_FILE="${BACKUP_DIR}/backup_${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

echo "============================================================"
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting PostgreSQL Backup"
echo "  Database: ${POSTGRES_DB}"
echo "  Target:   ${BACKUP_FILE}"
echo "============================================================"

# Check if postgres container is running
if ! docker compose -f "${COMPOSE_FILE}" ps --status running --format '{{.Service}}' | grep -qx "postgres"; then
  echo "ERROR: PostgreSQL service is not currently running in ${COMPOSE_FILE}" >&2
  exit 1
fi

# Execute pg_dump streaming into gzip
docker compose -f "${COMPOSE_FILE}" exec -T postgres \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --clean --if-exists --no-owner --no-privileges \
  | gzip -9 > "${BACKUP_FILE}"

# Validate backup integrity
if [[ ! -s "${BACKUP_FILE}" ]]; then
  echo "ERROR: Backup file was created but is empty: ${BACKUP_FILE}" >&2
  rm -f "${BACKUP_FILE}"
  exit 1
fi

if ! gzip -t "${BACKUP_FILE}"; then
  echo "ERROR: Backup archive failed gzip integrity verification: ${BACKUP_FILE}" >&2
  exit 1
fi

FILE_SIZE="$(du -h "${BACKUP_FILE}" | cut -f1)"
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup successful! Size: ${FILE_SIZE}"

# Prune old backups
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Pruning backups older than ${RETENTION_DAYS} days in ${BACKUP_DIR}..."
find "${BACKUP_DIR}" -type f -name "backup_${POSTGRES_DB}_*.sql.gz" -mtime +"${RETENTION_DAYS}" -exec rm -v {} \; || true

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup procedure completed cleanly."
