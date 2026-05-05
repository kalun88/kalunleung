#!/usr/bin/env bash
# Uninstalls the kalunleung.ca deploy watcher launchd service.
set -euo pipefail

PLIST_LABEL="ca.kalunleung.deploy-watcher"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_LABEL.plist"

if launchctl list | grep -q "$PLIST_LABEL"; then
    launchctl unload "$PLIST_PATH"
    echo "✅ Service unloaded."
else
    echo "Service was not running."
fi

if [ -f "$PLIST_PATH" ]; then
    rm "$PLIST_PATH"
    echo "✅ Plist removed from $PLIST_PATH"
fi

echo "Deploy watcher uninstalled."
