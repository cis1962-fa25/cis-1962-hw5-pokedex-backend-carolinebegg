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
