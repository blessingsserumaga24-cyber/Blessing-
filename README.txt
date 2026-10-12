UGANDA NEWS MEDIA — Cloudflare Pages project

WHAT IS INCLUDED
- Premium mobile-friendly news homepage.
- Heart emoji opens administrator login.
- Admin dashboard to create, edit, publish, save drafts, feature and delete articles.
- Server-side login and API using Cloudflare Pages Functions.
- D1 database schema for article persistence.
- Public homepage reads published articles from the database.

IMPORTANT
This is a Cloudflare Pages project with a backend, not a static-only ZIP. If you upload only the public folder through the Direct Upload screen, the admin API will not run. Deploy the project using Cloudflare Pages with a Git repository or Wrangler, and bind a D1 database.

SETUP OVERVIEW
1. Create a D1 database named: uganda-news-media-db
2. Run schema.sql against that database.
3. Copy the database ID into wrangler.toml.
4. Deploy the project to Cloudflare Pages with Functions enabled (Wrangler or Git integration).
5. In Pages > your project > Settings > Variables and Secrets, set:
   ADMIN_USERNAME = your chosen admin username
   ADMIN_PASSWORD = a long, unique password
   SESSION_SECRET = a long random secret (at least 32 random characters)
6. Bind the D1 database as variable name DB.
7. Redeploy and test login, create/edit/delete and public article listing.

PHOTO UPLOAD
The current editor accepts a secure HTTPS photo URL. Direct file upload is not enabled in this starter; to support direct uploads, configure Cloudflare R2 and add a signed upload endpoint. Do not paste private credentials into the public HTML.

GOOGLE
Cloudflare Pages sites can be crawled by Google when publicly accessible, but indexing is not guaranteed. Add a sitemap, robots.txt, and Google Search Console property after the custom domain is connected. The site does not automatically become a source for every AI service.

SECURITY
The password is checked server-side and the API requires a signed, expiring session token. Choose a strong unique password and do not share it. Consider rate limiting the login endpoint before a high-traffic public launch.
