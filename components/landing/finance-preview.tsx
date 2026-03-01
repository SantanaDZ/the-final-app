"use client"

import { Mic, MessageSquare, CreditCard, Banknote, Building2 } from "lucide-react"

const variables = [
  { icon: Banknote, label: "Valor gasto", example: "R$ 150,00" },
  { icon: CreditCard, label: "Forma de pagamento", example: "Crédito" },
  { icon: Building2, label: "Instituição", example: "Nubank" },
]

export function FinancePreview() {
  return (
    <section className="bg-secondary px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Texto */}
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Controle Financeiro
            </p>
            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl" style={{ letterSpacing: '-0.022em', lineHeight: 1.1 }}>
              Fale.
              <br />
              Registre.
              <br />
              <span className="text-muted-foreground">Organize.</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
              Não perca mais tempo com planilhas complicadas. Simplesmente fale ou digite suas despesas — o Equilibra cuida do resto.
            </p>
            
            {/* Variáveis configuráveis */}
            <div className="space-y-4">
              {variables.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Visual */}
          <div className="relative">
            <div className="rounded-3xl bg-card p-8">
              {/* Input de voz simulado */}
              <div className="mb-6 flex items-center gap-4 rounded-2xl bg-secondary p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Mic className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Gravando...</p>
                  <p className="text-xs text-muted-foreground">&ldquo;Gastei 89 reais no mercado, débito no Nubank&rdquo;</p>
                </div>
              </div>

              {/* Resultado processado */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Despesa registrada</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className="text-sm font-semibold text-foreground">R$ 89,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Categoria</span>
                    <span className="text-sm font-medium text-foreground">Mercado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pagamento</span>
                    <span className="text-sm font-medium text-foreground">Débito</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Banco</span>
                    <span className="text-sm font-medium text-foreground">Nubank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
