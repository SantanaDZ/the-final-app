"use client"

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="text-lg font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
          Equilibra
        </a>

        {/* CTA */}
        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Lista de Espera
        </button>
      </div>
    </header>
  )
}
