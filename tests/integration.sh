#!/usr/bin/env bash
# Simple integration test harness that hits the four endpoints.
# Usage: Start the local server (`python3 extension/server.py`) then run this script.
set -euo pipefail
BASE=http://127.0.0.1:5000
ENDPOINTS=(attestation merkle drift compliance)

for e in "${ENDPOINTS[@]}"; do
  echo "Testing $e..."
  out=$(curl -s "$BASE/$e")
  echo "$out"
  if echo "$out" | grep -q '"status":"success"'; then
    echo "OK: $e returned success"
  else
    echo "FAIL: $e did not return success"
    exit 1
  fi
done

echo "All integration tests passed."