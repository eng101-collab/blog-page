"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CategoryForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
        }),
      })

      if (response.ok) {
        setName("")
        setSlug("")
        setDescription("")
        setMessage("Category created successfully!")
        router.refresh()
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Error creating category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      setMessage("Error creating category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Category</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("successfully") ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="e.g., Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="e.g., technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder="Brief description of this category"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
