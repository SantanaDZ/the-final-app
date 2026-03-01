"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        {/* Tagline superior */}
        <p className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          O futuro da organização pessoal
        </p>
        
        {/* Título principal - Estilo Apple com letter-spacing negativo */}
        <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-7xl lg:text-8xl" style={{ letterSpacing: '-0.022em', lineHeight: 1.1 }}>
          Equilibra
        </h1>
        
        {/* Subtítulo */}
        <p className="mx-auto mt-6 max-w-2xl text-xl font-normal text-muted-foreground md:text-2xl" style={{ lineHeight: 1.5 }}>
          Todas as áreas da sua vida em um só lugar. Tarefas, finanças e metas — organizadas de forma simples, visual e inteligente.
        </p>
        
        {/* CTAs - Estilo Apple */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Acessar App
          </Link>
          <button className="group inline-flex items-center justify-center gap-1 text-base font-medium text-accent transition-opacity hover:opacity-80">
            Saiba mais
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
