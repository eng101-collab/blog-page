"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  category?: { name: string }
}

interface Category {
  id: string
  name: string
  description: string
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`[v0] Fetching category: ${params.slug}`)
        const res = await fetch("/api/categories")
        const categories = await res.json()
        const found = categories.find((c: Category) => c.slug === params.slug)

        if (!found) {
          router.push("/404")
          return
        }

        setCategory(found)

        // Fetch posts for this category
        const postsRes = await fetch(`/api/posts?category=${params.slug}&published=true`)
        const postsData = await postsRes.json()
        setPosts(postsData)
        console.log(`[v0] Loaded ${postsData.length} posts for category: ${params.slug}`)
      } catch (error) {
        console.error("[v0] Error fetching category:", error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            ← Back Home
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground">{category.description}</p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {post.category?.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-muted-foreground">Read more →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  )
}
