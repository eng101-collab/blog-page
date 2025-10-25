"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: number
  name: string
  slug: string
}

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  categoryId: number | null
  published: boolean
}

export function PostForm({
  categories,
  initialPost,
}: {
  categories: Category[]
  initialPost?: Post
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title || "")
  const [slug, setSlug] = useState(initialPost?.slug || "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "")
  const [content, setContent] = useState(initialPost?.content || "")
  const [categoryId, setCategoryId] = useState(initialPost?.categoryId?.toString() || "")
  const [published, setPublished] = useState(initialPost?.published || false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = initialPost ? "PUT" : "POST"
      const url = initialPost ? `/api/posts/${initialPost.id}` : "/api/posts"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          categoryId: categoryId ? Number.parseInt(categoryId) : null,
          published,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error saving post:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialPost ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="post-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Brief summary of the post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-mono text-sm"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish this post
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialPost ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
