"use server"

import { createClient } from "@/utils/supabase/server"

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: transactionsData, error: txError } = await supabase
        .from("Transaction")
        .select(`*, institution:Institution(*)`)
        .order("date", { ascending: false })

    const transactions = transactionsData || []

    const { data: goalsData, error: glError } = await supabase
        .from("Goal")
        .select("*")
        .order("category", { ascending: true })

    const goals = goalsData || []

    // Calculations
    const entradas = transactions.filter((t: any) => t.type === "ENTRADA").reduce((acc: number, t: any) => acc + t.amount, 0)
    const fixos = transactions.filter((t: any) => t.type === "FIXO").reduce((acc: number, t: any) => acc + t.amount, 0)
    const variaveis = transactions.filter((t: any) => t.type === "VARIAVEL").reduce((acc: number, t: any) => acc + t.amount, 0)
    const saidas = fixos + variaveis
    const saldo = entradas - saidas

    return {
        entradas,
        saidas,
        saldo,
        fixos,
        variaveis,
        goals,
        recentTransactions: transactions.slice(0, 10)
    }
}
