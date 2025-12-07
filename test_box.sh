#!/usr/bin/env bash
set -euo pipefail

# Simple test script for CIS 1962 HW5 Box + Token endpoints
# Usage: ./test_box.sh <pennkey>
# Optional: BASE_URL env var (defaults to http://localhost:3000)
#
# Example:
#   BASE_URL=http://localhost:3000 ./test_box.sh carolinebegg

BASE_URL="${BASE_URL:-http://localhost:3000}"

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed. Install it (e.g. 'brew install jq') and try again."
  exit 1
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <pennkey>"
  exit 1
fi

PENNKEY="$1"

echo "=== 1) Requesting JWT token for pennkey '$PENNKEY' ==="
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token" \
  -H "Content-Type: application/json" \
  -d "{\"pennkey\":\"$PENNKEY\"}")

echo "Token response: $TOKEN_RESPONSE"
TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Error: Could not extract 'token' from /token response."
  exit 1
fi

echo "Received token:"
echo "$TOKEN"
echo

AUTH_HEADER="Authorization: Bearer $TOKEN"
JSON_HEADER="Content-Type: application/json"

echo "=== 2) Creating a new Box entry (POST /box) ==="
CREATE_BODY='{
  "createdAt": "2025-12-07T03:00:00.000Z",
  "level": 12,
  "location": "Viridian Forest",
  "notes": "first catch from script",
  "pokemonId": 25
}'

CREATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/box" \
  -H "$AUTH_HEADER" \
  -H "$JSON_HEADER" \
  -d "$CREATE_BODY")

CREATE_HTTP_STATUS=$(echo "$CREATE_RESPONSE" | sed -n 's/.*HTTP_STATUS://p')
CREATE_JSON=$(echo "$CREATE_RESPONSE" | sed 's/HTTP_STATUS:.*//')

echo "Status: $CREATE_HTTP_STATUS"
echo "Response JSON: $CREATE_JSON"
echo

BOX_ID=$(echo "$CREATE_JSON" | jq -r '.id // empty')
if [ -z "$BOX_ID" ]; then
  echo "Error: Could not extract 'id' from create response."
  exit 1
fi

echo "Created Box entry with id: $BOX_ID"
echo

echo "=== 3) Listing Box entry IDs (GET /box) ==="
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "$BASE_URL/box" \
  -H "$AUTH_HEADER"
echo

echo "=== 4) Fetching specific Box entry (GET /box/$BOX_ID) ==="
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER"
echo

echo "=== 5) Updating Box entry notes (PUT /box/$BOX_ID) ==="
UPDATE_BODY='{
  "notes": "updated notes from script"
}'

curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X PUT "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER" \
  -H "$JSON_HEADER" \
  -d "$UPDATE_BODY"
echo

echo "=== 6) Verifying updated Box entry (GET /box/$BOX_ID) ==="
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER"
echo

echo "=== 7) Deleting Box entry (DELETE /box/$BOX_ID) ==="
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X DELETE "$BASE_URL/box/$BOX_ID" \
  -H "$AUTH_HEADER"
echo

echo "=== 8) Clearing all Box entries for user (DELETE /box) ==="
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X DELETE "$BASE_URL/box" \
  -H "$AUTH_HEADER"
echo

echo "✅ Done! Token + Box endpoints basic flow tested."
