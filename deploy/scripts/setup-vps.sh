#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Eduplexo VPS Initial Setup Script
# ═══════════════════════════════════════════════════════════════════════════
# Run this ONCE on a fresh Ubuntu 24.04 VPS (Hostinger KVM 2)
#
# Usage: curl -sSL https://raw.githubusercontent.com/.../setup-vps.sh | bash
#    or: bash setup-vps.sh
#
# What it does:
#   1. System updates + essential packages
#   2. Creates non-root deploy user
#   3. Configures SSH hardening
#   4. Installs Docker + Docker Compose
#   5. Configures UFW firewall
#   6. Installs fail2ban
#   7. Configures swap (for low-RAM VPS)
#   8. Sets up log rotation
#   9. Creates project directory structure

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[SETUP]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Must run as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root: sudo bash setup-vps.sh"
fi

DEPLOY_USER="deploy"
PROJECT_DIR="/opt/eduplexo"

# ─── 1. System Update ────────────────────────────────────────────────────
log "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl wget git htop iotop ncdu \
    unzip zip jq tree \
    ca-certificates gnupg lsb-release \
    software-properties-common \
    logrotate cron

# ─── 2. Create Deploy User ───────────────────────────────────────────────
log "Creating deploy user..."
if ! id "$DEPLOY_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" "$DEPLOY_USER"
    usermod -aG sudo "$DEPLOY_USER"
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
    chmod 0440 /etc/sudoers.d/$DEPLOY_USER

    # Copy SSH keys from root
    mkdir -p /home/$DEPLOY_USER/.ssh
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
    fi
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
fi

# ─── 3. SSH Hardening ────────────────────────────────────────────────────
log "Hardening SSH..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp $SSHD_CONFIG ${SSHD_CONFIG}.bak

sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' $SSHD_CONFIG
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' $SSHD_CONFIG
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' $SSHD_CONFIG
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' $SSHD_CONFIG
sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' $SSHD_CONFIG
sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 300/' $SSHD_CONFIG
sed -i 's/#ClientAliveCountMax 3/ClientAliveCountMax 2/' $SSHD_CONFIG

systemctl restart sshd

# ─── 4. Install Docker ───────────────────────────────────────────────────
log "Installing Docker..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker $DEPLOY_USER
    systemctl enable docker
    systemctl start docker
fi

# Docker Compose is included with Docker Engine now
docker compose version || error "Docker Compose not available"

# Docker daemon configuration for production
cat > /etc/docker/daemon.json <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "20m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "live-restore": true,
    "default-ulimits": {
        "nofile": {
            "Name": "nofile",
            "Hard": 65536,
            "Soft": 65536
        }
    }
}
EOF

systemctl restart docker

# ─── 5. UFW Firewall ─────────────────────────────────────────────────────
log "Configuring firewall..."
apt-get install -y -qq ufw

ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Enable without prompt
echo "y" | ufw enable
ufw status

# ─── 6. Fail2Ban ─────────────────────────────────────────────────────────
log "Installing fail2ban..."
apt-get install -y -qq fail2ban

cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
bantime = 86400
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# ─── 7. Swap Configuration (for 4GB RAM VPS) ─────────────────────────────
log "Configuring swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab

    # Optimize swap behavior for low-RAM
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf
    sysctl -p
fi

# ─── 8. System Limits ────────────────────────────────────────────────────
log "Configuring system limits..."
cat >> /etc/security/limits.conf <<EOF
* soft nofile 65536
* hard nofile 65536
$DEPLOY_USER soft nproc 4096
$DEPLOY_USER hard nproc 4096
EOF

# ─── 9. Log Rotation ─────────────────────────────────────────────────────
log "Configuring log rotation..."
cat > /etc/logrotate.d/eduplexo <<EOF
/opt/eduplexo/deploy/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 $DEPLOY_USER $DEPLOY_USER
}
EOF

# ─── 10. Project Directory ───────────────────────────────────────────────
log "Creating project directory..."
mkdir -p $PROJECT_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER $PROJECT_DIR

# ─── 11. Automatic Security Updates ──────────────────────────────────────
log "Enabling automatic security updates..."
apt-get install -y -qq unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# ─── Done ─────────────────────────────────────────────────────────────────
log "═══════════════════════════════════════════════════════════════════"
log "VPS setup complete!"
log ""
log "Next steps:"
log "  1. SSH as deploy user: ssh deploy@your-vps-ip"
log "  2. Clone your repo to /opt/eduplexo"
log "  3. Copy .env.production.example to .env.production"
log "  4. Run: bash deploy/scripts/init-ssl.sh"
log "  5. Run: bash deploy/scripts/deploy.sh"
log ""
log "Important:"
log "  - Root login is now disabled (use 'deploy' user)"
log "  - Only ports 22, 80, 443 are open"
log "  - Fail2ban is protecting SSH"
log "  - 2GB swap is configured"
log "═══════════════════════════════════════════════════════════════════"
