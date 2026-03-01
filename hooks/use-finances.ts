"use client"

import { useCallback, useMemo } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { Transaction, TransactionType, TransactionCategory, FinanceSummary } from "@/lib/types"
import { EXPENSE_KEYWORDS, INCOME_KEYWORDS, CATEGORY_KEYWORDS } from "@/lib/constants"

const STORAGE_KEY = "equilibra_finances"

export function useFinances() {
  const [transactions, setTransactions, isLoaded] = useLocalStorage<Transaction[]>(
    STORAGE_KEY,
    []
  )

  const addTransaction = useCallback(
    (
      transaction: Omit<Transaction, "id" | "createdAt">
    ) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setTransactions((prev) => [...prev, newTransaction])
      return newTransaction
    },
    [setTransactions]
  )

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<Transaction, "id" | "createdAt">>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    },
    [setTransactions]
  )

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    },
    [setTransactions]
  )

  // Parser de texto/voz para transação
  const parseVoiceInput = useCallback((input: string): Partial<Transaction> | null => {
    const text = input.toLowerCase().trim()
    
    // Detectar tipo (receita ou despesa)
    let type: TransactionType = "despesa"
    if (INCOME_KEYWORDS.some((kw) => text.includes(kw))) {
      type = "receita"
    } else if (!EXPENSE_KEYWORDS.some((kw) => text.includes(kw))) {
      // Se não encontrou keyword de despesa nem receita, assume despesa
      type = "despesa"
    }

    // Extrair valor (procura por números)
    const valueMatch = text.match(/(\d+(?:[.,]\d{1,2})?)/);
    if (!valueMatch) return null
    
    const amount = parseFloat(valueMatch[1].replace(",", "."))
    if (isNaN(amount) || amount <= 0) return null

    // Detectar categoria
    let category: TransactionCategory = "outros"
    for (const [keyword, cat] of Object.entries(CATEGORY_KEYWORDS)) {
      if (text.includes(keyword)) {
        category = cat
        break
      }
    }

    // Gerar descrição
    const description = input.trim()

    return {
      description,
      amount,
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    }
  }, [])

  // Adicionar transação a partir de input de voz/texto
  const addFromVoice = useCallback(
    (input: string) => {
      const parsed = parseVoiceInput(input)
      if (!parsed) return null
      
      return addTransaction(parsed as Omit<Transaction, "id" | "createdAt">)
    },
    [parseVoiceInput, addTransaction]
  )

  // Calcular resumo financeiro
  const summary = useMemo<FinanceSummary>(() => {
    const totalReceitas = transactions
      .filter((t) => t.type === "receita")
      .reduce((acc, t) => acc + t.amount, 0)

    const totalDespesas = transactions
      .filter((t) => t.type === "despesa")
      .reduce((acc, t) => acc + t.amount, 0)

    const byCategory = transactions.reduce((acc, t) => {
      if (t.type === "despesa") {
        acc[t.category] = (acc[t.category] || 0) + t.amount
      }
      return acc
    }, {} as Record<TransactionCategory, number>)

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      byCategory,
    }
  }, [transactions])

  // Transações do mês atual
  const currentMonthTransactions = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
  }, [transactions])

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    parseVoiceInput,
    addFromVoice,
    summary,
    currentMonthTransactions,
  }
}
