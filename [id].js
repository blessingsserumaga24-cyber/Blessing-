import { requireAdmin } from "../_auth.js";
const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function onRequestPut(ctx) {
  const auth=await requireAdmin(ctx.request,ctx.env); if(!auth)return json({error:"Administrator login required."},401);
  const b=await ctx.request.json().catch(()=>null), id=ctx.params.id;
  if(!b||!b.title?.trim()||!b.summary?.trim()||!b.body?.trim())return json({error:"Headline, summary and article text are required."},400);
  const cats=["Uganda","Politics","Business","Sports","Entertainment","World","Technology","Education","Health"];
  if(!cats.includes(b.category)||!["published","draft"].includes(b.status))return json({error:"Invalid category or status."},400);
  if(b.image_url&&!/^https:\/\/\S+$/i.test(b.image_url))return json({error:"Photo URL must start with https://."},400);
  const now=new Date().toISOString();
  const result=await ctx.env.DB.prepare("UPDATE articles SET title=?,category=?,summary=?,body=?,image_url=?,author=?,status=?,featured=?,updated_at=? WHERE id=?")
   .bind(b.title,b.category,b.summary,b.body,b.image_url||"",b.author||"News desk",b.status,b.featured?1:0,now,id).run();
  if(!result.meta?.changes)return json({error:"Article not found."},404);
  return json({ok:true});
}
export async function onRequestDelete(ctx) {
  const auth=await requireAdmin(ctx.request,ctx.env); if(!auth)return json({error:"Administrator login required."},401);
  await ctx.env.DB.prepare("DELETE FROM articles WHERE id=?").bind(ctx.params.id).run();
  return json({ok:true});
}
