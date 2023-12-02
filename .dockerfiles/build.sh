#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y \
  npm \
  nginx \
  git \
  nodejs
mv .dockerfiles/nginx.conf /etc/nginx/nginx.conf
npm install
npm run build