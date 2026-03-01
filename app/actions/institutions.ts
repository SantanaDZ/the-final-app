"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getInstitutions() {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.from("Institution").select("*").order("name", { ascending: true })
        if (error) throw error
        return data || []
    } catch (error) {
        console.error("Error fetching institutions:", error)
        return []
    }
}

export async function createInstitution(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Usuário não autenticado")

    const name = formData.get("name") as string
    const colorCode = formData.get("colorCode") as string

    if (!name || !colorCode) return { error: "Name and Color are required" }

    try {
        const { error } = await supabase
            .from("Institution")
            .insert({ name, colorCode, user_id: user.id })
        if (error) throw error

        revalidatePath("/institutions")
        return { success: true }
    } catch (error) {
        console.error("Error creating institution:", error)
        return { error: "Failed to create institution" }
    }
}

export async function deleteInstitution(id: string) {
    const supabase = await createClient()
    try {
        const { error } = await supabase
            .from("Institution")
            .delete()
            .eq("id", id)
        if (error) throw error

        revalidatePath("/institutions")
        return { success: true }
    } catch (error) {
        console.error("Error deleting institution:", error)
        return { error: "Failed to delete institution" }
    }
}
