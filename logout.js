export async function onRequestPost() {
  // The bearer token is short-lived and held only in the browser session.
  return Response.json({ ok: true });
}
