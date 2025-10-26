"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  title: string
  slug: string
  createdAt: string
  published: boolean
  views: number
  category?: { name: string }
}

interface Category {
  id: string
  name: string
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("_ Fetching dashboard data...")
        const [postsRes, categoriesRes] = await Promise.all([fetch("/api/posts?limit=100"), fetch("/api/categories")])
        const postsData = await postsRes.json()
        const categoriesData = await categoriesRes.json()
        setPosts(postsData)
        setCategories(categoriesData)
        console.log(`_ Fetched ${postsData.length} posts and ${categoriesData.length} categories`)
      } catch (error) {
        console.error("_ Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  const publishedPosts = posts.filter((p) => p.published).length

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog content and settings</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline">View Blog</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{publishedPosts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/dashboard/posts/new">
            <Button className="w-full" size="lg">
              Create New Post
            </Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button className="w-full bg-transparent" size="lg" variant="outline">
              Manage Categories
            </Button>
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.category?.name || "Uncategorized"} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          post.published ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">{post.views || 0} views</div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this post?")) {
                            try {
                              const res = await fetch(`/api/posts/${post.id}`, {
                                method: "DELETE",
                              })
                              if (res.ok) {
                                setPosts(posts.filter((p) => p.id !== post.id))
                              }
                            } catch (error) {
                              console.error("_ Error deleting post:", error)
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
