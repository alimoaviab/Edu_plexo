#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — PostgreSQL Restore Script
# ═══════════════════════════════════════════════════════════════════════════
# Restores database from a backup file.
#
# Usage:
#   bash deploy/scripts/restore-db.sh backups/eduplexo_prod_20250516_020000.sql.gz

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$DEPLOY_DIR/.env.production"

if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
fi

DB_NAME="${POSTGRES_DB:-eduplexo_prod}"
DB_USER="${POSTGRES_USER:-eduplexo_app}"
CONTAINER="eduplexo_postgres"

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <backup-file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh "$DEPLOY_DIR/backups/"*.sql.gz 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "═══════════════════════════════════════════════════════════════════"
echo "WARNING: This will REPLACE the current database with the backup!"
echo ""
echo "  Database: $DB_NAME"
echo "  Backup:   $BACKUP_FILE"
echo "  Size:     $(du -h "$BACKUP_FILE" | cut -f1)"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
read -p "Are you sure? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo "[$(date)] Stopping backend..."
docker stop eduplexo_backend 2>/dev/null || true

echo "[$(date)] Dropping and recreating database..."
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "[$(date)] Restoring from backup..."
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"

echo "[$(date)] Starting backend..."
docker start eduplexo_backend

echo "[$(date)] Restore complete!"
