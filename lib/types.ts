// Áreas da vida
export type LifeArea =
  | "fisica"
  | "familiar"
  | "social"
  | "espiritual"
  | "academica"
  | "corporativa"
  | "financeira"
  | "amorosa"
  | "emocional"

export interface LifeAreaInfo {
  id: LifeArea
  name: string
  icon: string
  color: string
  description: string
}

// Tarefas
export type TaskPriority = "baixa" | "media" | "alta" | "urgente"
export type TaskStatus = "pendente" | "em_progresso" | "concluida"

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  area: LifeArea
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string
  subtasks: SubTask[]
  createdAt: string
  updatedAt: string
}

// Finanças
export type TransactionType = "receita" | "despesa"
export type TransactionCategory =
  | "alimentacao"
  | "transporte"
  | "moradia"
  | "saude"
  | "educacao"
  | "lazer"
  | "vestuario"
  | "servicos"
  | "investimentos"
  | "salario"
  | "freelance"
  | "outros"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  date: string
  createdAt: string
}

export interface FinanceSummary {
  totalReceitas: number
  totalDespesas: number
  saldo: number
  byCategory: Record<TransactionCategory, number>
}
