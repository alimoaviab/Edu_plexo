# EduPlexo API Production Deployment Guide

This guide details the deployment procedure for the **EduPlexo API Stack** running on a Ubuntu 24.04 VPS with Docker Compose v2 and host-level Nginx reverse proxy.

---

## 🏗 Architecture Overview

* **Vercel (Frontend Services):**
  * `https://app.eduplexo.com` (School Web App)
  * `https://admin.eduplexo.com` (Super Admin App)
* **DigitalOcean VPS (Backend Infrastructure):**
  * Host Nginx (`api.eduplexo.com` with TLS termination via Certbot)
  * Docker Compose (`docker-compose.api.yml`):
    * `backend-go` (Go API server on `127.0.0.1:8080`)
    * `worker` (Background job processor)
    * `edubot` (FastAPI AI chatbot on `127.0.0.1:8001`)
    * `postgres` (PostgreSQL 16 DB with tuned parameters)
    * `redis` (Redis 7 caching & job queue)
    * `migrate` (One-shot migration runner)

---

## 📋 Prerequisites & Environment Setup

1. Copy `.env.prod` to `.env` in the project root on the server:
   ```bash
   cp .env.prod .env
   ```
2. Ensure all production values in `.env` are filled out correctly (DB password, JWT secret, Redis password, Gemini API Key).

---

## 🐳 Docker Deployment Commands

### 1. Build Container Images
```bash
docker compose --env-file .env -f docker-compose.api.yml build
```

### 2. Start API Stack in Detached Mode
```bash
docker compose --env-file .env -f docker-compose.api.yml up -d
```

### 3. Check Container Health & Status
```bash
docker compose --env-file .env -f docker-compose.api.yml ps
```

### 4. View Live Container Logs
```bash
docker compose --env-file .env -f docker-compose.api.yml logs -f
```

### 5. Stop & Remove Containers (Data Persisted)
```bash
docker compose --env-file .env -f docker-compose.api.yml down
```

---

## 🌐 Host Nginx Configuration & SSL Setup

### 1. Install & Enable Nginx Site Configuration
Copy `nginx/api.eduplexo.com.conf` to Nginx sites directory on the Ubuntu host:

```bash
sudo cp nginx/api.eduplexo.com.conf /etc/nginx/sites-available/api.eduplexo.com
sudo ln -sf /etc/nginx/sites-available/api.eduplexo.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Obtain SSL Certificate with Certbot
Install Certbot Nginx plugin and request SSL certificate:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL Certificate (automatically updates Nginx configuration for HTTPS)
sudo certbot --nginx -d api.eduplexo.com --non-interactive --agree-tos --email admin@eduplexo.com

# Verify Automatic Renewal Timer
sudo systemctl status certbot.timer
```

---

## 🔍 Verification & Health Checks

Once deployed, verify all endpoints:

1. **Database & Services Health:**
   ```bash
   docker compose --env-file .env -f docker-compose.api.yml ps
   ```

2. **Backend Health Endpoint:**
   ```bash
   curl -I https://api.eduplexo.com/health/live
   curl https://api.eduplexo.com/health/ready
   ```

3. **EduBot AI Endpoint (Internal):**
   ```bash
   curl http://127.0.0.1:8001/chat/health
   ```

4. **Verify Frontends on Vercel:**
   Ensure Vercel environment variables point to `https://api.eduplexo.com` and test CORS requests from `app.eduplexo.com` and `admin.eduplexo.com`.
