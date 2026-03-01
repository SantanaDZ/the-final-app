"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VoiceInput } from "@/components/app/voice-input"
import { TransactionList } from "@/components/app/transaction-list"
import { TransactionDialog } from "@/components/app/transaction-dialog"
import { useFinances } from "@/hooks/use-finances"
import { CATEGORY_CONFIG } from "@/lib/constants"
import type { TransactionType, TransactionCategory } from "@/lib/types"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
]

import { Suspense } from "react"

export default function FinancasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando Finanças...</div>}>
      <FinancasPageContent />
    </Suspense>
  )
}

function FinancasPageContent() {
  const searchParams = useSearchParams()
  const {
    transactions,
    isLoaded,
    summary,
    currentMonthTransactions,
    addFromVoice,
    addTransaction,
    deleteTransaction,
  } = useFinances()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Focar no input de voz se ?voz=true
  useEffect(() => {
    if (searchParams.get("voz") === "true") {
      // O componente VoiceInput já vai focar automaticamente
    }
  }, [searchParams])

  const handleVoiceSubmit = (text: string) => {
    const result = addFromVoice(text)
    if (result) {
      setLastResult({
        success: true,
        message: `${result.type === "receita" ? "Receita" : "Despesa"} de ${formatCurrency(
          result.amount
        )} adicionada com sucesso!`,
      })
    } else {
      setLastResult({
        success: false,
        message: "Não consegui entender. Tente algo como: 'Gastei 50 no mercado'",
      })
    }

    // Limpar mensagem após 5 segundos
    setTimeout(() => setLastResult(null), 5000)
  }

  const handleManualAdd = (data: {
    description: string
    amount: number
    type: TransactionType
    category: TransactionCategory
    date: string
  }) => {
    addTransaction(data)
    setLastResult({
      success: true,
      message: `${data.type === "receita" ? "Receita" : "Despesa"} de ${formatCurrency(
        data.amount
      )} adicionada!`,
    })
    setTimeout(() => setLastResult(null), 5000)
  }

  // Dados para o gráfico de pizza
  const pieData = Object.entries(summary.byCategory)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_CONFIG[key as TransactionCategory].label,
      value,
    }))
    .sort((a, b) => b.value - a.value)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finanças</h1>
          <p className="text-muted-foreground">
            Controle suas receitas e despesas por voz ou manualmente
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Input de voz */}
      <VoiceInput
        onSubmit={handleVoiceSubmit}
        placeholder='Diga ou digite: "Gastei 50 no mercado" ou "Recebi 3000 de salário"'
      />

      {lastResult && (
        <div
          className={`p-3 rounded-lg text-sm ${lastResult.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {lastResult.message}
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${summary.saldo >= 0 ? "text-green-600" : "text-red-600"
                }`}
            >
              {formatCurrency(summary.saldo)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalReceitas)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalDespesas)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de despesas por categoria */}
        {pieData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de transações do mês */}
        <Card className={pieData.length === 0 ? "lg:col-span-2" : ""}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList
              transactions={currentMonthTransactions}
              onDelete={deleteTransaction}
            />
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleManualAdd}
      />
    </div>
  )
}
