"use client"

import { Target, Wallet, Brain, Mic, Layers, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Gestão de Tarefas",
    description: "Anote, divida em subtarefas, categorize e priorize. Tudo de forma visual e intuitiva."
  },
  {
    icon: Target,
    title: "Áreas da Vida",
    description: "Física, Familiar, Social, Espiritual, Acadêmica, Corporativa, Financeira, Amorosa e Emocional."
  },
  {
    icon: Brain,
    title: "Raciocínio Otimizado",
    description: "Resolva vários problemas de diferentes áreas gastando menos energia física e mental."
  },
  {
    icon: Wallet,
    title: "Controle Financeiro",
    description: "Planilha automatizada com controle de gastos, parcelas e teto ideal de despesas."
  },
  {
    icon: Mic,
    title: "Input por Voz",
    description: "Registre gastos por mensagem ou áudio. Valor, categoria, forma de pagamento — tudo configurável."
  },
  {
    icon: BarChart3,
    title: "Visão Completa",
    description: "Dashboard visual para acompanhar seu progresso em todas as áreas da vida."
  }
]

export function Features() {
  return (
    <section className="bg-secondary px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Título da seção */}
        <div className="mb-16 text-center md:mb-20">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl" style={{ letterSpacing: '-0.022em', lineHeight: 1.1 }}>
            Projetado para
            <br />
            <span className="text-muted-foreground">mentes criativas.</span>
          </h2>
        </div>

        {/* Grid de Features - Bento Box Style */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl bg-card p-8 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground" style={{ lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
