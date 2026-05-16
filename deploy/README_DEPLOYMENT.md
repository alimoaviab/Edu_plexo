# Eduplexo — VPS Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VERCEL (CDN)                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Landing App │  │  School App  │  │ Super Admin  │              │
│  │ eduplexo.com │  │app.eduplexo  │  │admin.eduplexo│              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    HOSTINGER KVM 2 VPS                               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Nginx (Port 80/443)                       │    │
│  │  • SSL termination (Let's Encrypt)                          │    │
│  │  • Rate limiting (60 req/min API, 10 req/min auth)          │    │
│  │  • Gzip compression                                         │    │
│  │  • Security headers                                         │    │
│  │  • WebSocket upgrade                                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Go Backend (Port 8080 internal)                 │    │
│  │  • REST API + WebSocket                                     │    │
│  │  • CORS for Vercel domains                                  │    │
│  │  • JWT authentication                                       │    │
│  │  • Graceful shutdown                                        │    │
│  │  • Memory limit: 512MB                                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                    │                    │                             │
│                    ▼                    ▼                             │
│  ┌──────────────────────┐  ┌──────────────────────┐                 │
│  │   PostgreSQL 16      │  │      Redis 7         │                 │
│  │  • Tuned for 4GB RAM │  │  • 128MB maxmemory   │                 │
│  │  • Persistent volume │  │  • AOF persistence   │                 │
│  │  • Daily backups     │  │  • Password auth     │                 │
│  └──────────────────────┘  └──────────────────────┘                 │
│                                                                     │
│  Networks:                                                          │
│    frontend (nginx ↔ internet)                                      │
│    backend  (nginx ↔ backend-go)                                    │
│    db       (backend-go ↔ postgres/redis) [internal only]           │
└─────────────────────────────────────────────────────────────────────┘
```

## VPS Specs (Hostinger KVM 2)

| Resource | Allocation |
|----------|-----------|
| RAM | 4 GB |
| CPU | 2 vCPU |
| Storage | 50 GB NVMe |
| OS | Ubuntu 24.04 |
| Bandwidth | 4 TB |

### Memory Budget

| Service | Limit | Reserved |
|---------|-------|----------|
| PostgreSQL | 1536 MB | 512 MB |
| Go Backend | 640 MB | 256 MB |
| Redis | 192 MB | 64 MB |
| Nginx | 128 MB | 32 MB |
| System + Swap | ~1500 MB | — |
| **Total** | **~2500 MB** | **~864 MB** |

---

## Quick Start (First-Time Deployment)

### Prerequisites

1. Hostinger KVM 2 VPS with Ubuntu 24.04
2. SSH access (key-based)
3. Domain DNS configured:
   - `api.eduplexo.com` → VPS IP address (A record)
4. Frontends deployed on Vercel:
   - `eduplexo.com` (landing)
   - `app.eduplexo.com` (school app)
   - `admin.eduplexo.com` (super admin)

### Step 1: Initial VPS Setup

```bash
# SSH into VPS as root
ssh root@YOUR_VPS_IP

# Download and run setup script
curl -sSL https://raw.githubusercontent.com/YOUR_REPO/deploy/scripts/setup-vps.sh | bash

# OR clone first, then run:
git clone https://github.com/YOUR_REPO/eduplexo.git /opt/eduplexo
cd /opt/eduplexo
bash deploy/scripts/setup-vps.sh
```

This installs Docker, configures firewall, fail2ban, swap, and creates the `deploy` user.

### Step 2: Configure Environment

```bash
# Switch to deploy user
su - deploy
cd /opt/eduplexo/deploy

# Create production environment file
cp .env.production.example .env.production

# Generate secrets and edit
openssl rand -base64 32  # Use for JWT_SECRET
openssl rand -base64 32  # Use for POSTGRES_PASSWORD
openssl rand -base64 24  # Use for REDIS_PASSWORD

nano .env.production
```

### Step 3: Initialize SSL

```bash
# Make sure DNS is pointing to VPS first!
# Verify: dig api.eduplexo.com +short
bash deploy/scripts/init-ssl.sh
```

### Step 4: Deploy

```bash
bash deploy/scripts/deploy.sh
```

### Step 5: Verify

```bash
# Check status
bash deploy/scripts/status.sh

# Test API
curl https://api.eduplexo.com/health

# Check logs
bash deploy/scripts/logs.sh backend
```

### Step 6: Setup Automated Backups

```bash
# Add to crontab
crontab -e

# Add these lines:
# Daily backup at 2 AM
0 2 * * * /opt/eduplexo/deploy/scripts/backup-db.sh >> /var/log/eduplexo-backup.log 2>&1

# SSL renewal check every Monday at 3 AM
0 3 * * 1 /opt/eduplexo/deploy/scripts/renew-ssl.sh >> /var/log/eduplexo-ssl.log 2>&1
```

---

## Deployment Commands

### Deploy/Update

```bash
cd /opt/eduplexo

# Standard deploy (pulls code, builds, deploys)
bash deploy/scripts/deploy.sh

# Force rebuild (no cache)
bash deploy/scripts/deploy.sh --quick
```

### Service Management

```bash
cd /opt/eduplexo/deploy

# Start all services
docker compose -f docker-compose.vps.yml --env-file .env.production up -d

# Stop all services
docker compose -f docker-compose.vps.yml --env-file .env.production down

# Restart specific service
docker compose -f docker-compose.vps.yml --env-file .env.production restart backend-go

# View logs
bash scripts/logs.sh           # All
bash scripts/logs.sh backend   # Backend only
bash scripts/logs.sh postgres  # Database only
bash scripts/logs.sh nginx     # Proxy only

# Check status
bash scripts/status.sh
```

### Database Operations

```bash
# Manual backup
bash deploy/scripts/backup-db.sh

# Restore from backup
bash deploy/scripts/restore-db.sh deploy/backups/eduplexo_prod_20250516_020000.sql.gz

# Connect to database directly
docker exec -it eduplexo_postgres psql -U eduplexo_app -d eduplexo_prod

# Run specific migration
docker compose -f deploy/docker-compose.vps.yml --env-file deploy/.env.production run --rm migrate \
    -path /migrations -database "postgres://..." up 1
```

### SSL Management

```bash
# Manual renewal
bash deploy/scripts/renew-ssl.sh

# Check certificate expiry
docker run --rm -v ./deploy/certbot/conf:/etc/letsencrypt certbot/certbot certificates
```

---

## Security Hardening

### Firewall (UFW)

```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

Only SSH, HTTP, and HTTPS are exposed. PostgreSQL and Redis are NOT accessible from the internet.

### Fail2Ban

- SSH: 3 failed attempts → 24h ban
- Default: 5 failed attempts → 1h ban

### Docker Security

- Non-root container user (`nonroot`)
- No shell in production image (distroless)
- Internal-only database network
- Redis dangerous commands disabled (FLUSHALL, FLUSHDB, DEBUG)
- Resource limits on all containers
- Read-only volume mounts where possible

### Network Isolation

```
frontend network: nginx ↔ internet
backend network:  nginx ↔ backend-go
db network:       backend-go ↔ postgres/redis (internal, no internet)
```

### Additional Recommendations

1. **SSH Keys Only** — Password auth is disabled
2. **Regular Updates** — Automatic security updates enabled
3. **Log Monitoring** — Check `/var/log/auth.log` for suspicious activity
4. **Backup Verification** — Test restore monthly
5. **Secret Rotation** — Rotate JWT_SECRET quarterly

---

## CORS Configuration

The Go backend handles CORS via its middleware. The `ALLOWED_ORIGINS` environment variable must include all Vercel frontend domains:

```env
ALLOWED_ORIGINS=https://app.eduplexo.com,https://admin.eduplexo.com,https://eduplexo.com
```

Nginx also handles OPTIONS preflight as a safety net for edge cases.

### Vercel Frontend Configuration

Each Vercel frontend should have:

```env
# school-react-app (app.eduplexo.com)
VITE_API_URL=https://api.eduplexo.com

# super-admin-app (admin.eduplexo.com)
VITE_API_URL=https://api.eduplexo.com

# landing-app (eduplexo.com)
VITE_APP_URL=https://app.eduplexo.com
```

---

## Monitoring

### Built-in Health Checks

```bash
# Backend health
curl https://api.eduplexo.com/health

# Nginx health (internal)
curl http://localhost/nginx-health
```

### Docker Health Status

```bash
docker inspect --format='{{.State.Health.Status}}' eduplexo_backend
docker inspect --format='{{.State.Health.Status}}' eduplexo_postgres
docker inspect --format='{{.State.Health.Status}}' eduplexo_redis
docker inspect --format='{{.State.Health.Status}}' eduplexo_nginx
```

### Resource Monitoring

```bash
# Real-time container stats
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# System overview
htop
```

### Prometheus Metrics

The backend exposes `/metrics` (restricted to internal network). To set up monitoring:

1. Install Prometheus + Grafana on a separate monitoring server
2. Configure Prometheus to scrape `http://VPS_IP:8080/metrics` (via SSH tunnel)
3. Import Grafana dashboards for Go runtime metrics

### Recommended Alerts

| Metric | Threshold | Action |
|--------|-----------|--------|
| Memory usage | > 85% | Scale up or optimize |
| Disk usage | > 80% | Clean logs/backups |
| Response time | > 2s p95 | Investigate queries |
| Error rate | > 5% | Check logs |
| SSL expiry | < 14 days | Run renewal |

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker logs eduplexo_backend --tail=50

# Common issues:
# - DATABASE_URL wrong → check .env.production
# - Port conflict → check nothing else on 8080
# - Migration failed → check migrate logs
docker logs eduplexo_migrate
```

### Database connection refused

```bash
# Check postgres is running
docker ps | grep postgres

# Check postgres logs
docker logs eduplexo_postgres --tail=20

# Test connection from backend network
docker exec eduplexo_backend wget -qO- http://localhost:8080/health
```

### SSL certificate issues

```bash
# Check certificate status
docker run --rm -v ./deploy/certbot/conf:/etc/letsencrypt certbot/certbot certificates

# Force renewal
docker run --rm -v ./deploy/certbot/conf:/etc/letsencrypt \
    -v ./deploy/certbot/www:/var/www/certbot \
    certbot/certbot renew --force-renewal

# Reload nginx
docker exec eduplexo_nginx nginx -s reload
```

### Out of memory

```bash
# Check what's using memory
docker stats --no-stream

# Reduce Go memory limit in docker-compose.vps.yml
# GOMEMLIMIT: "384MiB"

# Reduce PostgreSQL shared_buffers
# -c shared_buffers=128MB

# Clear Docker build cache
docker builder prune -f
```

### Nginx 502 Bad Gateway

```bash
# Backend is down or not healthy
docker logs eduplexo_backend --tail=20

# Restart backend
docker restart eduplexo_backend

# Check nginx can reach backend
docker exec eduplexo_nginx wget -qO- http://backend-go:8080/health/live
```

---

## File Structure

```
deploy/
├── docker-compose.vps.yml          # Production compose (VPS only)
├── .env.production.example          # Environment template
├── .env.production                  # Actual secrets (git-ignored)
├── .gitignore                       # Ignore secrets/backups
├── README_DEPLOYMENT.md             # This file
│
├── dockerfiles/
│   └── Dockerfile.backend           # Optimized multi-stage Go build
│
├── nginx/
│   ├── nginx.conf                   # Main nginx config
│   └── conf.d/
│       ├── default.conf             # HTTP redirect + health
│       └── api.conf                 # API server block (SSL)
│
├── certbot/                         # SSL certificates (git-ignored)
│   ├── conf/                        # Let's Encrypt data
│   └── www/                         # ACME challenge webroot
│
├── backups/                         # Database backups (git-ignored)
│
└── scripts/
    ├── setup-vps.sh                 # One-time VPS setup
    ├── init-ssl.sh                  # One-time SSL initialization
    ├── deploy.sh                    # Deploy/update script
    ├── backup-db.sh                 # Database backup
    ├── restore-db.sh               # Database restore
    ├── renew-ssl.sh                # SSL renewal
    ├── logs.sh                      # Log viewer
    └── status.sh                    # Status checker
```

---

## Updating the Deployment

### Code Updates

```bash
ssh deploy@YOUR_VPS_IP
cd /opt/eduplexo
bash deploy/scripts/deploy.sh
```

### Environment Variable Changes

```bash
nano deploy/.env.production
# Edit variables

# Restart affected services
docker compose -f deploy/docker-compose.vps.yml --env-file deploy/.env.production up -d backend-go
```

### Database Schema Changes

New migrations are automatically applied during deployment. To run manually:

```bash
docker compose -f deploy/docker-compose.vps.yml --env-file deploy/.env.production run --rm migrate \
    -path /migrations \
    -database "postgres://user:pass@postgres:5432/db?sslmode=disable" \
    up
```

### Nginx Config Changes

```bash
# Edit config
nano deploy/nginx/conf.d/api.conf

# Test config
docker exec eduplexo_nginx nginx -t

# Reload (zero-downtime)
docker exec eduplexo_nginx nginx -s reload
```

---

## Disaster Recovery

### Full Recovery Procedure

1. Provision new VPS
2. Run `setup-vps.sh`
3. Clone repository
4. Copy `.env.production` from secure backup
5. Copy latest database backup
6. Run `init-ssl.sh`
7. Run `restore-db.sh` with backup file
8. Run `deploy.sh`
9. Update DNS if IP changed

### Backup Strategy

| What | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily 2 AM | 14 days | VPS `/opt/eduplexo/deploy/backups/` |
| Code | Every push | Unlimited | GitHub |
| Secrets | On change | Secure vault | Password manager |
| SSL Certs | Auto-renewed | N/A | Certbot manages |

---

## Performance Optimization (Low-RAM VPS)

### Go Backend

- `GOMAXPROCS=2` — Match vCPU count
- `GOMEMLIMIT=512MiB` — Prevent OOM kills
- Distroless image (~12MB) — Minimal attack surface

### PostgreSQL

- `shared_buffers=256MB` — 25% of available RAM for PG
- `effective_cache_size=768MB` — OS cache estimate
- `max_connections=50` — Reduced from default 100
- `jit=off` — Disable JIT (saves memory, minimal perf impact)
- `huge_pages=off` — Not available on most VPS

### Redis

- `maxmemory 128mb` — Strict limit
- `maxmemory-policy allkeys-lru` — Evict least-recently-used
- AOF persistence with `everysec` fsync

### Nginx

- `worker_connections 2048` — Sufficient for API traffic
- Keepalive connections to backend (reuse TCP)
- Gzip compression level 4 (good ratio vs CPU)

### System

- 2GB swap with `swappiness=10`
- Docker `live-restore` enabled
- Log rotation configured

---

## Domain Configuration

### DNS Records (at your registrar)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api | YOUR_VPS_IP | 300 |
| A | @ | Vercel IP | Auto |
| CNAME | app | cname.vercel-dns.com | Auto |
| CNAME | admin | cname.vercel-dns.com | Auto |

### Vercel Project Settings

Each frontend project on Vercel:
1. Settings → Domains → Add custom domain
2. Settings → Environment Variables → Set `VITE_API_URL=https://api.eduplexo.com`

---

## Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Hostinger KVM 2 | ~$12/month |
| Domain (eduplexo.com) | ~$1/month |
| SSL (Let's Encrypt) | Free |
| Vercel (3 frontends) | Free tier |
| **Total** | **~$13/month** |
