import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("_ Fetching posts...")

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const published = searchParams.get("published") === "true"
    const slug = searchParams.get("slug")
    const category = searchParams.get("category")

    console.log(`_ Fetching posts with limit=${limit}, published=${published}, slug=${slug}, category=${category}`)

    let query =
      "SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.published, p.views, p.created_at, c.id as category_id, c.name as category_name, c.slug as category_slug " +
      "FROM posts p LEFT JOIN categories c ON p.category_id = c.id"

    const params: (string | number | boolean)[] = []
    const conditions: string[] = []

    if (published) {
      conditions.push(`p.published = $${params.length + 1}`)
      params.push(true)
    }

    if (slug) {
      conditions.push(`p.slug = $${params.length + 1}`)
      params.push(slug)
    }

    if (category) {
      conditions.push(`c.slug = $${params.length + 1}`)
      params.push(category)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY p.created_at DESC"
    
    if (limit) {
      query += " LIMIT $" + (params.length + 1)
      params.push(limit)
    }

    // ✅ Correct usage in Drizzle v2+
    const allPosts = await sql.query(query, params)
    console.log(`_ Found ${allPosts.length} posts`)

    // Transform to match frontend expected format
    const transformedPosts = allPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      createdAt: post.created_at,
      category: post.category_name
        ? { id: post.category_id, name: post.category_name }
        : undefined,
      published: post.published ?? true,
      views: post.views ?? 0,
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error("_ Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, categoryId, published } = body

    console.log("_ Creating new post:", { title, slug })

    // ✅ Use sql.query(...) for INSERT with parameters
    const result = await sql.query(
      "INSERT INTO posts (title, slug, content, excerpt, category_id, published) " +
        "VALUES ($1, $2, $3, $4, $5, $6) " +
        "RETURNING id, title, slug, content, excerpt, category_id, published, created_at",
      [title, slug, content, excerpt, categoryId || null, published || false]
    )

    console.log("_ Post created successfully")
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("_ Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
