export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;
  if (!username || !password || !env.SESSION_SECRET) {
    return Response.json({ error: "Admin secrets are not configured." }, { status: 503 });
  }
  if (body.username !== username || body.password !== password) {
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  }
  const token = await makeToken(username, env.SESSION_SECRET);
  return Response.json({ token }, { headers: { "Cache-Control": "no-store" } });
}
async function makeToken(username, secret) {
  const payload = btoa(JSON.stringify({ sub: username, exp: Date.now() + 8 * 60 * 60 * 1000 })).replace(/=/g, "");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${payload}.${signature}`;
}
