import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "../actions/auth"

export default async function LoginPage(
    props: {
        searchParams: Promise<{ error?: string }>
    }
) {
    const searchParams = await props.searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-semibold tracking-tight" style={{ letterSpacing: '-0.022em' }}>
                        Equilibra
                    </CardTitle>
                    <CardDescription className="text-base">
                        Entre na sua conta para continuar
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Sua senha"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            formAction={login}
                            type="submit"
                            className="w-full rounded-full"
                            size="lg"
                        >
                            Entrar
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Não tem uma conta?{" "}
                            <Link href="/cadastro" className="font-medium text-primary hover:underline">
                                Criar conta
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
