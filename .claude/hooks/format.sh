#!/usr/bin/env bash
# PostToolUse hook: run Prettier on the file Claude just wrote or edited.
# Never blocks the edit; formatting problems show up later in `pnpm verify`.
file=$(jq -r '.tool_input.file_path // empty')
[[ -z "$file" || ! -f "$file" ]] && exit 0

case "$file" in
  *.astro | *.ts | *.mjs | *.js | *.css | *.json | *.md | *.yaml | *.yml) ;;
  *) exit 0 ;;
esac

cd "$CLAUDE_PROJECT_DIR" && pnpm exec prettier --write --log-level=silent "$file" >/dev/null 2>&1
exit 0
