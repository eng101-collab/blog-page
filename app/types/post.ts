export interface Category {
  id: string
  name: string
  slug?: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
  authorId: string
  categoryId: string
}
