"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PostForm } from "@/components/post-form"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  categoryId: string
  published: boolean
}

interface Category {
  id: string
  name: string
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`[v0] Fetching post ${params.id} for editing...`)
        const [postRes, categoriesRes] = await Promise.all([fetch(`/api/posts/${params.id}`), fetch("/api/categories")])

        if (!postRes.ok) {
          router.push("/404")
          return
        }

        const postData = await postRes.json()
        const categoriesData = await categoriesRes.json()

        setPost(postData)
        setCategories(categoriesData)
        console.log(`[v0] Loaded post: ${postData.title}`)
      } catch (error) {
        console.error("[v0] Error fetching post:", error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id, router])

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
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Post</h1>
          <p className="text-muted-foreground">Update your article</p>
        </div>

        <PostForm categories={categories} initialPost={post} />
      </div>
    </main>
  )
}
