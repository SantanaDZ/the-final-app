"use client"

import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { createInstitution, deleteInstitution, getInstitutions } from "@/app/actions/institutions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Adicionando..." : "Adicionar Instituição"}
        </Button>
    )
}

export default function InstitutionsPage() {
    const [institutions, setInstitutions] = useState<any[]>([])

    const loadInstitutions = async () => {
        const data = await getInstitutions()
        setInstitutions(data)
    }

    useEffect(() => {
        loadInstitutions()
    }, [])

    const handleDelete = async (id: string) => {
        await deleteInstitution(id)
        loadInstitutions()
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Instituições Financeiras</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie as contas bancárias, cartões e formas de pagamento usados no sistema.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Nova Instituição</CardTitle>
                        <CardDescription>
                            Adicione uma nova forma de pagamento (ex: Nubank, Itaú, Dinheiro).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            action={async (formData) => {
                                await createInstitution(formData)
                                loadInstitutions()
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Instituição</Label>
                                <Input id="name" name="name" placeholder="Ex: Nubank" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colorCode">Cor de Referência</Label>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="color"
                                        id="colorCode"
                                        name="colorCode"
                                        defaultValue="#8A05BE"
                                        className="w-14 h-14 p-1 cursor-pointer"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Escolha uma cor para identificar facilmente nas transações.
                                    </span>
                                </div>
                            </div>
                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Instituições Cadastradas</CardTitle>
                        <CardDescription>
                            Lista de todas as formas de pagamento ativas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {institutions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                Nenhuma instituição cadastrada ainda.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {institutions.map((inst) => (
                                    <div key={inst.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full shadow-inner"
                                                style={{ backgroundColor: inst.colorCode }}
                                            />
                                            <span className="font-medium">{inst.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(inst.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
