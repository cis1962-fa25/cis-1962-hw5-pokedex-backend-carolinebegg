#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

LIMIT="${1:-10}"
OFFSET="${2:-0}"

section "GET /pokemon?limit=$LIMIT&offset=$OFFSET"
curl -s -X GET "$BASE_URL/pokemon?limit=$LIMIT&offset=$OFFSET"
echo

section "GET /pokemon/pikachu"
curl -s -X GET "$BASE_URL/pokemon/pikachu"
echo

section "GET /pokemon/notapokemon (should be 404 / error)"
curl -s -X GET "$BASE_URL/pokemon/notapokemon" -i
echo

########################################
# Extra tests for HW spec coverage
########################################

# 1) Missing query params -> 400 BAD_REQUEST
section "GET /pokemon with MISSING query params (should be 400)"
curl -s -X GET "$BASE_URL/pokemon" -i
echo

section "GET /pokemon with ONLY limit (should be 400)"
curl -s -X GET "$BASE_URL/pokemon?limit=5" -i
echo

section "GET /pokemon with ONLY offset (should be 400)"
curl -s -X GET "$BASE_URL/pokemon?offset=0" -i
echo

# 2) Invalid query params -> 400 BAD_REQUEST
section "GET /pokemon with negative limit (should be 400)"
curl -s -X GET "$BASE_URL/pokemon?limit=-1&offset=0" -i
echo

section "GET /pokemon with non-numeric offset (should be 400)"
curl -s -X GET "$BASE_URL/pokemon?limit=10&offset=abc" -i
echo

# 3) Case-insensitive name handling
section "GET /pokemon/Pikachu (capitalized name)"
curl -s -X GET "$BASE_URL/pokemon/Pikachu"
echo

section "GET /pokemon/PIKACHU (all caps name)"
curl -s -X GET "$BASE_URL/pokemon/PIKACHU"
echo

# 4) Optional: lightweight JSON shape checks if jq is available
if command -v jq >/dev/null 2>&1; then
  section "jq sanity-check: /pokemon/pikachu stats & sprites shape"

  RESP=$(curl -s -X GET "$BASE_URL/pokemon/pikachu")

  echo "Sprites keys:"
  echo "$RESP" | jq '.sprites'

  echo
  echo "Stats object:"
  echo "$RESP" | jq '.stats'

  echo
  echo "First 3 moves (to see power being optional):"
  echo "$RESP" | jq '.moves[0:3]'
else
  section "Skipping jq-based shape checks (jq not installed)"
fi
