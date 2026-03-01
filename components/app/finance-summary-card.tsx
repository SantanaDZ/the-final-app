"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FinanceSummary } from "@/lib/types"

interface FinanceSummaryCardProps {
  summary: FinanceSummary
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function FinanceSummaryCard({ summary }: FinanceSummaryCardProps) {
  const isPositive = summary.saldo >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Resumo Financeiro</CardTitle>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/financas-planilha">
            Ver detalhes
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Saldo Atual</p>
            <p
              className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
              {formatCurrency(summary.saldo)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receitas</p>
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(summary.totalReceitas)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Despesas</p>
                <p className="text-sm font-semibold text-red-600">
                  {formatCurrency(summary.totalDespesas)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
