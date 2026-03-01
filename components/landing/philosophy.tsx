"use client"

const areas = [
  { name: "Física / Saúde", emoji: "💪" },
  { name: "Familiar", emoji: "👨‍👩‍👧‍👦" },
  { name: "Social / Lazer", emoji: "🎉" },
  { name: "Espiritual", emoji: "🧘" },
  { name: "Acadêmica", emoji: "📚" },
  { name: "Corporativa", emoji: "💼" },
  { name: "Financeira", emoji: "💰" },
  { name: "Amorosa", emoji: "❤️" },
  { name: "Emocional", emoji: "🧠" },
]

export function Philosophy() {
  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Quote/Filosofia */}
        <blockquote className="mb-16">
          <p className="text-2xl font-medium text-foreground md:text-3xl lg:text-4xl" style={{ letterSpacing: '-0.015em', lineHeight: 1.4 }}>
            &ldquo;Todos nós queremos atingir o melhor nível em todas as áreas da vida. O desafio está em encontrar o equilíbrio.&rdquo;
          </p>
        </blockquote>

        {/* Áreas da Vida */}
        <div className="mb-12">
          <p className="mb-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Áreas que você pode gerenciar
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground"
              >
                <span>{area.emoji}</span>
                {area.name}
              </span>
            ))}
          </div>
        </div>

        {/* Texto explicativo */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground" style={{ lineHeight: 1.6 }}>
          A memória falha. O foco é roubado pelas distrações constantes do mundo moderno. Com o Equilibra, você tem um único lugar para organizar todas as tarefas de todas as áreas — tornando mais fácil encontrar esse equilíbrio.
        </p>
      </div>
    </section>
  )
}
