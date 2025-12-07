#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

require_token

AUTH_HEADER="Authorization: Bearer $TOKEN"

section "GET /box (initial list)"
curl -s -X GET "$BASE_URL/box" \
  -H "$AUTH_HEADER"
echo

section "POST /box (create entry)"

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/box" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "createdAt": "2025-12-07T00:00:00.000Z",
    "level": 25,
    "location": "Viridian Forest",
    "notes": "My first test pokemon",
    "pokemonId": 25
  }')

echo "$CREATE_RESPONSE"

# --- Pure Bash extraction of "id" field ---
# Assumes response contains: "id":"somevalue"
BOX_ID="${CREATE_RESPONSE#*\"id\":\"}"
BOX_ID="${BOX_ID%%\"*}"

if [ -z "$BOX_ID" ] || [ "$BOX_ID" = "$CREATE_RESPONSE" ]; then
  echo
  echo "WARNING: Could not automatically extract BOX_ID from response."
  echo "Skipping per-id tests, but create + list still ran."
  exit 0
fi

echo
echo "Using BOX_ID=$BOX_ID"
echo

section "GET /box/:id (fetch created entry)"
curl -s -X GET "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER"
echo

section "GET /box (list IDs)"
curl -s -X GET "$BASE_URL/box" \
  -H "$AUTH_HEADER"
echo

section "PUT /box/:id (update entry level + notes)"
curl -s -X PUT "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d '{
    "level": 50,
    "notes": "Updated notes from test_box.sh"
  }'
echo

section "DELETE /box/:id (delete the entry)"
curl -s -X DELETE "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER" \
  -i
echo

section "DELETE /box (clear all entries for user)"
curl -s -X DELETE "$BASE_URL/box" \
  -H "$AUTH_HEADER" \
  -i
echo

section "GET /box (final list should be empty)"
curl -s -X GET "$BASE_URL/box" \
  -H "$AUTH_HEADER"
echo
