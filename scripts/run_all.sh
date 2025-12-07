#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

PENNKEY="${1:-}"

if [ -z "$PENNKEY" ]; then
  echo "Usage: $0 <pennkey>"
  echo "Example: ./scripts/run_all.sh carolinebegg"
  exit 1
fi

echo
echo "========================================"
echo "   CIS 1962 HW5 — Full API Test Suite"
echo "========================================"
echo

section "STEP 1: POST /token (auto-fetch JWT)"

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token" \
  -H "Content-Type: application/json" \
  -d "{\"pennkey\": \"$PENNKEY\"}")

echo "Raw /token response:"
echo "$TOKEN_RESPONSE"
echo

# --- Bash-only extraction of "token" value ---
# Assumes response like: {"token":"..."}
TOKEN="${TOKEN_RESPONSE#*\"token\":\"}"   # strip up to "token":"
TOKEN="${TOKEN%%\"*}"                     # strip everything after next "

if [ -z "$TOKEN" ] || [ "$TOKEN" = "$TOKEN_RESPONSE" ]; then
  echo "ERROR: Could not automatically extract 'token' from /token response."
  echo "Make sure your /token endpoint returns JSON like: { \"token\": \"...\" }"
  exit 1
fi

export TOKEN

echo "Extracted token (truncated):"
echo "${TOKEN:0:20}..."
echo

section "STEP 2: Testing Pokémon endpoints"
"$SCRIPT_DIR/test_pokemon.sh"

section "STEP 3: Testing Box endpoints (with token)"
"$SCRIPT_DIR/test_box.sh"

echo
echo "========================================"
echo "   Finished running ALL tests ✔️"
echo "========================================"
echo
