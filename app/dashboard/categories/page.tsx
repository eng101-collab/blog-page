"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryForm } from "@/components/category-form"

interface Category {
  id: string
  name: string
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("_ Fetching all categories...")
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
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Manage Categories</h1>
          <p className="text-muted-foreground">Create and organize your blog categories</p>
        </div>

        {/* Add New Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
          <CategoryForm />
        </div>

        {/* Existing Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Existing Categories</h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
