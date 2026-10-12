import { requireAdmin } from "./_auth.js";
const json = (data, status=200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function onRequestGet({ env }) {
  const { results=[] } = await env.DB.prepare("SELECT id,title,category,summary,body,image_url,author,status,featured,created_at,updated_at FROM articles WHERE status='published' ORDER BY featured DESC, created_at DESC").all();
  return json({ articles: results });
}
export async function onRequestPost(ctx) {
  const auth = await requireAdmin(ctx.request, ctx.env);
  if (!auth) return json({ error: "Administrator login required." }, 401);
  const b = await ctx.request.json().catch(()=>null);
  const error = validate(b); if (error) return json({error},400);
  const id = crypto.randomUUID(), now = new Date().toISOString();
  await ctx.env.DB.prepare("INSERT INTO articles (id,title,category,summary,body,image_url,author,status,featured,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id,b.title,b.category,b.summary,b.body,b.image_url||"",b.author||"News desk",b.status||"published",b.featured?1:0,now,now).run();
  return json({ ok:true, id });
}
function validate(b) {
  if (!b || typeof b.title!=="string" || !b.title.trim() || b.title.length>180) return "Headline is required (maximum 180 characters).";
  if (typeof b.summary!=="string" || !b.summary.trim() || b.summary.length>400) return "Summary is required (maximum 400 characters).";
  if (typeof b.body!=="string" || !b.body.trim()) return "Article text is required.";
  const cats=["Uganda","Politics","Business","Sports","Entertainment","World","Technology","Education","Health"];
  if (!cats.includes(b.category)) return "Choose a valid category.";
  if (b.image_url && !/^https:\/\/\S+$/i.test(b.image_url)) return "Photo URL must start with https://.";
  if (!["published","draft"].includes(b.status)) return "Invalid article status.";
  return null;
}
