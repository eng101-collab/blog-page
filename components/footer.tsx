export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Blog</h3>
            <p className="text-muted-foreground">A modern blogging platform built with Next.js and Drizzle ORM.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/blog" className="hover:text-foreground transition">
                  Articles
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-foreground transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-foreground transition">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-muted-foreground">Have questions? Reach out to us anytime.</p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Blog Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
