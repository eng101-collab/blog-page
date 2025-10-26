"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CommentForm } from "@/components/comment-form"
import { CommentList } from "@/components/comment-list"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  createdAt: string
  views: number
  category?: { name: string }
}

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        console.log(`_ Fetching post with slug: ${slug}`)
        const res = await fetch(`/api/posts?slug=${slug}`)
        const data = await res.json()

        if (!data || data.length === 0) {
          router.push("/not-found")
          return
        }

        setPost(data[0])
        console.log(`_ Post loaded: ${data[0].title}`)
      } catch (error) {
        console.error("_ Error fetching post:", error)
        router.push("/not-found")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Post not found</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              ← Back to Articles
            </Button>
          </Link>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
                {post.category?.name || "Uncategorized"}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground text-balance">{post.title}</h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-foreground whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-b border-border py-6 mb-12">
          <p className="text-sm text-muted-foreground">{post.views || 0} views</p>
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <CommentForm postId={Number(post.id)} />
          </div>

          <CommentList comments={[]} />
        </div>
      </article>
    </main>
  )
}
