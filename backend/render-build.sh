#!/usr/bin/env bash
# exit on error
set -o errexit

# Install pnpm correctly (Version 9 to prevent build errors)
npm install -g pnpm@9

# Install dependencies
pnpm install

# Build
pnpm run build
