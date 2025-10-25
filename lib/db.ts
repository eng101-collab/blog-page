import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.NEON_NEON_DATABASE_URL

if (!databaseUrl) {
  console.error("[v0] ERROR: NEON_DATABASE_URL environment variable is not set")
  console.error(
    "[v0] Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("DATABASE") || k.includes("NEON")),
  )
  throw new Error("NEON_DATABASE_URL is required")
}

if (process.env.NODE_ENV === "development") {
  console.log("[v0] DB module loaded - using raw SQL with neon client")
}

console.log("[v0] Connecting to database...")
export const sql = neon(databaseUrl)
console.log("[v0] Database connection established")
