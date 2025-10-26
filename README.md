

## Overview

# Next.js 14 Blog Application

A modern, full-stack blog application built with Next.js 14, TypeScript, tRPC, and PostgreSQL.

##  Features

- ✅ Server-side rendering with Next.js 14 App Router
- ✅ Type-safe API with tRPC
- ✅ PostgreSQL database with Neon
- ✅ Category management
- ✅ Comment system with approval workflow
- ✅ Markdown/rich text content
- ✅ SEO-friendly URLs with slugs
- ✅ Admin dashboard for content management
- ✅ Responsive design with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Neon PostgreSQL account 

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd blog-spot
npm install
#to run application 
npm run dev
```
Visit http://localhost:3000 to see your application.

## Environment Setup

This project requires environment variables to be set up. Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
# Required: Neon PostgreSQL database connection string
# Format: postgresql://username:password@hostname:port/database
NEON_DATABASE_URL=your_neon_database_connection_string
NEON_NEON_DATABASE_URL=your_neon_database_connection_string

# Node Environment
# Options: development, production, test
NODE_ENV=development
```

### Getting a Neon Database URL

1. Sign up for a free account at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as the value for both `NEON_DATABASE_URL` and `NEON_NEON_DATABASE_URL` in your `.env` file

### Verifying Your Environment Setup

After setting up your `.env` file, you can verify your environment configuration by running:

```bash
npm run setup
```

This script will check if your `.env` file is properly configured and test the database connection.

### Initializing the Database

To initialize the database with the required tables and sample data, run:

```bash
npm run init-db
```
## Tech stack
```
Framework: Next.js 14 (App Router)
Language: TypeScript
Database: PostgreSQL (Neon)
ORM: Drizzle ORM
API: tRPC + REST
Styling: Tailwind CSS
UI Components: Radix UI
Forms: React Hook Form
```
## trpc brief
## Project Structure
.
├── trpc.ts      # tRPC API router and procedures
├── db.ts        # Database connection and query helper
└── ...

### tRPC Setup

### Import & Initialize
import { initTRPC } from "@trpc/server"
import { sql } from "./db"

### Initialize tRPC
t = initTRPC.create()

### Create reusable procedures
publicProcedure = t.procedure
router = t.router

### Define API Routes
appRouter = router({

  ### 1. Categories endpoint
  categories: publicProcedure.query(async () => {
    result = await sql.query("SELECT * FROM categories ORDER BY name", [])
    return result
  }),

  ### 2. Posts endpoint
  posts: publicProcedure.query(async () => {
    result = await sql.query(
      `SELECT p.*, c.name as category_name 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.published = true 
       ORDER BY p.created_at DESC`,
      []
    )
    return result
  }),

  ### 3. Single post by slug
  postBySlug: publicProcedure
    .input((val) => {
      if (typeof val === "string") return val
      throw new Error("Invalid input")
    })
    .query(async ({ input }) => {
      result = await sql.query("SELECT * FROM posts WHERE slug = $1", [input])
      return result[0] || null
    }),

  ### 4. Add comment mutation
  addComment: publicProcedure
    .input((val) => {
      if (typeof val === "object" &&
          val !== null &&
          "postId" in val &&
          "author" in val &&
          "content" in val) {
        return val
      }
      throw new Error("Invalid input")
    })
    .mutation(async ({ input }) => {
      result = await sql.query(
        "INSERT INTO comments (post_id, author, email, content) VALUES ($1, $2, $3, $4) RETURNING *",
        [input.postId, input.author, input.email, input.content]
      )
      return result[0]
    }),
})

### Export type for client
AppRouter = typeof appRouter

### Key Concepts
```
1. Procedures
   - Query: Fetching data (GET operations)
   - Mutation: Modifying data (POST/PUT/DELETE operations)

2. Input Validation
.input((val) => {
if (typeof val === "string") return val
throw new Error("Invalid input")
})

3. Type Safety
- `AppRouter` type is exported for client-side TypeScript autocomplete and type checking


