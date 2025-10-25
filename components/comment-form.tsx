"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from "@/lib/trpc-client"

export function CommentForm({ postId }: { postId: number }) {
  const [author, setAuthor] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await trpc.addComment.mutate({
        postId,
        author,
        email,
        content,
      })
      setAuthor("")
      setEmail("")
      setContent("")
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Leave a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-700 rounded">
            Thank you! Your comment has been submitted for approval.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <textarea
            placeholder="Your Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <Button type="submit">Post Comment</Button>
        </form>
      </CardContent>
    </Card>
  )
}
