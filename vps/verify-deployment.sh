#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Production Verification Script
# ═══════════════════════════════════════════════════════════════════════════
# Run this after deployment to verify everything is working

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VPS_DIR="$PROJECT_ROOT/vps"
COMPOSE_FILE="$VPS_DIR/docker-compose.vps.yml"
ENV_FILE="$VPS_DIR/.env.vps"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Production Environment Verification${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# ─── 1. Container Status ──────────────────────────────────────────────────
echo -e "${BLUE}[1/8] Container Status${NC}"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
echo ""

# ─── 2. Git Commit ────────────────────────────────────────────────────────
echo -e "${BLUE}[2/8] Git Version${NC}"
cd "$PROJECT_ROOT"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git rev-parse --short HEAD) - $(git log -1 --pretty=%B | head -1)"
echo "Date:   $(git log -1 --pretty=%cd)"
echo ""

# ─── 3. Backend Health ────────────────────────────────────────────────────
echo -e "${BLUE}[3/8] Backend Health Check${NC}"
if docker exec eduplexo_backend wget -q -O - http://localhost:8080/health/live 2>/dev/null; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
fi
echo ""

# ─── 4. Database Connection ───────────────────────────────────────────────
echo -e "${BLUE}[4/8] Database Connection${NC}"
if docker exec eduplexo_postgres pg_isready -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database is accepting connections${NC}"
else
    echo -e "${RED}✗ Database is not accessible${NC}"
fi
echo ""

# ─── 5. Migration Status ──────────────────────────────────────────────────
echo -e "${BLUE}[5/8] Migration Status${NC}"
LATEST_MIGRATION=$(docker exec eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -t -c "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;" 2>/dev/null | tr -d ' ')
if [ -n "$LATEST_MIGRATION" ]; then
    echo -e "${GREEN}✓ Latest migration: $LATEST_MIGRATION${NC}"
else
    echo -e "${YELLOW}⚠ Could not determine migration status${NC}"
fi
echo ""

# ─── 6. Database Schema ───────────────────────────────────────────────────
echo -e "${BLUE}[6/8] Database Schema Check${NC}"
echo "Tables:"
docker exec eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -c "\dt" 2>/dev/null | grep -E "users|teachers" || echo "Could not query tables"
echo ""

# ─── 7. Foreign Key Constraints ───────────────────────────────────────────
echo -e "${BLUE}[7/8] Foreign Key Constraints${NC}"
docker exec eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -c "
SELECT 
    con.conname AS constraint_name,
    rel.relname AS table_name,
    att.attname AS column_name,
    fnrel.relname AS foreign_table,
    fnatt.attname AS foreign_column
FROM pg_constraint con
JOIN pg_class rel ON con.conrelid = rel.oid
JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
JOIN pg_class fnrel ON con.confrelid = fnrel.oid
JOIN pg_attribute fnatt ON fnatt.attrelid = fnrel.oid AND fnatt.attnum = ANY(con.confkey)
WHERE rel.relname = 'teachers' AND con.contype = 'f'
ORDER BY con.conname;
" 2>/dev/null || echo "Could not query foreign keys"
echo ""

# ─── 8. Recent Logs ───────────────────────────────────────────────────────
echo -e "${BLUE}[8/8] Recent Backend Logs (last 15 lines)${NC}"
docker logs eduplexo_backend --tail 15
echo ""

# ─── Summary ──────────────────────────────────────────────────────────────
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Verification Complete${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Test teacher creation via API"
echo "  2. Check logs for any errors: docker logs eduplexo_backend -f"
echo "  3. Monitor database: docker exec -it eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod}"
echo ""
