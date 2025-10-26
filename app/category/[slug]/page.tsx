"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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

export default function CategoryPage() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string } // ✅ this replaces params prop
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      try {
        console.log(`_ Fetching category: ${slug}`)
        const res = await fetch("/api/categories")
        const categories = await res.json()
        const found = categories.find((c: any) => c.slug === slug)

        if (!found) {
          router.push("/not-found")
          return
        }

        setCategory(found)

        const postsRes = await fetch(`/api/posts?category=${slug}&published=true`)
        const postsData = await postsRes.json()
        setPosts(postsData)
        console.log(`_ Loaded ${postsData.length} posts for category: ${slug}`)
      } catch (error) {
        console.error("_ Error fetching category:", error)
        router.push("/not-found")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, router])

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
