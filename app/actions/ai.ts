"use server"

import { GoogleGenAI } from "@google/genai"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Initialize Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function parseTransactionAndSave(text: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "A chave da API do Gemini (GEMINI_API_KEY) não está configurada no .env" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Usuário não autenticado" }

    try {
        // 1. Get institutions to help the AI map correctly
        const { data: institutionsData } = await supabase.from("Institution").select("*")
        const institutions = institutionsData || []
        const instNames = institutions.map((i: any) => i.name).join(", ")

        // 2. Build the precise prompt
        const prompt = `
    Você é um assistente financeiro. O usuário enviará um texto descrevendo uma transação.
    Extraia as informações e retorne EXATAMENTE este objeto JSON:
    {
      "type": "ENTRADA" (se recebeu dinheiro) | "FIXO" (se for conta fixa ex: luz, aluguel) | "VARIAVEL" (se for compra, ifood, lazer),
      "description": "Uma descrição curta",
      "amount": 0.00 (somente número, positivo),
      "category": "Categoria sugerida",
      "institutionName": "O nome da forma de pagamento, tente casar com um destes: ${instNames}. Se não conseguir, deixe null."
    }

    Texto do usuário: "${text}"
    Regras: Retorne APENAS o JSON válido, sem crases (\`\`\`) e sem texto adicional.
    `

        // 3. Call Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        const responseText = response.text || "{}"
        // Clean potential markdown blocks
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()

        let parsedData
        try {
            parsedData = JSON.parse(cleanedText)
        } catch {
            return { error: "A IA não retornou um formato válido. Tente reformular a frase." }
        }

        // 4. Match Institution IDs
        let institutionId = null
        if (parsedData.institutionName) {
            const inst = institutions.find((i: any) =>
                i.name.toLowerCase().includes(parsedData.institutionName.toLowerCase()) ||
                parsedData.institutionName.toLowerCase().includes(i.name.toLowerCase())
            )
            if (inst) institutionId = inst.id
        }

        // 5. Insert to DB
        const { error: insertError } = await supabase.from("Transaction").insert([{
            type: parsedData.type || "VARIAVEL",
            description: parsedData.description || "Sem descrição",
            amount: parsedData.amount || 0,
            category: parsedData.category || null,
            institutionId: institutionId,
            date: new Date().toISOString(), // Today
            user_id: user.id
        }])

        if (insertError) throw insertError

        revalidatePath("/transactions")
        revalidatePath("/dashboard")
        revalidatePath("/financas-planilha")
        return { success: true, parsedData }

    } catch (error) {
        console.error("AI parse error:", error)
        return { error: "Erro ao processar o texto com a inteligência artificial." }
    }
}
