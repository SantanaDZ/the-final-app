"use client"

import { ChevronRight } from "lucide-react"

export function CTA() {
  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Título principal */}
        <h2 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl" style={{ letterSpacing: '-0.022em', lineHeight: 1.1 }}>
          Pronto para
          <br />
          <span className="text-muted-foreground">encontrar seu equilíbrio?</span>
        </h2>
        
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
          Seja um dos primeiros a experimentar o Equilibra. Entre na lista de espera e participe do lançamento exclusivo.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90">
            Entrar na Lista de Espera
          </button>
          <button className="group inline-flex items-center justify-center gap-1 text-base font-medium text-accent transition-opacity hover:opacity-80">
            Ver recursos
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
