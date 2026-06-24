#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# VPS Diagnostic Check Script
# ═══════════════════════════════════════════════════════════════════════════
# Run this on VPS to collect diagnostic information

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "EduPlexo VPS Diagnostic Report"
echo "Generated: $(date)"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "1. GIT STATUS"
echo "─────────────────────────────────────────────────────────────────"
git log -1 --oneline
echo "Current branch: $(git branch --show-current)"
echo ""

echo "2. DOCKER STATUS"
echo "─────────────────────────────────────────────────────────────────"
docker --version
docker compose version
echo ""
echo "Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "3. ENVIRONMENT FILES"
echo "─────────────────────────────────────────────────────────────────"
ls -la .env* vps/.env* 2>/dev/null || echo "No .env files found"
echo ""

echo "4. BACKEND BUILD CHECK"
echo "─────────────────────────────────────────────────────────────────"
if [ -f "backend-go/go.mod" ]; then
    echo "✓ Go module exists"
    cd backend-go
    go version
    echo "Go dependencies:"
    go list -m all | head -5
    cd ..
else
    echo "✗ Go module not found"
fi
echo ""

echo "5. DATABASE CONNECTION"
echo "─────────────────────────────────────────────────────────────────"
if docker ps | grep -q postgres; then
    echo "✓ PostgreSQL container running"
    docker exec -it eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -c "\dt" 2>/dev/null || echo "Cannot connect to database"
else
    echo "✗ PostgreSQL container not running"
fi
echo ""

echo "6. RECENT LOGS (if backend running)"
echo "─────────────────────────────────────────────────────────────────"
if docker ps | grep -q backend; then
    docker logs eduplexo_backend --tail 30
else
    echo "Backend not running"
fi
echo ""

echo "7. TEACHER TABLE SCHEMA"
echo "─────────────────────────────────────────────────────────────────"
if docker ps | grep -q postgres; then
    docker exec eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -c "\d teachers" 2>/dev/null || echo "Cannot query schema"
fi
echo ""

echo "8. USERS TABLE SAMPLE"
echo "─────────────────────────────────────────────────────────────────"
if docker ps | grep -q postgres; then
    docker exec eduplexo_postgres psql -U ${POSTGRES_USER:-eduplexo_app} -d ${POSTGRES_DB:-eduplexo_prod} -c "SELECT id, email, role FROM users LIMIT 5;" 2>/dev/null || echo "Cannot query users"
fi
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "Diagnostic check complete"
echo "═══════════════════════════════════════════════════════════════════"
