#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — PostgreSQL Backup Script
# ═══════════════════════════════════════════════════════════════════════════
# Creates compressed database backups with rotation.
#
# Usage:
#   bash deploy/scripts/backup-db.sh           # Manual backup
#   Add to crontab for automated backups:
#   0 2 * * * /opt/eduplexo/deploy/scripts/backup-db.sh >> /var/log/eduplexo-backup.log 2>&1

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$DEPLOY_DIR/backups"
ENV_FILE="$DEPLOY_DIR/.env.production"
RETENTION_DAYS=14
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Load environment
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
fi

DB_NAME="${POSTGRES_DB:-eduplexo_prod}"
DB_USER="${POSTGRES_USER:-eduplexo_app}"
CONTAINER="eduplexo_postgres"

echo "[$(date)] Starting backup of $DB_NAME..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if postgres container is running
if ! docker ps --format '{{.Names}}' | grep -q "$CONTAINER"; then
    echo "[$(date)] ERROR: PostgreSQL container is not running"
    exit 1
fi

# Create backup
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

docker exec "$CONTAINER" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --compress=6 \
    --verbose \
    -f "/backups/${DB_NAME}_${TIMESTAMP}.dump" 2>&1

# Also create a plain SQL backup (smaller, for quick restores)
docker exec "$CONTAINER" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=plain \
    | gzip > "$BACKUP_FILE"

echo "[$(date)] Backup created: $BACKUP_FILE"
echo "[$(date)] Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Rotate old backups (keep last N days)
echo "[$(date)] Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# List remaining backups
echo "[$(date)] Current backups:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "  (none)"

echo "[$(date)] Backup complete!"
