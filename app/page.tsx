"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  category?: Category
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(" Fetching categories and posts...")

        const [categoriesRes, postsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/posts?limit=3&published=true"),
        ])

        if (!categoriesRes.ok || !postsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const categoriesData = await categoriesRes.json()
        const postsData = await postsRes.json()

        console.log(" Data fetched successfully")
        setCategories(categoriesData)
        setRecentPosts(postsData)
      } catch (err) {
        console.error(" Error fetching data:", err)
        setError("Failed to load content")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Welcome to Our Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Discover insightful articles about technology, design, and business. Stay updated with the latest trends
              and best practices.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/blog">
                <Button size="lg">Read Articles</Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-primary/5">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Ready to Share Your Story?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Start creating and publishing your own articles. Build your audience and share your expertise with the
                world.
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard/posts/new">
                  <Button size="lg">Create Your First Post</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="inline-block bg-primary/10 rounded-lg p-8">
                <div className="text-5xl font-bold text-primary mb-2">✨</div>
                <p className="text-muted-foreground">Start creating content today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section>
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Articles</h2>
              <Link href="/blog">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {post.category?.name || "Uncategorized"}
                        </span>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
