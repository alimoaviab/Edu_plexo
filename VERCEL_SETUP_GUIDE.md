# 🚀 Vercel Frontend Setup Guide

## Frontend Configuration for Production

Aapka frontend Vercel pe deploy hai aur backend VPS pe. Dono ko connect karne ke liye:

---

## 📁 Project Structure

- **Frontend (React)**: `school-react-app/` → Deployed on Vercel
- **Backend (Go)**: `backend-go/` → Deployed on VPS (206.189.94.7)
- **Domain**: 
  - Frontend: `app.eduplexo.com` (Vercel)
  - Backend: `api.eduplexo.com` (VPS)

---

## 🔧 Step 1: Vercel Environment Variables

Vercel dashboard mein jao aur yeh environment variable add karo:

### Production Environment Variables

```
VITE_API_URL = http://api.eduplexo.com
VITE_APP_NAME = Eduplexo — School Workspace
VITE_APP_DESCRIPTION = Multi-school SaaS school workspace
VITE_ENABLE_MOCKS = false
```

### Kaise Add Karein:

1. **Vercel Dashboard** → Your Project → **Settings**
2. **Environment Variables** tab pe jao
3. Niche diye gaye variables add karo:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `http://api.eduplexo.com` | Production |
| `VITE_APP_NAME` | `Eduplexo — School Workspace` | Production |
| `VITE_ENABLE_MOCKS` | `false` | Production |

4. **Save** karo

---

## 🔄 Step 2: Redeploy Frontend

Environment variables add karne ke baad:

### Option A: Automatic (Recommended)
```bash
# Local se push karo (if .env.production file changed)
git add school-react-app/.env.production
git commit -m "Add production environment variables"
git push
```

Vercel automatically redeploy karega.

### Option B: Manual Redeploy
1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Latest deployment pe click → **⋯** → **Redeploy**

---

## 🧪 Step 3: Verify Configuration

### Check Frontend Build Logs
1. Vercel Dashboard → **Deployments**
2. Latest deployment click karein
3. **Build Logs** check karein for:
```
✓ VITE_API_URL: http://api.eduplexo.com
```

### Test in Browser
1. Open `https://app.eduplexo.com`
2. **Browser Console** (F12) kholo
3. Network tab mein dekho - API calls `http://api.eduplexo.com/api/...` pe ja rahe hain

---

## 🌐 Step 4: DNS Verification

### Check DNS Settings
```bash
# Check frontend domain
nslookup app.eduplexo.com
# Should point to Vercel IPs (76.76.21.21 or Vercel CNAME)

# Check backend domain  
nslookup api.eduplexo.com
# Should point to: 206.189.94.7
```

### Vercel Domain Settings
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Confirm `app.eduplexo.com` is added and verified
3. SSL Certificate should be **Active**

---

## 🔐 CORS Configuration

Backend already configured hai for CORS. Check karlo:

File: `backend-go/internal/middleware/cors.go`

```go
AllowedOrigins: []string{
    "https://app.eduplexo.com",
    "https://admin.eduplexo.com",
    // ... other origins
}
```

Agar aapka domain missing hai, toh add karo aur backend redeploy karo.

---

## 📝 Complete Setup Checklist

- [ ] VPS backend deployed aur running (`http://api.eduplexo.com/health` working)
- [ ] DNS: `api.eduplexo.com` → `206.189.94.7` (A record)
- [ ] DNS: `app.eduplexo.com` → Vercel (CNAME or A record)
- [ ] Vercel env variables set (`VITE_API_URL` = `http://api.eduplexo.com`)
- [ ] Frontend redeployed on Vercel
- [ ] Test login: `https://app.eduplexo.com/auth/login`
- [ ] Check browser console for API calls
- [ ] Test teacher creation through UI

---

## 🧪 Testing Flow

### 1. Test Backend Health
```bash
curl http://api.eduplexo.com/health
# Expected: {"status":"alive"}
```

### 2. Test Backend Login
```bash
curl -X POST http://api.eduplexo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"school@gmail.com","password":"3000"}'
# Expected: JSON with token
```

### 3. Test Frontend
1. Open: `https://app.eduplexo.com/auth/login`
2. Login with: `school@gmail.com` / `3000`
3. Should redirect to dashboard (not 502)

### 4. Test Teacher Creation
1. Dashboard → Teachers → Create New
2. Fill form aur submit
3. Should work without foreign key error

---

## 🐛 Troubleshooting

### Problem 1: Frontend still showing 502
**Solution:**
```bash
# Check if env vars are set
# Vercel → Settings → Environment Variables

# Redeploy
# Vercel → Deployments → Redeploy
```

### Problem 2: CORS Error in Browser Console
**Check:**
1. Backend logs: `docker logs vps-backend-go-1 -f`
2. CORS middleware: Check `AllowedOrigins` in backend
3. Verify frontend domain exactly matches (with https://)

### Problem 3: API calls going to wrong URL
**Check:**
1. Browser DevTools → Network tab
2. API calls should go to `http://api.eduplexo.com/api/...`
3. If going to `localhost`, env variable not loaded
4. Redeploy frontend on Vercel

### Problem 4: Mixed Content Warning (HTTP/HTTPS)
Frontend HTTPS hai, backend HTTP hai:

**Temporary Fix:** Use HTTP for now
- Works: `http://api.eduplexo.com`

**Permanent Fix:** Add SSL to backend
- Later: Setup Let's Encrypt on VPS
- Then change to: `https://api.eduplexo.com`

---

## 📊 File Summary

### Created/Updated Files:
1. ✅ `school-react-app/.env.production` - Production env variables
2. ✅ `vps/nginx-simple-http.conf` - HTTP-only nginx config
3. ✅ `vps/docker-compose.vps.yml` - Updated docker compose
4. ✅ `backend-go/internal/domain/teachers/teachers.go` - Teacher creation fix

### Deployment Commands:

**Backend (VPS):**
```bash
cd ~/prictice-projrct
git pull
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up --build -d
```

**Frontend (Vercel):**
```bash
# Just push to GitHub, Vercel auto-deploys
git add .
git commit -m "Update production config"
git push
```

---

## 🎯 Next Steps

1. **Immediate:**
   - Set Vercel environment variables
   - Redeploy frontend
   - Test login and teacher creation

2. **Later (Optional):**
   - Add SSL certificate to VPS backend
   - Update `VITE_API_URL` to `https://api.eduplexo.com`
   - Enable edubot service

---

## 📞 Quick Reference

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | https://app.eduplexo.com | Open in browser |
| Backend API | http://api.eduplexo.com | `curl http://api.eduplexo.com/health` |
| VPS Server | 206.189.94.7 | `ssh root@206.189.94.7` |

---

## ✅ Success Indicators

Sab kuch theek hai agar:
- ✅ `http://api.eduplexo.com/health` returns `{"status":"alive"}`
- ✅ Frontend loads: `https://app.eduplexo.com`
- ✅ Login works (no 502 error)
- ✅ Browser console shows API calls to `api.eduplexo.com`
- ✅ Teacher creation works without errors
