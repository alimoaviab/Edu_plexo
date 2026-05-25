# Finance System - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the Finance Management System to production.

## Prerequisites

- Docker (optional, for containerization)
- PostgreSQL 12+ (for production database)
- Redis 6+ (optional, for caching)
- Node.js 18+ (for frontend build)
- Go 1.21+ (for backend build)
- Vercel account (for frontend hosting)
- Server/VPS for backend (AWS, DigitalOcean, etc.)

## Backend Deployment

### Option 1: Direct Server Deployment

#### 1. Prepare the Server

```bash
# SSH into your server
ssh user@your-server.com

# Install Go (if not already installed)
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Install Redis (optional)
sudo apt-get install redis-server
```

#### 2. Clone and Build

```bash
# Clone repository
git clone https://github.com/yourusername/eduplexo.git
cd eduplexo/backend-go

# Install dependencies
go mod download

# Build the application
go build -o server ./cmd/server
```

#### 3. Configure Environment

Create `.env.prod`:
```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/eduplexo_prod
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
APP_NAME=Eduplexo
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash
```

#### 4. Run Database Migrations

```bash
# Connect to PostgreSQL
psql -U postgres -d eduplexo_prod

# Run migrations
\i migrations/001_initial.sql
\i migrations/002_finance_system.sql
```

#### 5. Start the Server

```bash
# Using systemd (recommended)
sudo tee /etc/systemd/system/eduplexo.service > /dev/null <<EOF
[Unit]
Description=Eduplexo Backend
After=network.target

[Service]
Type=simple
User=eduplexo
WorkingDirectory=/home/eduplexo/eduplexo/backend-go
ExecStart=/home/eduplexo/eduplexo/backend-go/server
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable eduplexo
sudo systemctl start eduplexo
```

Or run directly:
```bash
./server
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o server ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/server .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080
CMD ["./server"]
```

#### 2. Build and Push

```bash
# Build image
docker build -t eduplexo-backend:latest .

# Tag for registry
docker tag eduplexo-backend:latest your-registry/eduplexo-backend:latest

# Push to registry
docker push your-registry/eduplexo-backend:latest
```

#### 3. Run Container

```bash
docker run -d \
  --name eduplexo-backend \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/eduplexo \
  -e REDIS_URL=redis://redis:6379 \
  -e JWT_SECRET=your-secret \
  your-registry/eduplexo-backend:latest
```

### Option 3: Cloud Deployment (AWS/GCP/Azure)

#### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p go1.21 eduplexo-backend

# Create environment
eb create eduplexo-prod

# Deploy
eb deploy
```

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/eduplexo-backend

# Deploy
gcloud run deploy eduplexo-backend \
  --image gcr.io/PROJECT_ID/eduplexo-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql://...
```

## Frontend Deployment

### Vercel Deployment (Recommended)

#### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

#### 2. Configure Environment

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

#### 3. Set Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add `VITE_API_URL` = `https://api.yourdomain.com`

#### 4. Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### Alternative: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Alternative: Self-Hosted

```bash
# Build
npm run build

# Copy dist folder to web server
scp -r dist/* user@server:/var/www/eduplexo-admin/

# Configure nginx
sudo tee /etc/nginx/sites-available/eduplexo-admin > /dev/null <<EOF
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

    root /var/www/eduplexo-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.yourdomain.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/eduplexo-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Database Setup

### PostgreSQL Production Setup

```bash
# Connect as postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE eduplexo_prod;

# Create user
CREATE USER eduplexo_user WITH PASSWORD 'strong_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE eduplexo_prod TO eduplexo_user;

# Connect to database
\c eduplexo_prod

# Run migrations
\i migrations/001_initial.sql
\i migrations/002_finance_system.sql

# Verify tables
\dt
```

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/eduplexo"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U eduplexo_user eduplexo_prod | gzip > $BACKUP_DIR/eduplexo_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d api.yourdomain.com -d admin.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring & Logging

### Application Monitoring

```bash
# Install monitoring tools
sudo apt-get install htop iotop nethogs

# Monitor application
htop -p $(pgrep -f "eduplexo")
```

### Logging Setup

```bash
# Configure systemd logging
journalctl -u eduplexo -f

# Or use external logging (e.g., ELK Stack)
# Configure in application
```

### Health Checks

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl https://admin.yourdomain.com/
```

