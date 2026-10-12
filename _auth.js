export async function requireAdmin(request, env) {
  const token=(request.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"");
  if(!token||!env.SESSION_SECRET)return false;
  const parts=token.split("."); if(parts.length!==2)return false;
  const [payload,signature]=parts;
  try {
    const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(env.SESSION_SECRET),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
    const sig=Uint8Array.from(atob(signature.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
    const valid=await crypto.subtle.verify("HMAC",key,sig,new TextEncoder().encode(payload));
    if(!valid)return false;
    const data=JSON.parse(atob(payload));
    return data.sub===env.ADMIN_USERNAME&&data.exp>Date.now();
  } catch { return false; }
}
