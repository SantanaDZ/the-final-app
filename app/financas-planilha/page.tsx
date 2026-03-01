"use client"

import { useEffect, useState } from "react"
import { getDashboardData } from "@/app/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, TrendingUp, Wallet, PiggyBank, ArrowDownRight, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await getDashboardData()
            setData(res)
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando seus dados financeiros...</div>
    if (!data) return <div className="p-8 text-center text-destructive">Erro ao carregar dados.</div>

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                <p className="text-muted-foreground mt-2">Seu balanço financeiro e metas para este mês.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {data.saldo.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Balanço do mês</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ {data.entradas.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ganhos no mês</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saídas</CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">R$ {data.saidas.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            R$ {data.fixos.toFixed(2)} fixos / R$ {data.variaveis.toFixed(2)} var.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PiggyBank className="w-5 h-5 text-amber-500" />
                            Cofrinhos e Metas
                        </CardTitle>
                        <CardDescription>Acompanhe o progresso das suas reservas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.goals.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada.</p>
                        ) : (
                            data.goals.map((goal: any) => (
                                <div key={goal.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{goal.category}</span>
                                        <span className="text-muted-foreground">
                                            R$ {goal.currentAmount.toFixed(2)} / R$ {goal.targetAmount.toFixed(2)}
                                            {goal.deadline !== "-" && ` (até ${goal.deadline})`}
                                        </span>
                                    </div>
                                    <Progress value={goal.progress * 100} className="h-2" />
                                    <p className="text-xs text-right text-muted-foreground">
                                        {(goal.progress * 100).toFixed(1)}% alcançado
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Lançamentos</CardTitle>
                        <CardDescription>Atividade recente nas suas finanças.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recentTransactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhuma transação encontrada.</p>
                            ) : (
                                data.recentTransactions.map((t: any) => (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${t.type === "ENTRADA" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20" :
                                                "bg-rose-100 text-rose-600 dark:bg-rose-500/20"
                                                }`}>
                                                {t.type === "ENTRADA" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{t.description}</p>
                                                <p className="text-xs text-muted-foreground flex gap-2">
                                                    {t.institution && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.institution.colorCode }} />
                                                            {t.institution.name}
                                                        </span>
                                                    )}
                                                    <span>• {new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`font-semibold text-sm ${t.type === "ENTRADA" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                                            {t.type === "ENTRADA" ? "+" : "-"} R$ {t.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
