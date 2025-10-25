import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Comment {
  id: number
  author: string
  content: string
  createdAt: Date
}

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground">{comment.author}</p>
                <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
