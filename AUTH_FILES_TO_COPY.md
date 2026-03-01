# Arquivos de Autenticacao - Equilibra

Copie os arquivos abaixo para seu projeto.

---

## 1. /lib/types.ts (adicionar no inicio)

```typescript
// Usuario
export interface User {
  id: string
  name: string
  email: string
  password: string // hash simples para localStorage
  createdAt: string
}

export interface AuthState {
  user: Omit<User, 'password'> | null
  isAuthenticated: boolean
}
```

---

## 2. /hooks/use-auth.ts (arquivo novo)

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthState } from "@/lib/types"

const USERS_KEY = "equilibra_users"
const SESSION_KEY = "equilibra_session"

// Hash simples para localStorage (NAO usar em producao real)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }
  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) {
    const session = JSON.parse(stored)
    return { user: session, isAuthenticated: true }
  }
  return { user: null, isAuthenticated: false }
}

function saveSession(user: Omit<User, 'password'> | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    setAuthState(session)
    setIsLoading(false)
  }, [])

  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()
    
    // Verificar se email ja existe
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Este email ja esta cadastrado" }
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password: simpleHash(password),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    // Auto login apos registro
    const { password: _, ...userWithoutPassword } = newUser
    saveSession(userWithoutPassword)
    setAuthState({ user: userWithoutPassword, isAuthenticated: true })

    return { success: true }
  }, [])

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers()
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && 
           u.password === simpleHash(password)
    )

    if (!user) {
      return { success: false, error: "Email ou senha incorretos" }
    }

    const { password: _, ...userWithoutPassword } = user
    saveSession(userWithoutPassword)
    setAuthState({ user: userWithoutPassword, isAuthenticated: true })

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setAuthState({ user: null, isAuthenticated: false })
    router.push("/login")
  }, [router])

  const updateProfile = useCallback(async (
    data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!authState.user) {
      return { success: false, error: "Usuario nao autenticado" }
    }

    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === authState.user!.id)

    if (userIndex === -1) {
      return { success: false, error: "Usuario nao encontrado" }
    }

    const user = users[userIndex]

    // Se estiver alterando a senha, verificar a senha atual
    if (data.newPassword) {
      if (!data.currentPassword || simpleHash(data.currentPassword) !== user.password) {
        return { success: false, error: "Senha atual incorreta" }
      }
      user.password = simpleHash(data.newPassword)
    }

    // Se estiver alterando o email, verificar se ja existe
    if (data.email && data.email.toLowerCase() !== user.email) {
      if (users.some(u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== user.id)) {
        return { success: false, error: "Este email ja esta em uso" }
      }
      user.email = data.email.toLowerCase()
    }

    if (data.name) {
      user.name = data.name
    }

    users[userIndex] = user
    saveUsers(users)

    const { password: _, ...userWithoutPassword } = user
    saveSession(userWithoutPassword)
    setAuthState({ user: userWithoutPassword, isAuthenticated: true })

    return { success: true }
  }, [authState.user])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
  }
}
```

---

## 3. /components/app/auth-guard.tsx (arquivo novo)

```typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

---

## 4. /app/(auth)/login/page.tsx (arquivo novo)

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        router.push("/app")
      } else {
        setError(result.error || "Erro ao fazer login")
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link 
                  href="/recuperar-senha" 
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full rounded-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Nao tem uma conta?{" "}
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
```

---

## 5. /app/(auth)/cadastro/page.tsx (arquivo novo)

```typescript
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "Minimo 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Uma letra maiuscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Uma letra minuscula", test: (p) => /[a-z]/.test(p) },
  { label: "Um numero", test: (p) => /[0-9]/.test(p) },
]

export default function CadastroPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      valid: req.test(password)
    }))
  }, [password])

  const isPasswordValid = passwordValidation.every(r => r.valid)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isPasswordValid) {
      setError("A senha nao atende aos requisitos minimos")
      return
    }

    if (!passwordsMatch) {
      setError("As senhas nao coincidem")
      return
    }

    if (!acceptTerms) {
      setError("Voce precisa aceitar os termos de uso")
      return
    }

    setIsLoading(true)

    try {
      const result = await register(name, email, password)
      if (result.success) {
        router.push("/app")
      } else {
        setError(result.error || "Erro ao criar conta")
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Requisitos de senha */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordValidation.map((req, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 text-xs ${
                        req.valid ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {req.valid ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs ${passwordsMatch ? "text-green-600" : "text-destructive"}`}>
                  {passwordsMatch ? "Senhas coincidem" : "Senhas nao coincidem"}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label 
                htmlFor="terms" 
                className="text-sm leading-tight text-muted-foreground"
              >
                Concordo com os{" "}
                <Link href="/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-primary hover:underline">
                  Politica de Privacidade
                </Link>
              </label>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full rounded-full" 
              size="lg"
              disabled={isLoading || !isPasswordValid || !passwordsMatch || !acceptTerms}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Ja tem uma conta?{" "}
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
```

---

## 6. /app/app/layout.tsx (modificar existente)

Adicione o import e envolva o conteudo com AuthGuard:

```typescript
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app/app-sidebar"
import { AuthGuard } from "@/components/app/auth-guard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
```

---

## 7. /components/app/app-sidebar.tsx (modificar existente)

Adicione nos imports:
```typescript
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
```

No componente, adicione:
```typescript
const { user, logout } = useAuth()
```

No SidebarFooter, adicione o botao de logout e info do usuario:
```typescript
<SidebarFooter className="px-4 py-4">
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === "/app/configuracoes"}>
        <Link href="/app/configuracoes">
          <Settings className="h-4 w-4" />
          <span>Configuracoes</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton onClick={logout} className="text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
  {user && (
    <div className="mt-3 border-t pt-3">
      <p className="truncate text-sm font-medium">{user.name}</p>
      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
    </div>
  )}
</SidebarFooter>
```

---

## Estrutura de Pastas

```
/app
  /(auth)
    /login
      page.tsx
    /cadastro
      page.tsx
  /app
    layout.tsx (modificado)
/components
  /app
    auth-guard.tsx
    app-sidebar.tsx (modificado)
/hooks
  use-auth.ts
/lib
  types.ts (modificado)
```
