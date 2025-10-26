import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("_ Fetching all categories...")
    const allCategories = await sql.query("SELECT id, name, slug, description FROM categories ORDER BY name")
    console.log(`_ Found ${allCategories.length} categories`)
    return NextResponse.json(allCategories)
  } catch (error) {
    console.error("_ Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description } = body

    console.log("_ Creating new category:", { name, slug })
    const result = await sql.query(
      "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id, name, slug, description",
      [name, slug, description],
    )

    console.log("_ Category created successfully")
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("_ Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
