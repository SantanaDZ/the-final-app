"use client"

export function Footer() {
  return (
    <footer className="bg-secondary px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo/Nome */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
              Equilibra
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Recursos
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Sobre
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Contato
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Política de Privacidade
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2026 Equilibra
          </p>
        </div>
      </div>
    </footer>
  )
}
