"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostForm } from "@/components/post-form"

interface Category {
  id: string
  name: string
}

export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("_ Fetching categories for new post form...")
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
        console.log(`_ Loaded ${data.length} categories`)
      } catch (error) {
        console.error("_ Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">Write and publish a new article</p>
        </div>

        {!loading && <PostForm categories={categories} />}
      </div>
    </main>
  )
}
