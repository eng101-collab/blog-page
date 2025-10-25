import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)
    const body = await request.json()
    const { title, slug, content, excerpt, categoryId, published } = body

    console.log("[v0] Updating post:", postId)
    const result = await sql.query(
      "UPDATE posts SET title = $1, slug = $2, content = $3, excerpt = $4, category_id = $5, published = $6, updated_at = NOW() WHERE id = $7 RETURNING id, title, slug, content, excerpt, category_id, published, created_at, updated_at",
      [title, slug, content, excerpt, categoryId || null, published || false, postId],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    console.log("[v0] Post updated successfully")
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = Number.parseInt(params.id)

    console.log("[v0] Deleting post:", postId)
    await sql.query("DELETE FROM posts WHERE id = $1", [postId])

    console.log("[v0] Post deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
