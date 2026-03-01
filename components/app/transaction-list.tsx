"use client"

import { Trash2, TrendingUp, TrendingDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_CONFIG } from "@/lib/constants"
import type { Transaction } from "@/lib/types"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20">
        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Nenhuma transação ainda. Use o campo acima para adicionar.
        </p>
      </div>
    )
  }

  // Agrupar por data
  const groupedByDate = transactions.reduce((acc, transaction) => {
    const date = transaction.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, Transaction[]>)

  // Ordenar datas (mais recentes primeiro)
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dayTransactions = groupedByDate[date]
        const dayTotal = dayTransactions.reduce(
          (acc, t) => acc + (t.type === "receita" ? t.amount : -t.amount),
          0
        )

        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {formatDate(date)}
              </h3>
              <span
                className={`text-sm font-medium ${
                  dayTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {dayTotal >= 0 ? "+" : ""}
                {formatCurrency(dayTotal)}
              </span>
            </div>

            <div className="space-y-2">
              {dayTransactions.map((transaction) => {
                const category = CATEGORY_CONFIG[transaction.category]
                const isIncome = transaction.type === "receita"

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isIncome ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {category.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
