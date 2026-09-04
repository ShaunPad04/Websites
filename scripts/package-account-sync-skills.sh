#!/usr/bin/env bash
# package-account-sync-skills.sh
#
# Regenerates the claude.ai account-sync upload package from the canonical
# source in account-sync-skills/.
#
# The archives are NOT committed: they are derived artifacts that would only
# duplicate the unpacked canonical source and rot as soon as a skill changes.
# Regenerate whenever you update a skill, then upload.
#
#   bash scripts/package-account-sync-skills.sh            # build into dist/
#   bash scripts/package-account-sync-skills.sh --verify   # verify checksums only
#   bash scripts/package-account-sync-skills.sh --checksums # rewrite CHECKSUMS.txt
#
# Reproducibility: archives are built with a fixed mtime, fixed owner, sorted
# entry order and no gzip timestamp, so the same input bytes give the same
# output bytes on any machine.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/account-sync-skills"
DIST="$ROOT/dist"
SUMS="$SRC/CHECKSUMS.txt"
MODE="${1:-build}"

# Fixed epoch for reproducible archives (2026-01-01T00:00:00Z).
export SOURCE_DATE_EPOCH=1767225600

[ -d "$SRC" ] || { echo "missing $SRC" >&2; exit 1; }

skills() { find "$SRC" -maxdepth 1 -mindepth 1 -type d -printf '%f\n' | sort; }

# Deterministic per-skill hash: sha256 over the sorted list of per-file hashes.
skill_hash() { ( cd "$SRC" && find "$1" -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1 ); }

case "$MODE" in
  --checksums)
    : > "$SUMS"
    while read -r s; do printf '%s  %s\n' "$(skill_hash "$s")" "$s" >> "$SUMS"; done < <(skills)
    echo "wrote $SUMS ($(wc -l < "$SUMS") skills)"
    ;;

  --verify)
    [ -f "$SUMS" ] || { echo "no CHECKSUMS.txt" >&2; exit 1; }
    fail=0
    while read -r want name; do
      got="$(skill_hash "$name" 2>/dev/null || echo MISSING)"
      if [ "$got" = "$want" ]; then printf '  OK    %s\n' "$name"
      else printf '  FAIL  %s\n        expected %s\n        actual   %s\n' "$name" "$want" "$got"; fail=$((fail+1)); fi
    done < "$SUMS"
    echo; [ "$fail" -eq 0 ] && echo "all $(wc -l < "$SUMS") skills verified" || { echo "$fail mismatch(es)"; exit 1; }
    ;;

  build|*)
    rm -rf "$DIST"; mkdir -p "$DIST/zips"
    n=0
    while read -r s; do
      ( cd "$SRC" && find "$s" -print0 | sort -z | \
          tar --null --files-from=- --owner=0 --group=0 --numeric-owner \
              --mtime="@$SOURCE_DATE_EPOCH" --format=gnu -cf - ) \
        | gzip -n -9 > "$DIST/zips/$s.tar.gz"
      n=$((n+1))
    done < <(skills)

    # One combined archive for convenience.
    ( cd "$SRC" && find . -print0 | sort -z | \
        tar --null --files-from=- --owner=0 --group=0 --numeric-owner \
            --mtime="@$SOURCE_DATE_EPOCH" --format=gnu -cf - ) \
      | gzip -n -9 > "$DIST/account-sync-skills.tar.gz"

    echo "built $n per-skill archives + 1 combined archive in $DIST"
    echo "combined sha256: $(sha256sum "$DIST/account-sync-skills.tar.gz" | cut -d' ' -f1)"
    echo
    echo "Upload: see docs/ACCOUNT-SYNC-UPLOAD.md"
    ;;
esac
