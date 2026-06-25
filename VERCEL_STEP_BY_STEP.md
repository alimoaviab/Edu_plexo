# 🎯 Vercel Environment Variables - Step by Step

## ✅ Kya Karna Hai (Simple)

Vercel pe apne project mein **environment variable** add karna hai jisse frontend backend se connect ho sake.

---

## 📋 Step 1: Vercel Dashboard Kholo

1. Browser mein jao: **https://vercel.com**
2. **Login** karo
3. Apna project select karo: **`school-react-app`** (ya jo bhi naam hai)

---

## 📋 Step 2: Settings Mein Jao

1. Project dashboard mein **Settings** tab pe click karo (top menu mein)
2. Left sidebar mein **Environment Variables** pe click karo

---

## 📋 Step 3: Environment Variables Add Karo

Niche diye gaye **3 variables** add karo:

### Variable 1: VITE_API_URL
- **Name**: `VITE_API_URL`
- **Value**: `https://api.eduplexo.com`
- **Environments**: ✅ **Production** (check karo)
- Click **Save**

### Variable 2: VITE_ENABLE_MOCKS
- **Name**: `VITE_ENABLE_MOCKS`
- **Value**: `false`
- **Environments**: ✅ **Production** (check karo)
- Click **Save**

### Variable 3 (Optional): VITE_APP_NAME
- **Name**: `VITE_APP_NAME`
- **Value**: `Eduplexo — School Workspace`
- **Environments**: ✅ **Production** (check karo)
- Click **Save**

---

## 📋 Step 4: Redeploy Karo

Environment variables add karne ke baad frontend ko **redeploy** karna zaroori hai:

### Option A: Automatic (Git Push)
```bash
# Local machine pe
cd ~/Desktop/EDUEXPLO/Eduplexo
git add school-react-app/.env.production
git commit -m "Add production API URL"
git push
```

Vercel automatically detect karega aur deploy karega.

### Option B: Manual Redeploy
1. Vercel Dashboard → **Deployments** tab
2. Latest deployment pe **⋯** (three dots) click karo
3. **Redeploy** select karo
4. **Redeploy** confirm karo

---

## ✅ Step 5: Verify Karo

### 5.1 Deployment Logs Check Karo
1. Vercel Dashboard → **Deployments**
2. Latest deployment pe click karo
3. **Build Logs** scroll karo aur check karo:
```
✓ building client + server...
✓ VITE_API_URL is set to: https://api.eduplexo.com
```

### 5.2 Browser Mein Test Karo
1. Open: **https://app.eduplexo.com**
2. Right-click → **Inspect** (ya F12 press karo)
3. **Console** tab pe jao
4. Ye command run karo:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Output hona chahiye: `https://api.eduplexo.com`

### 5.3 Network Tab Check Karo
1. Browser **DevTools** → **Network** tab
2. Login page pe jao: `https://app.eduplexo.com/auth/login`
3. Login karo
4. Network tab mein API calls dekho
5. URL hona chahiye: `https://api.eduplexo.com/api/auth/login`

---

## 🎯 Quick Summary

**Kya add kiya:**
```
VITE_API_URL = https://api.eduplexo.com
VITE_ENABLE_MOCKS = false
```

**Kyu zaroori hai:**
- Frontend (Vercel) aur Backend (VPS) alag domains pe hain
- Frontend ko batana padta hai backend kahan hai
- Production mein `VITE_API_URL` use hota hai

**Kaise kaam karta hai:**
```
Frontend (https://app.eduplexo.com)
    ↓
API Call: https://api.eduplexo.com/api/teachers
    ↓
Backend (206.189.94.7:80)
```

---

## 🐛 Troubleshooting

### Problem: Environment variable nahi dikh raha
**Solution:**
- Settings → Environment Variables mein check karo
- **Production** environment selected hai ya nahi
- Redeploy karna mat bhulna!

### Problem: Still getting 502 errors
**Check:**
1. Backend running hai: `curl http://api.eduplexo.com/health`
2. Should return: `{"status":"alive"}`
3. Agar nahi, VPS pe backend start karo:
```bash
ssh root@206.189.94.7
cd ~/prictice-projrct
docker compose -f vps/docker-compose.vps.yml --env-file vps/.env.vps up -d
```

### Problem: CORS error in console
**Backend CORS check karo:**
1. SSH into VPS: `ssh root@206.189.94.7`
2. Backend logs dekho: `docker logs vps-backend-go-1 -f`
3. CORS error dikhe toh backend config check karo

### Problem: API calls localhost pe ja rahe hain
**Frontend env variable load nahi hua:**
1. Vercel → Settings → Environment Variables
2. Confirm `VITE_API_URL` is set to `https://api.eduplexo.com`
3. Redeploy karo (manual ya git push)

---

## 📞 Reference Table

| Item | Value |
|------|-------|
| Frontend URL | https://app.eduplexo.com |
| Backend API URL | https://api.eduplexo.com |
| Backend Server IP | 206.189.94.7 |
| Environment Variable | `VITE_API_URL` |
| Value | `https://api.eduplexo.com` |

---

## ✅ Success Checklist

Is order mein check karo:

- [ ] VPS backend running: `curl http://api.eduplexo.com/health` ✅
- [ ] Vercel env variables set: `VITE_API_URL` = `https://api.eduplexo.com` ✅
- [ ] Frontend redeployed on Vercel ✅
- [ ] Browser console shows: API calls to `api.eduplexo.com` ✅
- [ ] Login works (no 502) ✅
- [ ] Dashboard loads ✅
- [ ] Teacher creation works ✅

---

## 🚀 Next Steps

Sab set ho gaya toh:

1. **Test login**: `https://app.eduplexo.com/auth/login`
   - Email: `school@gmail.com`
   - Password: `3000`

2. **Test teacher creation**: Dashboard → Teachers → Create New
   - Should work without foreign key error

3. **Monitor logs** (if needed):
   - Backend: `docker logs vps-backend-go-1 -f`
   - Frontend: Vercel Dashboard → Deployments → Logs

---

## 📝 Important Notes

1. **HTTP vs HTTPS**: Backend uses HTTPS (`https://api.eduplexo.com`) to match Vercel's HTTPS (`https://app.eduplexo.com`), preventing browser mixed content block.

2. **SSL Setup**: SSL is active and handled by the VPS host Nginx proxy.

3. **DNS**: Already configured
   - `app.eduplexo.com` → Vercel
   - `api.eduplexo.com` → 206.189.94.7

Bas itna hi! Simple 3-step process:
1. Add environment variables in Vercel
2. Redeploy frontend  
3. Test login and teacher creation
