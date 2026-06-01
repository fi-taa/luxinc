#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ENV_FILE:-.env.local}"
SCOPE="${VERCEL_SCOPE:-fitaas-projects}"
PROJECT="${VERCEL_PROJECT:-luxinc}"
PRODUCTION_APP_URL="${1:-${PRODUCTION_APP_URL:-}}"

read_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -1 || true)"
  if [[ -z "$line" ]]; then
    return 1
  fi
  printf '%s' "${line#*=}"
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — create it from .env.example"
  exit 1
fi

if ! vercel whoami &>/dev/null; then
  echo "Not logged in to Vercel. Run:"
  echo "  vercel login"
  echo "Or: VERCEL_TOKEN=... $0"
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "Linking to $SCOPE/$PROJECT ..."
  vercel link --yes --scope "$SCOPE" --project "$PROJECT"
fi

if [[ -z "$PRODUCTION_APP_URL" ]]; then
  PRODUCTION_APP_URL="https://luxinc.vercel.app"
  echo "Using PRODUCTION_APP_URL=$PRODUCTION_APP_URL (pass URL as first arg to override)"
fi

PRODUCTION_APP_URL="${PRODUCTION_APP_URL%/}"

set_env() {
  local name="$1"
  local value="$2"
  local sensitive="${3:-false}"
  local extra=()
  if [[ "$sensitive" == "true" ]]; then
    extra+=(--sensitive)
  fi
  for target in production preview; do
    if ((${#extra[@]})); then
      printf '%s' "$value" | vercel env add "$name" "$target" --force --yes "${extra[@]}" >/dev/null
    else
      printf '%s' "$value" | vercel env add "$name" "$target" --force --yes >/dev/null
    fi
    echo "  $name → $target"
  done
}

SUPABASE_URL="$(read_env NEXT_PUBLIC_SUPABASE_URL)"
SUPABASE_ANON="$(read_env NEXT_PUBLIC_SUPABASE_ANON_KEY)"
SERVICE_ROLE="$(read_env SUPABASE_SERVICE_ROLE_KEY)"
CHAPA_KEY="$(read_env CHAPA_SECRET_KEY || true)"
CHAPA_WEBHOOK="$(read_env CHAPA_WEBHOOK_SECRET || true)"

echo "Pushing env from $ENV_FILE to Vercel ($SCOPE/$PROJECT) ..."

set_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" false
set_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON" true
set_env "SUPABASE_SERVICE_ROLE_KEY" "$SERVICE_ROLE" true
set_env "NEXT_PUBLIC_APP_URL" "$PRODUCTION_APP_URL" false

if [[ -n "$CHAPA_KEY" ]]; then
  set_env "CHAPA_SECRET_KEY" "$CHAPA_KEY" true
fi

if [[ -n "$CHAPA_WEBHOOK" ]]; then
  set_env "CHAPA_WEBHOOK_SECRET" "$CHAPA_WEBHOOK" true
fi

echo ""
echo "Done. Redeploy production:"
echo "  cd $ROOT && vercel deploy --prod --scope $SCOPE"
