"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTransaction(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Usuário não autenticado" }
    }

    const type = formData.get("type") as "ENTRADA" | "FIXO" | "VARIAVEL"
    const dateStr = formData.get("date") as string
    const description = formData.get("description") as string
    const amountStr = formData.get("amount") as string
    const institutionId = formData.get("institutionId") as string | null
    const category = formData.get("category") as string | null
    const installments = formData.get("installments") as string | null

    if (!type || !dateStr || !description || !amountStr) {
        return { error: "Missing required fields" }
    }

    const date = new Date(dateStr)
    const amount = parseFloat(amountStr.replace(",", "."))

    try {
        const { error } = await supabase.from("Transaction").insert({
            type,
            date: date.toISOString(),
            description,
            amount,
            institutionId: institutionId || null,
            category: category || null,
            installments: installments ? parseInt(installments) : null,
            user_id: user.id
        })

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error creating transaction:", error)
        return { error: "Failed to create transaction" }
    }
}

export async function addTransaction(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Usuário não autenticado" }
    }

    try {
        const { error } = await supabase.from("Transaction").insert({
            ...data,
            user_id: user.id
        })

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error creating transaction:", error)
        return { error: "Failed to create transaction" }
    }
}

export async function getTransactions(month?: string, type?: "all" | "receita" | "despesa") {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    let query = supabase
        .from("Transaction")
        .select(`*, institution:Institution(*)`)
        .eq("user_id", user.id)
        .order("date", { ascending: false })

    if (month) {
        const [year, monthNum] = month.split('-')
        const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999)
        query = query.gte("date", startDate.toISOString()).lte("date", endDate.toISOString())
    }

    if (type && type !== "all") {
        query = query.eq("type", type === "receita" ? "ENTRADA" : "VARIAVEL") // Assuming 'despesa' maps to 'VARIAVEL' or 'FIXO'
    }

    try {
        const { data, error } = await query

        if (error) throw error
        return data || []
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return []
    }
}

export async function updateTransactionStatus(id: string, isPaid: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não autenticado" }

    try {
        const { error } = await supabase
            .from("Transaction")
            .update({ isPaid })
            .eq("id", id)
            .eq("user_id", user.id)

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error updating transaction status:", error)
        return { error: "Failed to update transaction status" }
    }
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não autenticado" }

    try {
        const { error } = await supabase
            .from("Transaction")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id)

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error deleting transaction:", error)
        return { error: "Failed to delete transaction" }
    }
}

// Goals / Cofrinhos Actions

export async function createGoal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não autenticado" }

    const category = formData.get("category") as string
    const targetAmountStr = formData.get("targetAmount") as string
    const deadline = formData.get("deadline") as string | null

    if (!category || !targetAmountStr) {
        return { error: "Missing required fields" }
    }

    const targetAmount = parseFloat(targetAmountStr.replace(",", "."))

    try {
        const { error } = await supabase.from("Goal").insert({
            category,
            targetAmount,
            deadline,
            currentAmount: 0,
            yield: 0,
            progress: 0,
            user_id: user.id
        })

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error creating goal:", error)
        return { error: "Failed to create goal" }
    }
}


export async function addGoal(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Usuário não autenticado" }
    }

    try {
        const { error } = await supabase.from("Goal").insert({
            ...data,
            user_id: user.id,
            currentAmount: 0,
            yield: 0,
            progress: 0
        })

        if (error) throw error

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error creating goal:", error)
        return { error: "Failed to create goal" }
    }
}

export async function depositIntoGoal(goalId: string, amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Usuário não autenticado" }
    }

    try {
        // get current goal to calculate progress
        const { data: goal, error: fError } = await supabase
            .from("Goal")
            .select("*")
            .eq("id", goalId)
            .eq("user_id", user.id)
            .single()

        if (fError || !goal) return { error: "Goal not found" }

        const newAmount = goal.currentAmount + amount
        const newProgress = newAmount / goal.targetAmount // Progress is percentage decimal

        const { error: uError } = await supabase.from("Goal").update({
            currentAmount: newAmount,
            progress: newProgress
        }).eq("id", goalId).eq("user_id", user.id)

        if (uError) throw uError

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true }
    } catch (error) {
        console.error("Error updating goal:", error)
        return { error: "Failed to update goal" }
    }
}

export async function getGoals() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    try {
        const { data, error } = await supabase
            .from("Goal")
            .select("*")
            .eq("user_id", user.id)
            .order("createdAt", { ascending: false })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error("Error fetching goals:", error)
        return []
    }
}
