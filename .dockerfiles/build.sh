#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

# Install Node.js 24.x LTS (Krypton) from NodeSource
apt-get update
apt-get install -y curl ca-certificates gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=24
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Install dependencies
apt-get update
apt-get install -y \
  nodejs \
  nginx \
  git \
  gettext-base

# Verify Node.js version
node --version
npm --version

# Install npm dependencies
npm install --legacy-peer-deps

# Build to verify build succeeds, but at runtime we may
# build again to propagate runtime environment variables.
npm run build