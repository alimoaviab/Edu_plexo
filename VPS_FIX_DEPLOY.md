# 🔧 VPS Deployment Fix - Run These Commands

## Problem
- Frontend showing 502 Bad Gateway
- Nginx was configured for SSL/HTTPS but certificates don't exist
- temp-nginx container was working but got removed

## Solution
New HTTP-only nginx configuration that works without SSL certificates.

---

## 🚀 Run These Commands on VPS (206.189.94.7)

```bash
# 1. Navigate to project directory
cd ~/prictice-projrct

# 2. Stop all existing containers (clean slate)
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down

# 3. Remove any orphaned nginx containers
docker rm -f vps-nginx-1 temp-nginx 2>/dev/null || true

# 4. Pull latest code (includes the fix)
git pull

# 5. Start everything fresh
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d

# 6. Wait a few seconds for services to start
sleep 10

# 7. Check status
docker ps

# 8. Test health endpoint
curl http://localhost/health

# 9. Test from domain
curl http://api.eduplexo.com/health
```

---

## ✅ Expected Output

### From `docker ps`:
```
CONTAINER ID   IMAGE                  STATUS         PORTS
xxxx           nginx:1.27-alpine      Up X seconds   0.0.0.0:80->80/tcp
xxxx           backend-go             Up X seconds   0.0.0.0:8080->8080/tcp
xxxx           postgres:16-alpine     Up X seconds   5432/tcp
xxxx           redis:7-alpine         Up X seconds   6379/tcp
```

### From health checks:
```
{"status":"alive"}
```

---

## 🧪 Test Login Endpoint

Once health checks pass, test the login:

```bash
curl -X POST http://api.eduplexo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "school@gmail.com",
    "password": "3000"
  }'
```

**Expected**: JSON response with token (not 502)

---

## 🎯 Test Teacher Creation

Once login works, the frontend should be able to:
1. Login at `https://app.eduplexo.com/auth/login`
2. Navigate to Teachers section
3. Create a new teacher

The teacher creation fix is already deployed in the backend.

---

## 📊 Monitor Logs

```bash
# Backend logs
docker logs vps-backend-go-1 -f

# Nginx logs
docker logs vps-nginx-1 -f

# All logs together
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps logs -f
```

---

## 🔍 What Changed

1. **Created**: `vps/nginx-simple-http.conf` - HTTP-only nginx config (no SSL)
2. **Updated**: `vps/docker-compose.vps.yml` - Use simple nginx config
3. **Removed**: Dependency on external "frontend" network
4. **Fixed**: Nginx health check to use `/health` instead of `/nginx-health`

---

## 🆘 If Something Goes Wrong

### Nginx fails to start
```bash
docker logs vps-nginx-1
# Check the logs for errors
```

### Backend fails to start
```bash
docker logs vps-backend-go-1
# Check for database connection or env var issues
```

### Can't access from domain
```bash
# Check if port 80 is accessible
ss -tlnp | grep :80

# Check firewall
ufw status

# Test local first
curl http://localhost/health
```

### Start from scratch
```bash
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down -v
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

---

## 📝 After Deployment

Once everything is working:

1. **Test login** from frontend: `https://app.eduplexo.com`
2. **Create a teacher** through the UI
3. **Verify** the teacher creation works without foreign key error
4. **Check logs** for any errors

---

## 🔐 SSL Setup (Later)

When ready to add SSL:
1. Install certbot
2. Obtain Let's Encrypt certificates
3. Update docker-compose to use `nginx.vps.conf`
4. Restart nginx

But for now, HTTP-only works fine since frontend is on Vercel with its own SSL.