## Performance Optimization

### Backend Optimization

```bash
# Enable gzip compression (already in code)
# Configure connection pooling
DATABASE_URL=postgresql://user:pass@localhost/db?sslmode=require&pool_size=20

# Enable Redis caching
REDIS_URL=redis://localhost:6379
```

### Frontend Optimization

```bash
# Already configured in vite.config.ts
# - Code splitting
# - Minification
# - Asset optimization
# - Gzip compression
```

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Firewall configured (only allow necessary ports)
- [ ] Database password changed from default
- [ ] JWT secret changed from default
- [ ] CORS origins configured correctly
- [ ] Rate limiting enabled
- [ ] DDoS protection enabled
- [ ] Regular backups scheduled
- [ ] Security headers configured
- [ ] API keys rotated
- [ ] Logs monitored for suspicious activity
- [ ] Database encryption enabled

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl -H "Authorization: Bearer {token}" \
  https://api.yourdomain.com/health
```

Expected response:
```json
{
  "ok": true,
  "status": "healthy",
  "checks": {
    "postgres": true,
    "redis": true,
    "memory": true
  }
}
```

### 2. Frontend Accessibility

```bash
curl https://admin.yourdomain.com/
```

Should return HTML with React app.

### 3. API Functionality

```bash
# Test login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"eduplexo@gmail.com","password":"Test@123"}'

# Test finance endpoint
curl https://api.yourdomain.com/api/super-admin/finance/dashboard \
  -H "Authorization: Bearer {token}"
```

### 4. Database Connectivity

```bash
# From backend server
psql -U eduplexo_user -d eduplexo_prod -c "SELECT COUNT(*) FROM school_packages;"
```

## Rollback Procedure

### If Deployment Fails

```bash
# Backend rollback
git revert HEAD
go build -o server ./cmd/server
systemctl restart eduplexo

# Frontend rollback (Vercel)
# Automatic - just redeploy previous version
vercel rollback
```

## Scaling Considerations

### Horizontal Scaling

```bash
# Load balancer configuration (nginx)
upstream backend {
    server api1.yourdomain.com:8080;
    server api2.yourdomain.com:8080;
    server api3.yourdomain.com:8080;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
}
```

### Database Scaling

- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Partitioning for large tables
- Archive old data

### Caching Strategy

- Redis for session data
- CDN for static assets
- Application-level caching for dashboard data

## Maintenance

### Regular Tasks

- [ ] Monitor disk space
- [ ] Review logs for errors
- [ ] Update dependencies monthly
- [ ] Backup database daily
- [ ] Test backup restoration
- [ ] Review security logs
- [ ] Update SSL certificates (30 days before expiry)
- [ ] Performance monitoring

### Update Procedure

```bash
# Backend update
cd backend-go
git pull origin main
go mod download
go build -o server ./cmd/server
systemctl restart eduplexo

# Frontend update
cd super-admin-app
git pull origin main
npm install
npm run build
vercel --prod
```

## Support & Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check logs
journalctl -u eduplexo -n 50

# Check port
lsof -i :8080

# Check database connection
psql -U eduplexo_user -d eduplexo_prod -c "SELECT 1"
```

**Frontend not loading:**
```bash
# Check build
npm run build

# Check environment variables
echo $VITE_API_URL

# Check network requests (browser console)
```

**Database connection issues:**
```bash
# Test connection
psql -U eduplexo_user -h localhost -d eduplexo_prod

# Check PostgreSQL status
sudo systemctl status postgresql
```

## Disaster Recovery

### Backup Restoration

```bash
# Restore from backup
gunzip < /backups/eduplexo/eduplexo_20250516_120000.sql.gz | \
  psql -U eduplexo_user -d eduplexo_prod
```

### Data Recovery

- Keep daily backups for 30 days
- Weekly backups for 3 months
- Monthly backups for 1 year
- Test restoration monthly

## Monitoring Dashboard

Set up monitoring with:
- Prometheus (metrics)
- Grafana (visualization)
- AlertManager (alerts)

## Contact & Support

For deployment issues:
1. Check logs: `journalctl -u eduplexo -f`
2. Review error messages
3. Check database connectivity
4. Verify environment variables
5. Contact support team

---

**Last Updated:** May 16, 2025
**Status:** Ready for Production Deployment
