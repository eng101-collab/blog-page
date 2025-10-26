"use client"
import { use } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PostForm } from "@/components/post-form"
import { Post, Category } from "../../../../types/post"

// Types are defined locally in this file, no external import needed

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        console.log(`_ Fetching post ${id} for editing...`)
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch("/api/categories"),
        ])

        if (!postRes.ok) {
          router.push("/not-found")
          return
        }

        const postData = await postRes.json()
        const categoriesData = await categoriesRes.json()

        setPost(postData)
        setCategories(categoriesData)
        console.log(`_ Loaded post: ${postData.title}`)
      } catch (error) {
        console.error("_ Error fetching post:", error)
        router.push("/not-found")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, router])

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

        <PostForm categories={categories as unknown as Category[]} initialPost={post} />
      </div>
    </main>
  )
}
