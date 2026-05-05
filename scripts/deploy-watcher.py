#!/usr/bin/env python3
"""
kalunleung.ca Deploy Watcher
────────────────────────────
Polls the Notion "Website Config" database every 5 minutes for a Deploy Pending flag.
When detected, fires the Cloudflare Pages deploy hook and updates the record status.

Notion config record ID : 31086f76-4edc-81e6-a001-e7e17ccfa23d
Notion config DB ID     : 14635dc1-16b7-4c42-b517-ee26244defaa
"""

import os
import json
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR        = Path(__file__).parent
PROJECT_DIR       = SCRIPT_DIR.parent
ENV_FILE          = PROJECT_DIR / ".env.local"
LOG_FILE          = SCRIPT_DIR / "deploy-watcher.log"

CONFIG_PAGE_ID    = "31086f76-4edc-81e6-a001-e7e17ccfa23d"
NOTION_API_VERSION = "2022-06-28"

# ── Helpers ───────────────────────────────────────────────────────────────────

def load_env(path: Path) -> dict:
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip()
    return env


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except Exception:
        pass


def notion_request(method: str, endpoint: str, token: str, data=None):
    url = f"https://api.notion.com/v1/{endpoint}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        log(f"Notion API error {e.code}: {e.read().decode()[:200]}")
        return None
    except Exception as e:
        log(f"Notion request failed: {e}")
        return None


def get_config(token: str) -> dict | None:
    result = notion_request("GET", f"pages/{CONFIG_PAGE_ID}", token)
    if not result:
        return None
    props = result.get("properties", {})

    hook_url_obj = props.get("CF Deploy Hook URL", {}).get("url") or ""
    status_obj   = (props.get("Deploy Status", {}).get("select") or {})

    return {
        "deploy_pending": props.get("Deploy Pending", {}).get("checkbox", False),
        "cf_hook_url":    hook_url_obj.strip(),
        "deploy_status":  status_obj.get("name", ""),
    }


def update_config(token: str, deploy_pending: bool, deploy_status: str,
                  set_last_deploy: bool = False):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    props = {
        "Deploy Pending": {"checkbox": deploy_pending},
        "Deploy Status":  {"select": {"name": deploy_status}},
    }
    if set_last_deploy:
        props["Last Deploy"] = {"date": {"start": now}}
    notion_request("PATCH", f"pages/{CONFIG_PAGE_ID}", token, {"properties": props})


def fire_deploy_hook(url: str) -> bool:
    req = urllib.request.Request(
        url, data=b"{}", method="POST",
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status in (200, 201)
    except Exception as e:
        log(f"Deploy hook request failed: {e}")
        return False


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    # Load Notion API secret from .env.local
    env = load_env(ENV_FILE)
    token = env.get("NOTION_API_SECRET", "").strip()
    if not token:
        log("ERROR: NOTION_API_SECRET not found in .env.local")
        sys.exit(1)

    log("Checking deploy status...")
    config = get_config(token)
    if config is None:
        log("ERROR: Could not read Website Config from Notion.")
        sys.exit(1)

    if not config["deploy_pending"]:
        log("No deploy pending — nothing to do.")
        return

    hook_url = config["cf_hook_url"]
    if not hook_url or hook_url == "PASTE_YOUR_CF_DEPLOY_HOOK_URL_HERE":
        log("ERROR: CF Deploy Hook URL is not configured. "
            "Open the Notion Dashboard → Website Config and paste your hook URL.")
        update_config(token, False, "❌ Failed")
        return

    log("🚀 Deploy Pending detected! Firing Cloudflare deploy hook...")
    update_config(token, False, "🔄 Deploying", set_last_deploy=True)

    success = fire_deploy_hook(hook_url)

    if success:
        log("✅ Deploy hook fired successfully! Cloudflare is building your site.")
        update_config(token, False, "✅ Deployed", set_last_deploy=True)
    else:
        log("❌ Deploy hook failed. Check the hook URL in Notion Website Config.")
        update_config(token, False, "❌ Failed")


if __name__ == "__main__":
    main()
