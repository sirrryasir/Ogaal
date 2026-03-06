#!/usr/bin/env bash
# exit on error
set -o errexit

# Install pnpm correctly
npm install -g pnpm

# Install dependencies
pnpm install

# Build
pnpm run build
