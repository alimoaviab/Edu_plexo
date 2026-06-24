# VPS Production Deployment Instructions

## ⚠️ IMPORTANT: Read Before Deploying

This guide will help you deploy the Teacher Creation fix to production VPS.

---

## Prerequisites

1. **SSH Access to VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Repository exists at:** `~/prictice-projrct`

3. **Environment file configured:** `~/prictice-projrct/vps/.env.vps`

---

## Quick Deployment (If Already Set Up)

```bash
# On VPS:
cd ~/prictice-projrct
git pull origin main
bash vps/deploy-production.sh
```

---

## First Time Setup

### Step 1: Create Environment File

```bash
cd ~/prictice-projrct/vps
cp .env.vps.example .env.vps
nano .env.vps
```

**Fill in these values:**

```bash
# Generate secrets:
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 24  # For POSTGRES_PASSWORD
openssl rand -base64 24  # For REDIS_PASSWORD

# Required values:
POSTGRES_DB=eduplexo_prod
POSTGRES_USER=eduplexo_app
POSTGRES_PASSWORD=<generated-password>

JWT_SECRET=<generated-jwt-secret>
ALLOWED_ORIGINS=https://app.eduplexo.com,https://admin.eduplexo.com

REDIS_PASSWORD=<generated-redis-password>

GEMINI_API_KEY=<your-gemini-api-key>
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 2: Deploy

```bash
cd ~/prictice-projrct
bash vps/deploy-production.sh
```

### Step 3: Verify

```bash
bash vps/verify-deployment.sh
```

---

## Troubleshooting

### Issue: "docker compose: command not found"

**Solution:** Install Docker Compose:
```bash
apt update
apt install docker-compose-plugin
```

### Issue: ".env.vps not found"

**Solution:** Create it from template (see Step 1 above)

### Issue: "service frontend has neither an image nor a build context"

**Solution:** You're using wrong docker-compose file. Use the deployment script:
```bash
bash vps/deploy-production.sh
```

### Issue: Containers won't start

**Check logs:**
```bash
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps logs
```

### Issue: Old code still running

**Force rebuild:**
```bash
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps build --no-cache
bash vps/deploy-production.sh
```

---

## Verification Checklist

After deployment, verify:

- [ ] All containers running: `docker ps`
- [ ] Backend healthy: `curl http://localhost:8080/health/live`
- [ ] Database accessible: `docker exec eduplexo_postgres pg_isready`
- [ ] Migrations complete: `bash vps/verify-deployment.sh`
- [ ] No errors in logs: `docker logs eduplexo_backend --tail 50`
- [ ] Teacher creation works (test via API)

---

## Test Teacher Creation

### Via curl:

```bash
# Get auth token first (replace with your admin credentials)
TOKEN="your-jwt-token-here"

# Create teacher
curl -X POST http://localhost:8080/api/teachers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "test.teacher@school.com",
    "first_name": "Test",
    "last_name": "Teacher",
    "phone": "1234567890",
    "password": "TestPass123",
    "qualification": "BSc"
  }'
```

**Expected:** HTTP 200 with teacher object
**If error:** Check logs: `docker logs eduplexo_backend -f`

---

## Database Inspection

```bash
# Connect to database
docker exec -it eduplexo_postgres psql -U eduplexo_app -d eduplexo_prod

# Check users
SELECT id, email, role FROM users ORDER BY created_at DESC LIMIT 5;

# Check teachers
SELECT id, email, user_id, first_name FROM teachers ORDER BY created_at DESC LIMIT 5;

# Check foreign key constraint
\d teachers

# Exit
\q
```

---

## Common Commands

```bash
# View logs
docker logs eduplexo_backend -f

# Restart backend
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps restart backend-go

# Stop all
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down

# Rebuild and deploy
bash vps/deploy-production.sh

# Check container status
docker ps

# Check disk space
df -h

# Check memory
free -h
```

---

## Rollback (If Needed)

```bash
# Stop current deployment
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down

# Go to previous commit
git log --oneline -5  # Find previous working commit
git checkout <previous-commit-hash>

# Deploy old version
bash vps/deploy-production.sh

# Return to main
git checkout main
```

---

## Support

If issues persist after following this guide:

1. Run verification script: `bash vps/verify-deployment.sh`
2. Collect logs: `docker logs eduplexo_backend > backend.log`
3. Check database state (SQL queries above)
4. Share output for debugging

---

## Security Reminders

- [ ] Never commit `.env.vps` to git
- [ ] Use strong passwords for database
- [ ] Keep JWT_SECRET secure
- [ ] Update secrets regularly
- [ ] Monitor logs for suspicious activity
- [ ] Keep Docker images updated
- [ ] Backup database regularly: `bash vps/backup.sh`
