#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

########################################
# Auth error tests for /box endpoints
########################################

# 1) No Authorization header at all
section "AUTH ERROR: GET /box with NO Authorization header (should be 401 UNAUTHORIZED)"
curl -s -X GET "$BASE_URL/box" -i
echo

# 2) Malformed scheme: 'Token' instead of 'Bearer'
section "AUTH ERROR: GET /box with wrong scheme 'Token' (should be 401 UNAUTHORIZED)"
curl -s -X GET "$BASE_URL/box" \
  -H "Authorization: Token somefakevalue" \
  -i
echo

# 3) Malformed Bearer header: 'Bearer' but no token
section "AUTH ERROR: GET /box with 'Bearer' but NO token (should be 401 UNAUTHORIZED)"
curl -s -X GET "$BASE_URL/box" \
  -H "Authorization: Bearer" \
  -i
echo

# 4) Invalid token value: clearly not a real JWT
section "AUTH ERROR: GET /box with invalid Bearer token (should be 401 UNAUTHORIZED)"
curl -s -X GET "$BASE_URL/box" \
  -H "Authorization: Bearer not-a-real-jwt-token" \
  -i
echo

# 5) Optional: corrupted version of a real token, if TOKEN happens to be set
if [ "${TOKEN-}" != "" ]; then
  CORRUPTED_TOKEN="${TOKEN}corrupted"

  section "AUTH ERROR: GET /box with corrupted real token (should be 401 UNAUTHORIZED)"
  curl -s -X GET "$BASE_URL/box" \
    -H "Authorization: Bearer $CORRUPTED_TOKEN" \
    -i
  echo
fi
