#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# setup-deploy-watcher.sh
# One-time installer for the kalunleung.ca deploy watcher.
# Run once from your project folder: bash scripts/setup-deploy-watcher.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WATCHER_SCRIPT="$SCRIPT_DIR/deploy-watcher.py"
PLIST_LABEL="ca.kalunleung.deploy-watcher"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_LABEL.plist"
LOG_DIR="$SCRIPT_DIR"
PYTHON="$(which python3)"

echo "──────────────────────────────────────────────"
echo " kalunleung.ca Deploy Watcher – Setup"
echo "──────────────────────────────────────────────"
echo " Script path : $WATCHER_SCRIPT"
echo " Python      : $PYTHON"
echo " Plist       : $PLIST_PATH"
echo ""

# Make watcher executable
chmod +x "$WATCHER_SCRIPT"

# Write the launchd plist
mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_LABEL</string>

    <key>ProgramArguments</key>
    <array>
        <string>$PYTHON</string>
        <string>$WATCHER_SCRIPT</string>
    </array>

    <!-- Run every 5 minutes (300 seconds) -->
    <key>StartInterval</key>
    <integer>300</integer>

    <!-- Also run immediately when loaded -->
    <key>RunAtLoad</key>
    <true/>

    <key>StandardOutPath</key>
    <string>$LOG_DIR/deploy-watcher.log</string>

    <key>StandardErrorPath</key>
    <string>$LOG_DIR/deploy-watcher.log</string>

    <!-- Restart if it crashes -->
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>
EOF

echo "✅ Plist written to $PLIST_PATH"

# Unload if already running (for re-installs)
if launchctl list | grep -q "$PLIST_LABEL"; then
    echo "↩︎  Unloading existing service..."
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Load the service
launchctl load "$PLIST_PATH"
echo "✅ Service loaded — deploy watcher is now running every 5 minutes."
echo ""
echo "Next steps:"
echo "  1. Go to your Notion Dashboard → Website Config"
echo "  2. Paste your Cloudflare deploy hook URL into 'CF Deploy Hook URL'"
echo "  3. Check 'Deploy Pending' to test your first deploy"
echo ""
echo "Useful commands:"
echo "  View logs     : tail -f $LOG_DIR/deploy-watcher.log"
echo "  Stop watcher  : bash $SCRIPT_DIR/uninstall-deploy-watcher.sh"
echo "  Test manually : python3 $WATCHER_SCRIPT"
