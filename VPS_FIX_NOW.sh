#!/bin/bash
# VPS Quick Fix Script - Run this on VPS

echo "🔧 Fixing port 80 conflict..."

# Stop all running containers
echo "📦 Stopping all containers..."
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down 2>/dev/null || true
docker compose down 2>/dev/null || true

# Remove any orphaned nginx containers
echo "🗑️  Removing old nginx containers..."
docker rm -f prictice-projrct-nginx-1 2>/dev/null || true
docker rm -f vps-nginx-1 2>/dev/null || true
docker rm -f temp-nginx 2>/dev/null || true

# Check if port 80 is still in use
echo "🔍 Checking port 80..."
if ss -tlnp | grep -q ':80 '; then
    echo "⚠️  Port 80 still in use. Finding process..."
    PORT_PID=$(ss -tlnp | grep ':80 ' | grep -oP 'pid=\K[0-9]+' | head -1)
    if [ ! -z "$PORT_PID" ]; then
        echo "🛑 Killing process $PORT_PID on port 80..."
        kill -9 $PORT_PID 2>/dev/null || true
        sleep 2
    fi
fi

# Start VPS services (correct docker-compose file)
echo "🚀 Starting VPS services..."
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "✅ Checking status..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🧪 Testing health endpoint..."
sleep 3
curl -s http://localhost/health || echo "❌ Health check failed"

echo ""
echo "🌐 Testing domain..."
curl -s http://api.eduplexo.com/health || echo "❌ Domain check failed"

echo ""
echo "✅ Done! Check the output above."
