#!/usr/bin/env bash

# Base URL of your backend
BASE_URL=${BASE_URL:-"http://localhost:3000"}

# Helper to require TOKEN
require_token() {
  if [ -z "${TOKEN:-}" ]; then
    echo "ERROR: TOKEN env var not set in this script."
    exit 1
  fi
}

# Prints a pretty header
section() {
  echo
  echo "========================================"
  echo "$1"
  echo "========================================"
}
