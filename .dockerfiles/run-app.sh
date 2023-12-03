#!/bin/bash
# Re-build before running, to propagate runtime environment
# variables into static HTML/JS files.
npm run build
envsubst '$PORT' < .dockerfiles/nginx.conf.template > /etc/nginx/nginx.conf
service nginx restart
tail -f /var/log/nginx/*.log