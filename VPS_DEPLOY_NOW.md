# 🚀 Deploy Teacher Fix to Production - Run These Commands

## On Your VPS Terminal (SSH into server first)

```bash
# Step 1: Go to project directory
cd ~/prictice-projrct

# Step 2: Pull latest code (includes fix)
git pull origin main

# Step 3: Run deployment script
bash vps/deploy-production.sh

# Step 4: Verify deployment
bash vps/verify-deployment.sh
```

---

## ⚠️ If Step 3 Asks for .env.vps

```bash
# Create environment file
cd ~/prictice-projrct/vps
cp .env.vps.example .env.vps
nano .env.vps
```

**Fill these values (generate secrets first):**

```bash
# Generate secrets (copy the output):
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 24  # POSTGRES_PASSWORD  
openssl rand -base64 24  # REDIS_PASSWORD

# Edit .env.vps and paste:
POSTGRES_PASSWORD=<paste-generated-password>
JWT_SECRET=<paste-generated-jwt-secret>
REDIS_PASSWORD=<paste-generated-redis-password>
GEMINI_API_KEY=<your-actual-gemini-key>
ALLOWED_ORIGINS=https://app.eduplexo.com,https://admin.eduplexo.com
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

Then run deployment again:
```bash
cd ~/prictice-projrct
bash vps/deploy-production.sh
```

---

## ✅ Verification

After deployment, test teacher creation:

1. **Check backend is running:**
   ```bash
   curl http://localhost:8080/health/live
   ```
   Should return: `OK` or `{"status":"ok"}`

2. **Check logs:**
   ```bash
   docker logs eduplexo_backend --tail 30
   ```
   Should NOT show errors

3. **Try creating a teacher via your frontend** (the main test!)

---

## 📊 What This Fixes

**Before (Broken):**
- Teacher creation → Foreign Key error
- User created but teacher not created
- Database inconsistency

**After (Fixed):**
- Teacher creation works ✅
- Reuses existing users properly ✅
- Validates database inserts ✅
- No foreign key errors ✅

---

## 🔍 Troubleshooting

### If deployment fails:
```bash
# Check what's wrong
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps logs

# Try clean rebuild
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps down
bash vps/deploy-production.sh
```

### If teacher creation still fails:
```bash
# Check backend logs in real-time
docker logs eduplexo_backend -f

# Try creating teacher
# Watch logs for error messages
```

---

## 📞 Need Help?

Share output of:
```bash
bash vps/verify-deployment.sh > verification.txt
docker logs eduplexo_backend --tail 100 > backend.log
```

Then check `verification.txt` and `backend.log` for error messages.

---

## 🎯 Summary

**Just run these 2 commands on VPS:**
```bash
cd ~/prictice-projrct && git pull origin main
bash vps/deploy-production.sh
```

That's it! The fix is deployed. 🎉
