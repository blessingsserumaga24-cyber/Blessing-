CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'News desk',
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published','draft')),
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_articles_status_created ON articles(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured DESC);
