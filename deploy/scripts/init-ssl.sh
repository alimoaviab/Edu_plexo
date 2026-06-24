#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo — Initialize SSL Certificates with Let's Encrypt
# ═══════════════════════════════════════════════════════════════════════════
# Run this ONCE after first deployment to obtain SSL certificates.
#
# Prerequisites:
#   - DNS A record for api.eduplexo.com pointing to VPS IP
#   - .env.production file configured with DOMAIN and CERTBOT_EMAIL
#
# Usage: bash deploy/scripts/init-ssl.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment
if [ -f "$DEPLOY_DIR/.env.production" ]; then
    source "$DEPLOY_DIR/.env.production"
else
    echo "ERROR: .env.production not found. Copy from .env.production.example"
    exit 1
fi

API_DOMAIN="${API_DOMAIN:-api.eduplexo.com}"
EMAIL="${CERTBOT_EMAIL:-admin@eduplexo.com}"

echo "═══════════════════════════════════════════════════════════════════"
echo "Initializing SSL for: $API_DOMAIN"
echo "Email: $EMAIL"
echo "═══════════════════════════════════════════════════════════════════"

# Create certbot directories
mkdir -p "$DEPLOY_DIR/certbot/conf"
mkdir -p "$DEPLOY_DIR/certbot/www"

# Create frontend network if not exists
docker network create eduplexo_frontend 2>/dev/null || true

# Create a temporary nginx config without SSL for initial cert request
cat > "$DEPLOY_DIR/nginx/conf.d/api.conf.tmp" <<EOF
server {
    listen 80;
    server_name $API_DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location /nginx-health {
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    location / {
        return 200 "Waiting for SSL setup...\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Temporarily replace the SSL config
mv "$DEPLOY_DIR/nginx/conf.d/api.conf" "$DEPLOY_DIR/nginx/conf.d/api.conf.ssl"
mv "$DEPLOY_DIR/nginx/conf.d/api.conf.tmp" "$DEPLOY_DIR/nginx/conf.d/api.conf"

# Start nginx only (without backend dependency)
docker compose -f "$DEPLOY_DIR/docker-compose.vps.yml" \
    --env-file "$DEPLOY_DIR/.env.production" \
    up --no-deps -d nginx 2>/dev/null || true

# Wait for nginx to be ready
sleep 5

# Request certificate
echo "Requesting certificate from Let's Encrypt..."
docker run --rm \
    -v "$DEPLOY_DIR/certbot/conf:/etc/letsencrypt" \
    -v "$DEPLOY_DIR/certbot/www:/var/www/certbot" \
    --network eduplexo_frontend \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$API_DOMAIN"

# Check if certificate was obtained
if [ -f "$DEPLOY_DIR/certbot/conf/live/$API_DOMAIN/fullchain.pem" ]; then
    echo "✓ SSL certificate obtained successfully!"
else
    echo "ERROR: Failed to obtain SSL certificate"
    echo "Make sure DNS is pointing to this server"
    # Restore original config
    mv "$DEPLOY_DIR/nginx/conf.d/api.conf.ssl" "$DEPLOY_DIR/nginx/conf.d/api.conf"
    docker compose -f "$DEPLOY_DIR/docker-compose.vps.yml" down
    exit 1
fi

# Restore the SSL nginx config
mv "$DEPLOY_DIR/nginx/conf.d/api.conf.ssl" "$DEPLOY_DIR/nginx/conf.d/api.conf"

# Stop the temporary nginx
docker compose -f "$DEPLOY_DIR/docker-compose.vps.yml" \
    --env-file "$DEPLOY_DIR/.env.production" \
    down

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "SSL setup complete! Now run: bash deploy/scripts/deploy.sh"
echo "═══════════════════════════════════════════════════════════════════"
