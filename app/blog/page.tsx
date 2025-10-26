"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  views: number
  category?: { name: string }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("_ Fetching all posts...")
        const res = await fetch("/api/posts?published=true&limit=100")
        const data = await res.json()
        setPosts(data)
        console.log(`_ Fetched ${data.length} posts`)
      } catch (error) {
        console.error("_ Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
              ← Back to Home
            </button>
          </Link>
        </div>
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">All Articles</h1>
          <p className="text-lg text-muted-foreground">Explore our complete collection of articles and insights.</p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {post.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.views || 0} views</span>
                    <span>Read more →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles found.</p>
          </div>
        )}
      </div>
    </main>
  )
}
