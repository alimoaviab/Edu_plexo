# 🚀 Simple VPS Deployment Guide

## Quick Deploy (2 Commands)

```bash
cd ~/prictice-projrct
git pull && docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

## What This Does

1. **Pulls latest code** from GitHub
2. **Builds** the Go backend
3. **Runs migrations** on PostgreSQL
4. **Starts** all services:
   - Nginx (HTTP-only on port 80)
   - Backend Go API (port 8080)
   - PostgreSQL (internal port 5432)
   - Redis (internal port 6379)

## Check Status

```bash
# View running containers
docker ps

# Check backend logs
docker logs vps-backend-go-1 -f

# Check nginx logs
docker logs vps-nginx-1 -f

# Test health endpoint
curl http://localhost/health
curl http://api.eduplexo.com/health
```

## Test API Endpoints

```bash
# Health check
curl http://api.eduplexo.com/health

# Login test
curl -X POST http://api.eduplexo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"school@gmail.com","password":"3000"}'
```

## Architecture

```
Internet (Port 80)
    ↓
Nginx Container (port 80)
    ↓
Backend Go Container (port 8080)
    ↓
PostgreSQL + Redis (internal)
```

## DNS Configuration

- **api.eduplexo.com** → 206.189.94.7 (A record)
- Frontend on Vercel points to this API

## Important Notes

1. **No SSL yet** - Using HTTP-only configuration for now
2. **Edubot disabled** - Commented out in docker-compose
3. **Port 8080 exposed** - For direct backend access if needed
4. **Teacher Creation Fix** - Applied to handle user creation edge cases

## Troubleshooting

### Nginx won't start
```bash
# Stop all containers
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down

# Remove old nginx containers
docker rm -f vps-nginx-1 temp-nginx 2>/dev/null

# Start fresh
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up -d
```

### Backend errors
```bash
# Check logs
docker logs vps-backend-go-1 --tail 100

# Restart backend only
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps restart backend-go
```

### Database issues
```bash
# Check if migrations ran
docker logs vps-migrate-1

# Connect to database
docker exec -it vps-postgres-1 psql -U eduplexo_user -d eduplexo_vps
```

## Adding SSL Later

When ready to add SSL certificates:

1. Stop services
2. Obtain Let's Encrypt certificates
3. Change docker-compose to use `nginx.vps.conf` instead of `nginx-simple-http.conf`
4. Uncomment port 443 in nginx service
5. Restart services
