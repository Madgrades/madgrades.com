#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y \
  npm \
  nginx \
  git \
  nodejs \
  gettext-base
npm install

# Build to verify build succeeds, but at runtime we may
# build again to propagate runtime environment variables.
npm run build