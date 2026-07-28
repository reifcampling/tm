#!/usr/bin/env bash

set -euo pipefail

STEP_NAME="${1:-Unknown step}"
STEP_RESULT="${2:-unknown}"

case "$STEP_RESULT" in
  success)
    STATUS_ICON="✅"
    STATUS_TEXT="Succeeded"
    ;;
  failure)
    STATUS_ICON="❌"
    STATUS_TEXT="Failed"
    ;;
  cancelled)
    STATUS_ICON="⚠️"
    STATUS_TEXT="Cancelled"
    ;;
  skipped)
    STATUS_ICON="⏭️"
    STATUS_TEXT="Skipped"
    ;;
  *)
    STATUS_ICON="ℹ️"
    STATUS_TEXT="$STEP_RESULT"
    ;;
esac

RUN_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
COMMIT_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}"
SHORT_SHA="${GITHUB_SHA:0:7}"

payload="$(
  jq -n \
    --arg fallback "$STEP_NAME: $STATUS_TEXT" \
    --arg icon "$STATUS_ICON" \
    --arg status "$STATUS_TEXT" \
    --arg step "$STEP_NAME" \
    --arg repository "$GITHUB_REPOSITORY" \
    --arg branch "$GITHUB_REF_NAME" \
    --arg actor "$GITHUB_ACTOR" \
    --arg sha "$SHORT_SHA" \
    --arg commit_url "$COMMIT_URL" \
    --arg run_url "$RUN_URL" \
    '{
      text: $fallback,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: (
              $icon + " *Pipeline step " + $status + "*\n" +
              "*Step:* " + $step + "\n" +
              "*Repository:* `" + $repository + "`\n" +
              "*Branch:* `" + $branch + "`\n" +
              "*Commit:* <" + $commit_url + "|" + $sha + ">\n" +
              "*Triggered by:* " + $actor + "\n" +
              "*Workflow:* <" + $run_url + "|View GitHub Actions run>"
            )
          }
        }
      ]
    }'
)"

curl \
  --fail-with-body \
  --silent \
  --show-error \
  --request POST \
  --header "Content-Type: application/json" \
  --data "$payload" \
  "$SLACK_WEBHOOK_URL"
