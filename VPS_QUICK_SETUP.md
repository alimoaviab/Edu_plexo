# VPS Quick Setup Guide

## First Time Setup (Run Once)

```bash
# 1. SSH into VPS
ssh root@your-vps-ip

# 2. Clone repo (if not done)
git clone https://github.com/alimoaviab/prictice-projrct.git
cd prictice-projrct

# 3. Create .env file
cd vps
cp .env.vps.example .env.vps
nano .env.vps  # Fill in your secrets (see below)

# 4. Run setup script (creates symlinks)
cd ..
bash docker-compose.vps-link.sh

# 5. Done! Now deploy:
docker compose up --build -d
```

## Fill .env.vps Values

Open `vps/.env.vps` and replace these:

```bash
# Generate secrets with:
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 24  # For passwords

# Required values:
POSTGRES_PASSWORD=<generated-password>
JWT_SECRET=<generated-secret>
REDIS_PASSWORD=<generated-password>
GEMINI_API_KEY=<your-gemini-key>
ALLOWED_ORIGINS=https://app.eduplexo.com,https://admin.eduplexo.com
```

---

## Daily Deployment (After First Setup)

```bash
# Just 2 commands:
git pull
docker compose up --build -d
```

That's it! 🚀

---

## Check Status

```bash
# See running services
docker compose ps

# View backend logs
docker logs eduplexo_backend -f

# Check health
curl http://localhost:8080/health/live
```

---

## Troubleshooting

### "No such file: .env"
**Solution:** Run setup script first:
```bash
bash docker-compose.vps-link.sh
```

### Services not starting
**Solution:** Check logs:
```bash
docker compose logs -f
```

### Need to rebuild from scratch
```bash
git pull
docker compose down
docker compose up --build -d
```
