import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Blog
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/blog" className="text-foreground hover:text-primary transition">
            Articles
          </Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition">
            Categories
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
