#!/bin/sh
# Restarting under a live server leaves a stale .next and 500s the CSS.
# Always: kill -> wait for port -> build -> start -> assert stylesheet.
set -e
for pid in $(ps -eo pid,cmd | grep 'next-server' | grep -v grep | awk '{print $1}'); do
  kill "$pid" 2>/dev/null || true
done
for i in $(seq 1 20); do curl -sf -o /dev/null http://127.0.0.1:3000 2>/dev/null || break; sleep 1; done
pnpm build > /tmp/build.log 2>&1
nohup pnpm start > /tmp/next.log 2>&1 &
for i in $(seq 1 40); do curl -sf http://127.0.0.1:3000 >/dev/null 2>&1 && break; sleep 1; done
CSS=$(curl -s http://127.0.0.1:3000 | grep -oP '(?<=href=")[^"]*\.css' | head -1)
CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000$CSS")
[ "$CODE" = "200" ] || { echo "stylesheet $CODE — build is stale"; exit 1; }
echo "server up, stylesheet 200"
