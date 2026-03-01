import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signup } from "../actions/auth"

export default async function CadastroPage(
    props: {
        searchParams: Promise<{ error?: string }>
    }
) {
    const searchParams = await props.searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-semibold tracking-tight" style={{ letterSpacing: '-0.022em' }}>
                        Criar Conta
                    </CardTitle>
                    <CardDescription className="text-base">
                        Comece a equilibrar todas as areas da sua vida
                    </CardDescription>
                </CardHeader>
                <form>
                    <CardContent className="space-y-4">
                        {searchParams?.error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {searchParams.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome completo</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Crie uma senha forte"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            formAction={signup}
                            type="submit"
                            className="w-full rounded-full"
                            size="lg"
                        >
                            Criar conta e Entrar
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Entrar
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
