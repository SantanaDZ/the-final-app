"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    CheckSquare,
    Wallet,
    Settings,
    Heart,
    Home,
    Users,
    Sparkles,
    GraduationCap,
    Briefcase,
    HeartHandshake,
    Brain,
    LogOut,
} from "lucide-react"

import { signout } from "@/app/actions/auth"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { LIFE_AREAS } from "@/lib/constants"
import type { LifeArea } from "@/lib/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Heart,
    Home,
    Users,
    Sparkles,
    GraduationCap,
    Briefcase,
    Wallet,
    HeartHandshake,
    Brain,
}

const mainNavItems = [
    { title: "Dashboard", href: "/app", icon: LayoutDashboard },
    { title: "Tarefas", href: "/app/tarefas", icon: CheckSquare },
    { title: "Finanças", href: "/financas-planilha", icon: Wallet },
]

export function AppSidebarClient({ user }: { user: any }) {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="px-4 py-4">
                <Link href="/app" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">E</span>
                    </div>
                    <span className="text-lg font-semibold tracking-tight">Equilibra</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Áreas da Vida</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {(Object.keys(LIFE_AREAS) as LifeArea[]).map((areaKey) => {
                                const area = LIFE_AREAS[areaKey]
                                const Icon = iconMap[area.icon] || Heart
                                const href = `/app/area/${areaKey}`
                                const isActive = pathname === href

                                return (
                                    <SidebarMenuItem key={areaKey}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={href}>
                                                {/*@ts-ignore*/}
                                                <Icon className="h-4 w-4" style={{ color: isActive ? area.color : undefined }} />
                                                <span>{area.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-4 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/app/configuracoes"}>
                            <Link href="/app/configuracoes">
                                <Settings className="h-4 w-4" />
                                <span>Configurações</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <form action={signout} className="w-full">
                            <SidebarMenuButton type="submit" className="text-muted-foreground hover:text-destructive w-full">
                                <LogOut className="h-4 w-4" />
                                <span>Sair</span>
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
                {user && (
                    <div className="mt-3 border-t pt-3">
                        <p className="truncate text-sm font-medium">{user.user_metadata?.name || 'Usuário'}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
