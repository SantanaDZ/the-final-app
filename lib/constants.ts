import type { LifeArea, LifeAreaInfo, TaskPriority, TransactionCategory } from "./types"

export const LIFE_AREAS: Record<LifeArea, LifeAreaInfo> = {
  fisica: {
    id: "fisica",
    name: "Física / Saúde",
    icon: "Heart",
    color: "#ef4444",
    description: "Exercícios, alimentação, sono, check-ups",
  },
  familiar: {
    id: "familiar",
    name: "Familiar",
    icon: "Home",
    color: "#f97316",
    description: "Tempo com família, responsabilidades do lar",
  },
  social: {
    id: "social",
    name: "Social / Lazer",
    icon: "Users",
    color: "#eab308",
    description: "Amigos, hobbies, eventos, viagens",
  },
  espiritual: {
    id: "espiritual",
    name: "Espiritual",
    icon: "Sparkles",
    color: "#84cc16",
    description: "Meditação, propósito, práticas religiosas",
  },
  academica: {
    id: "academica",
    name: "Acadêmica",
    icon: "GraduationCap",
    color: "#22c55e",
    description: "Estudos, cursos, aprendizado contínuo",
  },
  corporativa: {
    id: "corporativa",
    name: "Corporativa",
    icon: "Briefcase",
    color: "#06b6d4",
    description: "Trabalho, carreira, projetos profissionais",
  },
  financeira: {
    id: "financeira",
    name: "Financeira",
    icon: "Wallet",
    color: "#3b82f6",
    description: "Orçamento, investimentos, metas financeiras",
  },
  amorosa: {
    id: "amorosa",
    name: "Amorosa",
    icon: "HeartHandshake",
    color: "#8b5cf6",
    description: "Relacionamento, parceiro(a), romance",
  },
  emocional: {
    id: "emocional",
    name: "Emocional",
    icon: "Brain",
    color: "#ec4899",
    description: "Autoconhecimento, terapia, bem-estar mental",
  },
}

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "#6b7280" },
  media: { label: "Média", color: "#3b82f6" },
  alta: { label: "Alta", color: "#f97316" },
  urgente: { label: "Urgente", color: "#ef4444" },
}

export const CATEGORY_CONFIG: Record<TransactionCategory, { label: string; icon: string }> = {
  alimentacao: { label: "Alimentação", icon: "UtensilsCrossed" },
  transporte: { label: "Transporte", icon: "Car" },
  moradia: { label: "Moradia", icon: "Home" },
  saude: { label: "Saúde", icon: "Stethoscope" },
  educacao: { label: "Educação", icon: "GraduationCap" },
  lazer: { label: "Lazer", icon: "Gamepad2" },
  vestuario: { label: "Vestuário", icon: "Shirt" },
  servicos: { label: "Serviços", icon: "Wrench" },
  investimentos: { label: "Investimentos", icon: "TrendingUp" },
  salario: { label: "Salário", icon: "Banknote" },
  freelance: { label: "Freelance", icon: "Laptop" },
  outros: { label: "Outros", icon: "MoreHorizontal" },
}

// Keywords para parsing de voz
export const EXPENSE_KEYWORDS = ["gastei", "paguei", "comprei", "despesa", "gasto"]
export const INCOME_KEYWORDS = ["recebi", "ganhei", "entrou", "receita", "salário"]

export const CATEGORY_KEYWORDS: Record<string, TransactionCategory> = {
  mercado: "alimentacao",
  supermercado: "alimentacao",
  restaurante: "alimentacao",
  lanche: "alimentacao",
  comida: "alimentacao",
  ifood: "alimentacao",
  uber: "transporte",
  gasolina: "transporte",
  combustível: "transporte",
  ônibus: "transporte",
  metrô: "transporte",
  aluguel: "moradia",
  condomínio: "moradia",
  luz: "moradia",
  água: "moradia",
  internet: "moradia",
  farmácia: "saude",
  médico: "saude",
  consulta: "saude",
  remédio: "saude",
  curso: "educacao",
  livro: "educacao",
  faculdade: "educacao",
  cinema: "lazer",
  netflix: "lazer",
  spotify: "lazer",
  jogo: "lazer",
  roupa: "vestuario",
  tênis: "vestuario",
  sapato: "vestuario",
  salário: "salario",
  freelance: "freelance",
  projeto: "freelance",
}
