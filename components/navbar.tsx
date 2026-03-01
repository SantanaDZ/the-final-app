import Link from "next/link"
import { LayoutDashboard, Wallet, Settings, MessageSquareMore, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
    const pathname = usePathname()

    // Se estiver nas rotas de login/cadastro, ou /app, etc, talvez você queira esconder a navbar principal?
    // Por enquanto, vamos mantê-la global ou ajustá-la caso seja The Public landing page.
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
                    <Wallet className="w-5 h-5" />
                    <span>Equilibra Finance</span>
                </Link>

                <nav className="mx-auto flex items-center justify-center gap-6 text-sm font-medium">
                    <Link href="/" className="flex items-center space-x-2 mr-6">
                        <div className="flex bg-primary text-primary-foreground p-1.5 rounded-lg mr-1 ml-1 cursor-pointer">
                            <Home size={20} />
                        </div>
                        <span className="font-bold text-lg hidden md:inline-block cursor-pointer">Menu Principal</span>
                    </Link>
                    <Link href="/financas-planilha" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard Financeiro</span>
                    </Link>
                    <Link href="/transactions" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
                        <Wallet className="w-4 h-4" />
                        <span className="hidden sm:inline">Lançamentos</span>
                    </Link>
                    <Link href="/chat" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60 text-emerald-600 dark:text-emerald-400">
                        <MessageSquareMore className="w-4 h-4" />
                        <span className="hidden sm:inline">Modo IA</span>
                    </Link>
                    <Link href="/institutions" className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Instituições</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
