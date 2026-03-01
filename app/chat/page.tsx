"use client"

import { useState } from "react"
import { Send, Bot, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { parseTransactionAndSave } from "@/app/actions/ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function ChatPage() {
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [message, setMessage] = useState<{ type: "error" | "success" | "info", text: string } | null>(null)

    const handleSend = async () => {
        if (!text.trim()) return

        setLoading(true)
        setMessage({ type: "info", text: "A IA está processando..." })

        const result = await parseTransactionAndSave(text)

        if (result?.error) {
            setMessage({ type: "error", text: result.error })
        } else if (result?.success) {
            setMessage({
                type: "success",
                text: `Transação adicionada com sucesso! (${result.parsedData.type} - R$ ${result.parsedData.amount})`
            })
            setText("")
        }

        setLoading(false)
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl mt-10">
            <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Assistente Financeiro IA</CardTitle>
                            <CardDescription>
                                Diga ou escreva o que você gastou e eu farei o resto.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg flex gap-3 text-sm text-muted-foreground items-start">
                        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p>
                            <strong>Dica de uso:</strong> Tente algo como:
                            <em>"Hoje eu gastei 45 reais de Uber usando o meu cartão de crédito Itaú."</em> ou
                            <em>"Recebi meu salário de 3000 no Nubank".</em>
                        </p>
                    </div>

                    <Textarea
                        placeholder="Digite aqui sua transação..."
                        className="min-h-[120px] resize-none text-base"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />

                    {message && (
                        <div className={`p-3 rounded-md flex gap-2 items-center text-sm ${message.type === "error" ? "bg-destructive/10 text-destructive" :
                            message.type === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            }`}>
                            {message.type === "error" && <AlertCircle className="w-4 h-4" />}
                            {message.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                            {message.type === "info" && <Bot className="w-4 h-4 animate-pulse" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t bg-muted/50 p-4">
                    <Button
                        onClick={handleSend}
                        disabled={!text.trim() || loading}
                        className="w-full sm:w-auto"
                    >
                        {loading ? "Processando..." : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Enviar para IA
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
