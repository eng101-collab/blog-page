import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const postId = Number.parseInt(id)

    console.log("_ Fetching post:", postId)
    const result = await sql.query(
      "SELECT p.id, p.title, p.slug, p.content, p.excerpt, p.category_id, p.published, p.views, p.created_at, p.updated_at, c.id as category_id, c.name as category_name FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1",
      [postId],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = result[0]
    console.log("_ Post found:", post.title)
    
    return NextResponse.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      categoryId: post.category_id,
      published: post.published,
      views: post.views,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      category: post.category_name ? { id: post.category_id, name: post.category_name } : null,
    })
  } catch (error) {
    console.error("_ Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const postId = Number.parseInt(id)
    const body = await request.json()
    const { title, slug, content, excerpt, categoryId, published } = body

    console.log("_ Updating post:", postId)
    const result = await sql.query(
      "UPDATE posts SET title = $1, slug = $2, content = $3, excerpt = $4, category_id = $5, published = $6, updated_at = NOW() WHERE id = $7 RETURNING id, title, slug, content, excerpt, category_id, published, created_at, updated_at",
      [title, slug, content, excerpt, categoryId || null, published || false, postId],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    console.log("_ Post updated successfully")
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("_ Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const postId = Number.parseInt(id)

    console.log("_ Deleting post:", postId)
    await sql.query("DELETE FROM posts WHERE id = $1", [postId])

    console.log("_ Post deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("_ Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}