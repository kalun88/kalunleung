/**
 * kalunleung.ca Deploy Worker
 *
 * A tiny Cloudflare Worker that triggers a Cloudflare Pages rebuild.
 * Set DEPLOY_HOOK_URL as a secret environment variable in the Worker settings.
 *
 * Setup (web UI, no CLI needed):
 *   1. dash.cloudflare.com → Workers & Pages → Create Worker
 *   2. Paste this file, deploy it
 *   3. Settings → Variables → add DEPLOY_HOOK_URL (as a secret)
 *   4. Copy the worker URL and embed it in your Notion dashboard
 */

export default {
  async fetch(request, env) {
    const headers = {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *",
    };

    if (request.method === "POST") {
      try {
        const resp = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
        if (resp.ok) return new Response(html("✅", "Deploying!", "Your site will be live in ~2 minutes.", "#e8f5e9"), { headers });
        return new Response(html("❌", "Hook failed", "Check DEPLOY_HOOK_URL in Worker settings.", "#fce4ec"), { headers });
      } catch (e) {
        return new Response(html("❌", "Error", e.message, "#fce4ec"), { headers });
      }
    }

    // GET → show the publish button
    return new Response(html("🌐", "kalunleung.ca", buttonForm(), "#fafafa"), { headers });
  },
};

function html(icon, title, body, bg) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: ${bg};
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
  }
  .card { text-align: center; }
  .icon { font-size: 32px; margin-bottom: 8px; }
  .title { font-size: 18px; font-weight: 600; color: #111; margin-bottom: 6px; }
  .body { font-size: 14px; color: #555; }
  button {
    margin-top: 16px;
    background: #2f2f2f; color: #fff;
    border: none; border-radius: 6px;
    padding: 10px 28px; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: background 0.15s;
  }
  button:hover { background: #000; }
  a { display: block; margin-top: 12px; font-size: 13px; color: #888; text-decoration: none; }
  a:hover { color: #444; }
</style></head>
<body><div class="card">
  <div class="icon">${icon}</div>
  <div class="title">${title}</div>
  <div class="body">${body}</div>
</div></body></html>`;
}

function buttonForm() {
  return `<form method="POST" style="margin-top:0">
    <button type="submit">🚀 Publish Website</button>
  </form>
  <a href=".">↺ Refresh</a>`;
}
