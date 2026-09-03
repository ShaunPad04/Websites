#!/usr/bin/env bash
set -euo pipefail

# Start the validated Codespaces overflow lane without putting provider secrets
# in git, documentation, or shell history. GEMINI_API_KEY must be supplied by a
# GitHub Codespaces Secret scoped to this repository.

PORT="${OMNIROUTE_PORT:-20128}"
MODEL="${OMNIROUTE_OVERFLOW_MODEL:-gemini-3.7-flash}"

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  cat >&2 <<'EOF'
GEMINI_API_KEY is not available in this Codespace.
Add it at GitHub -> Settings -> Codespaces -> Secrets, scope it to this repo,
then stop and restart the Codespace so the secret is injected.
EOF
  exit 1
fi

# OmniRoute otherwise listens on 0.0.0.0. Keep the router loopback-only.
export OMNIROUTE_SERVER_HOST="${OMNIROUTE_SERVER_HOST:-127.0.0.1}"

# Configure (or update) the native Gemini provider directly in OmniRoute's local
# store before starting the server. OmniRoute 3.8.50's setup command can read the
# provider key from its process environment; the value never appears in argv or
# the user's shell history. The env assignment applies only to this one command.
OMNIROUTE_API_KEY="$GEMINI_API_KEY" \
  omniroute setup \
    --non-interactive \
    --add-provider \
    --provider gemini \
    --provider-name gemini \
    --default-model "$MODEL" \
    >/dev/null

# Start once. --daemon returns control to the terminal; --no-open avoids trying
# to launch the dashboard in a browser tab.
if ! curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  omniroute serve --port "$PORT" --daemon --no-open

  ready=0
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
      ready=1
      break
    fi
    sleep 1
  done

  if [[ "$ready" -ne 1 ]]; then
    echo "OmniRoute did not become reachable on 127.0.0.1:${PORT}." >&2
    exit 1
  fi
fi

# Fail closed if the expected loopback listener is not present.
if ! ss -ltn 2>/dev/null | grep -Eq "127\\.0\\.0\\.1:${PORT}([[:space:]]|$)"; then
  echo "Safety check failed: OmniRoute is not listening on 127.0.0.1:${PORT}." >&2
  exit 1
fi

cat <<EOF
Overflow lane ready.

Cline -> API Configuration:
  API Provider: OpenAI Compatible
  Base URL:     http://127.0.0.1:${PORT}
  API Key:      sk_omniroute
  Model ID:     gemini/${MODEL}

Do not append /v1 to the Base URL; Cline appends the OpenAI path itself.
EOF
