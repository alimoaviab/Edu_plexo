# 🚨 VPS Fix Commands - URGENT

## Problem
Port 80 already allocated error aa raha hai. Aapne **wrong docker-compose file** use kar li (root directory ki instead of VPS wali).

---

## ✅ Solution - VPS pe ye commands run karo:

### Method 1: Quick Fix (Copy-Paste All)

```bash
# Stop ALL containers
cd ~/prictice-projrct
docker compose down 2>/dev/null || true
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down 2>/dev/null || true

# Remove old nginx containers
docker rm -f prictice-projrct-nginx-1 vps-nginx-1 temp-nginx 2>/dev/null || true

# Check port 80
ss -tlnp | grep :80

# If port 80 still busy, find and kill the process:
PID=$(ss -tlnp | grep ':80 ' | grep -oP 'pid=\K[0-9]+' | head -1)
if [ ! -z "$PID" ]; then kill -9 $PID; fi

# Start correct VPS services
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d

# Wait and check
sleep 10
docker ps
curl http://localhost/health
curl http://api.eduplexo.com/health
```

---

### Method 2: Use Script

```bash
cd ~/prictice-projrct
git pull
chmod +x VPS_FIX_NOW.sh
./VPS_FIX_NOW.sh
```

---

## 📋 Step-by-Step (Manual)

### 1. Stop Everything
```bash
cd ~/prictice-projrct

# Stop wrong compose file
docker compose down

# Stop VPS compose file  
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down
```

### 2. Remove Old Nginx Containers
```bash
docker rm -f prictice-projrct-nginx-1
docker rm -f vps-nginx-1
docker rm -f temp-nginx
```

### 3. Check Port 80
```bash
ss -tlnp | grep :80
```

**Agar kuch dikha toh:**
```bash
# Find PID
ss -tlnp | grep :80

# Kill process (replace XXXX with actual PID)
kill -9 XXXX
```

### 4. Start Correct Services
```bash
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

### 5. Verify
```bash
# Wait a bit
sleep 10

# Check containers
docker ps

# Test health
curl http://localhost/health
curl http://api.eduplexo.com/health
```

---

## ⚠️ Important Notes

### You Made This Mistake:
```bash
# WRONG - Root directory docker-compose
docker compose up -d   # ❌ This is wrong!

# CORRECT - VPS docker-compose
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up -d  # ✅
```

### Why?
- Root directory mein **old docker-compose.yml** hai (development ke liye)
- VPS deployment ke liye **vps/docker-compose.vps.yml** use karna hai

---

## 🎯 Expected Output

### After `docker ps`:
```
CONTAINER ID   IMAGE                       STATUS         PORTS
xxxxxxxxxxxx   nginx:1.27-alpine          Up 2 minutes   0.0.0.0:80->80/tcp
xxxxxxxxxxxx   prictice-projrct-backend   Up 2 minutes   0.0.0.0:8080->8080/tcp
xxxxxxxxxxxx   postgres:16-alpine         Up 2 minutes   5432/tcp
xxxxxxxxxxxx   redis:7-alpine             Up 2 minutes   6379/tcp
```

### After `curl http://localhost/health`:
```json
{"status":"alive"}
```

---

## 🐛 If Still Not Working

### Check Docker Logs
```bash
# Backend logs
docker logs vps-backend-go-1 --tail 50

# Nginx logs
docker logs vps-nginx-1 --tail 50

# All logs
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps logs --tail 50
```

### Nuclear Option (Start Fresh)
```bash
cd ~/prictice-projrct

# Stop everything
docker compose down -v
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down -v

# Remove ALL containers
docker rm -f $(docker ps -aq)

# Remove networks
docker network prune -f

# Start VPS services
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

---

## ✅ Success Checklist

- [ ] Port 80 conflict resolved
- [ ] Containers running: `docker ps` shows 4+ containers
- [ ] Health check working: `curl http://localhost/health` returns `{"status":"alive"}`
- [ ] Domain working: `curl http://api.eduplexo.com/health` returns `{"status":"alive"}`
- [ ] Backend logs clean: `docker logs vps-backend-go-1 -f` (no errors)

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `docker ps` | Show running containers |
| `docker compose down` | Stop wrong compose |
| `docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down` | Stop VPS compose |
| `docker rm -f CONTAINER_NAME` | Force remove container |
| `ss -tlnp \| grep :80` | Check port 80 |
| `docker logs CONTAINER_NAME` | View container logs |

---

## 🚀 Correct Command (Remember This!)

```bash
# Always use this for VPS deployment:
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

**Not this:**
```bash
docker compose up -d  # ❌ WRONG!
```
