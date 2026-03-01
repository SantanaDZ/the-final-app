"use client"

import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { getInstitutions } from "@/app/actions/institutions"
import { createTransaction, createGoal, getGoals } from "@/app/actions/transactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function SubmitButton({ title }: { title: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Adicionando..." : title}
        </Button>
    )
}

export default function TransactionsPage() {
    const [institutions, setInstitutions] = useState<any[]>([])
    const [goals, setGoals] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            setInstitutions(await getInstitutions())
            setGoals(await getGoals())
        }
        load()
    }, [])

    return (
        <div className="container mx-auto p-6 max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Adicionar Movimentação</h1>
                <p className="text-muted-foreground mt-2">
                    Insira manualmente Entradas, Gastos Fixos, Variáveis ou contribua para Cofrinhos.
                </p>
            </div>

            <Tabs defaultValue="entradas" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="entradas">Entradas</TabsTrigger>
                    <TabsTrigger value="fixos">Fixos</TabsTrigger>
                    <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
                    <TabsTrigger value="cofrinhos">Cofrinhos</TabsTrigger>
                </TabsList>

                {/* --- ENTRADAS --- */}
                <TabsContent value="entradas">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nova Entrada</CardTitle>
                            <CardDescription>Registre seu salário, rendimentos ou reembolsos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => { await createTransaction(formData) }} className="space-y-4">
                                <input type="hidden" name="type" value="ENTRADA" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Data</Label>
                                        <Input id="date" name="date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Valor (R$)</Label>
                                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="Ex: 150.00" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Input id="description" name="description" placeholder="Ex: Salário, Reembolso" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institutionId">Forma (Instituição)</Label>
                                    <Select name="institutionId">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a conta/cartão" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {institutions.map(inst => (
                                                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <SubmitButton title="Adicionar Entrada" />
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- GASTOS FIXOS --- */}
                <TabsContent value="fixos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Novo Gasto Fixo</CardTitle>
                            <CardDescription>Registre aluguel, luz, internet, etc.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => { await createTransaction(formData) }} className="space-y-4">
                                <input type="hidden" name="type" value="FIXO" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Data</Label>
                                        <Input id="date" name="date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Valor (R$)</Label>
                                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="Ex: 85.00" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Input id="description" name="description" placeholder="Ex: Spotify" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoria</Label>
                                        <Input id="category" name="category" placeholder="Ex: Lazer" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institutionId">Forma de Pagamento</Label>
                                    <Select name="institutionId">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a conta/cartão" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {institutions.map(inst => (
                                                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <SubmitButton title="Adicionar Gasto Fixo" />
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- GASTOS VARIÁVEIS --- */}
                <TabsContent value="variaveis">
                    <Card>
                        <CardHeader>
                            <CardTitle>Novo Gasto Variável</CardTitle>
                            <CardDescription>Registre compras parceladas, lazer esporádico, etc.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => { await createTransaction(formData) }} className="space-y-4">
                                <input type="hidden" name="type" value="VARIAVEL" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Data</Label>
                                        <Input id="date" name="date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Valor (R$)</Label>
                                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="Ex: 112.32" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Input id="description" name="description" placeholder="Ex: Tênis" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoria</Label>
                                        <Input id="category" name="category" placeholder="Ex: Roupas" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="installments">Parcelas</Label>
                                        <Input id="installments" name="installments" placeholder="Ex: 1/10 ou '-' " />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="institutionId">Forma de Pagamento</Label>
                                        <Select name="institutionId">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {institutions.map(inst => (
                                                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <SubmitButton title="Adicionar Gasto Variável" />
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- COFRINHOS --- */}
                <TabsContent value="cofrinhos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nova Meta (Cofrinho)</CardTitle>
                            <CardDescription>Crie um novo cofrinho para guardar dinheiro.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => { await createGoal(formData) }} className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoria/Nome</Label>
                                        <Input id="category" name="category" placeholder="Ex: Reserva, Viagem" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetAmount">Meta Total (R$)</Label>
                                        <Input id="targetAmount" name="targetAmount" type="number" step="0.01" placeholder="Ex: 25000.00" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Prazo (Data ou '-')</Label>
                                    <Input id="deadline" name="deadline" placeholder="Ex: 45947 ou '12/2026'" />
                                </div>

                                <SubmitButton title="Criar Cofrinho" />
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
