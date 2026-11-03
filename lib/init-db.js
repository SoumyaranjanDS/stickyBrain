import pool from "@/lib/db";

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
      REFERENCES users(id)
      ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    author_id UUID NOT NULL
      REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,

    category VARCHAR(30) NOT NULL DEFAULT 'thought'
      CHECK (
        category IN (
          'thought',
          'feature',
          'question',
          'project',
          'other'
        )
      ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS idea_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    idea_id UUID NOT NULL
      REFERENCES ideas(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
      REFERENCES users(id) ON DELETE CASCADE,

    reaction_type VARCHAR(20) NOT NULL
      CHECK (
        reaction_type IN (
          'like',
          'love',
          'interesting',
          'inspired'
        )
      ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_idea_reaction
      UNIQUE (idea_id, user_id)
  );
`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS idea_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    idea_id UUID NOT NULL
      REFERENCES ideas(id) ON DELETE CASCADE,

    author_id UUID NOT NULL
      REFERENCES users(id) ON DELETE CASCADE,

    content TEXT NOT NULL
      CHECK (LENGTH(TRIM(content)) > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);

  // Main feed: newest ideas first
  await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_ideas_feed
  ON ideas (created_at DESC, id DESC);
`);

  // Profile board: newest ideas by a particular user
  await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_ideas_author
  ON ideas (author_id, created_at DESC);
`);

  // Idea details: fetch comments in chronological order
  await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_comments_idea_created
  ON idea_comments (idea_id, created_at ASC);
`);
}
