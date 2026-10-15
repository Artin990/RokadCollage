#!/bin/sh
set -e

# Start Next.js standalone server in background on internal port 3001
export PORT=3001
export HOSTNAME=127.0.0.1
node server.js &
NEXT_PID=$!

# Trap signals for graceful shutdown
cleanup() {
    echo "Stopping container..."
    kill -TERM "$NEXT_PID" 2>/dev/null || true
    nginx -s quit 2>/dev/null || true
    wait "$NEXT_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Start Nginx in foreground on external port 3000
nginx -g "daemon off;" &
NGINX_PID=$!

wait "$NGINX_PID"
