import { pgTable, text, serial, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core"

import { relations } from "drizzle-orm"

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  categoryId: integer("category_id").references(() => categories.id),
  published: boolean("published").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  author: varchar("author", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  comments: many(comments),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}))
