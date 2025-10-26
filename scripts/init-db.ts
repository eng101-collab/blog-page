import { Client } from "@neondatabase/serverless"

async function initializeDatabase() {
  try {
    console.log("_ ========== DATABASE INITIALIZATION START ==========")

    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.NEON_DATABASE_URL

    if (!databaseUrl) {
      console.error("_ ERROR: DATABASE_URL is not set")
      console.error("_ Available environment variables:")
      Object.entries(process.env).forEach(([key, value]) => {
        if (key.includes("DATABASE") || key.includes("NEON") || key.includes("POSTGRES")) {
          console.error(`_   ${key}: ${value?.substring(0, 50)}...`)
        }
      })
      throw new Error("DATABASE_URL is not set")
    }

    console.log("_ Database URL found, connecting...")
    const client = new Client({ connectionString: databaseUrl })
    await client.connect()
    console.log("_ ✓ Connected to database")

    console.log("_ Creating tables...")

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `)
    console.log("_ ✓ Categories table created")

    // Create posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt VARCHAR(500),
        category_id INTEGER REFERENCES categories(id),
        published BOOLEAN DEFAULT FALSE NOT NULL,
        views INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `)
    console.log("_ ✓ Posts table created")

    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `)
    console.log("_ ✓ Comments table created")

    // Seed categories
    console.log("_ Seeding categories...")
    const categoryResult = await client.query(`
      INSERT INTO categories (name, slug, description) VALUES
        ('Technology', 'technology', 'Latest tech news and updates'),
        ('Design', 'design', 'Design trends and best practices'),
        ('Business', 'business', 'Business insights and strategies')
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `)
    console.log(`_ ✓ Categories seeded (${categoryResult.rows.length} rows)`)

    // Seed posts
    console.log("_ Seeding posts...")
    const postResult = await client.query(`
      INSERT INTO posts (title, slug, content, excerpt, category_id, published) VALUES
        ('Getting Started with Next.js', 'getting-started-nextjs', 'Next.js is a React framework...', 'Learn the basics of Next.js', 1, true),
        ('Design Principles', 'design-principles', 'Good design is about...', 'Essential design principles', 2, true),
        ('Business Growth Strategies', 'business-growth', 'Growing your business requires...', 'Strategies for business growth', 3, true)
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `)
    console.log(`_ ✓ Posts seeded (${postResult.rows.length} rows)`)

    await client.end()
    console.log("_ ✓ Database connection closed")
    console.log("_ ========== DATABASE INITIALIZATION SUCCESS ==========")
  } catch (error) {
    console.error("_ ========== DATABASE INITIALIZATION FAILED ==========")
    console.error("_ Error:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error("_ Stack:", error.stack)
    }
    process.exit(1)
  }
}

initializeDatabase()
