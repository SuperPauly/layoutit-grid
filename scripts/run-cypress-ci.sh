#!/usr/bin/env bash
set -euo pipefail

install_linux_deps_if_needed() {
  if ! command -v apt-get >/dev/null 2>&1 || [ "$(id -u)" -ne 0 ]; then
    return 0
  fi

  if ldconfig -p | grep -q 'libatk-1.0.so.0'; then
    return 0
  fi

  echo "Installing Linux dependencies required by Cypress..."
  apt-get update
  apt-get install -y \
    xvfb \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2t64 \
    libgtk-3-0 \
    libgbm1 \
    libasound2t64 \
    libnss3 \
    libxss1 \
    libxshmfence1 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libxtst6
}

ensure_cypress() {
  if ! cypress verify >/dev/null 2>&1; then
    echo "Cypress binary not found, installing..."
    cypress install
  fi
}

install_linux_deps_if_needed
ensure_cypress

if command -v xvfb-run >/dev/null 2>&1; then
  exec xvfb-run -a cypress run "$@"
fi

echo "xvfb-run not found and automatic install is not available."
echo "Please install xvfb or run in an environment with a display server."
exit 1
