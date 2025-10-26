import { initTRPC } from "@trpc/server"
import { sql } from "./db"

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  // Categories
  categories: publicProcedure.query(async () => {
    try {
      console.log("_ Fetching categories...")
      const result = await sql.query("SELECT id, name, slug, description FROM categories ORDER BY name", [])
      console.log(`_ ✓ Fetched ${result.length} categories`)
      return result
    } catch (error) {
      console.error("_ Error fetching categories:", error)
      throw error
    }
  }),

  // Posts
  posts: publicProcedure.query(async () => {
    try {
      console.log("_ Fetching published posts...")
      const result = await sql.query(
        `
        SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.created_at, p.updated_at, p.published,
               c.id as category_id, c.name as category_name, c.slug as category_slug,
               COUNT(cm.id) as comment_count
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN comments cm ON p.id = cm.post_id AND cm.approved = true
        WHERE p.published = true
        GROUP BY p.id, c.id
        ORDER BY p.created_at DESC
      `,
        [],
      )
      console.log(`_ ✓ Fetched ${result.length} published posts`)
      return result.map((post: any) => ({
        ...post,
        category: post.category_id
          ? { id: post.category_id, name: post.category_name, slug: post.category_slug }
          : null,
      }))
    } catch (error) {
      console.error("_ Error fetching posts:", error)
      throw error
    }
  }),

  postBySlug: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val
      throw new Error("Invalid input")
    })
    .query(async ({ input }) => {
      try {
        console.log(`_ Fetching post with slug: ${input}`)
        const result = await sql.query(
          `
          SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.created_at, p.updated_at, p.published,
                 c.id as category_id, c.name as category_name, c.slug as category_slug
          FROM posts p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.slug = $1
          `,
          [input],
        )
        console.log(`_ ✓ Post found: ${result[0]?.title || "not found"}`)
        if (result.length === 0) return null
        const post = result[0]
        return {
          ...post,
          category: post.category_id
            ? { id: post.category_id, name: post.category_name, slug: post.category_slug }
            : null,
        }
      } catch (error) {
        console.error("_ Error fetching post by slug:", error)
        throw error
      }
    }),

  postsByCategory: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val
      throw new Error("Invalid input")
    })
    .query(async ({ input }) => {
      try {
        console.log(`_ Fetching posts for category: ${input}`)
        const result = await sql.query(
          `
          SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.created_at, p.updated_at, p.published,
                 c.id as category_id, c.name as category_name, c.slug as category_slug
          FROM posts p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = $1 AND p.published = true
          ORDER BY p.created_at DESC
          `,
          [input],
        )
        console.log(`_ ✓ Fetched ${result.length} posts for category: ${input}`)
        return result.map((post: any) => ({
          ...post,
          category: post.category_id
            ? { id: post.category_id, name: post.category_name, slug: post.category_slug }
            : null,
        }))
      } catch (error) {
        console.error("_ Error fetching posts by category:", error)
        throw error
      }
    }),

  // Comments
  addComment: publicProcedure
    .input((val: unknown) => {
      if (
        typeof val === "object" &&
        val !== null &&
        "postId" in val &&
        "author" in val &&
        "email" in val &&
        "content" in val
      ) {
        return val as { postId: number; author: string; email: string; content: string }
      }
      throw new Error("Invalid input")
    })
    .mutation(async ({ input }) => {
      try {
        console.log(`_ Adding comment to post ${input.postId} by ${input.author}`)
        const result = await sql.query(
          "INSERT INTO comments (post_id, author, email, content, approved) VALUES ($1, $2, $3, $4, false) RETURNING id, post_id, author, email, content, approved, created_at",
          [input.postId, input.author, input.email, input.content],
        )
        console.log(`_ ✓ Comment added successfully`)
        return result[0]
      } catch (error) {
        console.error("_ Error adding comment:", error)
        throw error
      }
    }),
})

export type AppRouter = typeof appRouter
