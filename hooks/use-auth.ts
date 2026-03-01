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
