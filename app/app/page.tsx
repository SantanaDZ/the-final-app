"use client"

import { useRouter } from "next/navigation"

import { AreaCard } from "@/components/app/area-card"
import { QuickActions } from "@/components/app/quick-actions"
import { RecentTasks } from "@/components/app/recent-tasks"
import { FinanceSummaryCard } from "@/components/app/finance-summary-card"
import { LIFE_AREAS } from "@/lib/constants"
import { useTasks } from "@/hooks/use-tasks"
import { useEffect, useState } from "react"
import { getDashboardData } from "@/app/actions/dashboard"
import type { LifeArea, FinanceSummary } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const { tasks, isLoaded: tasksLoaded, getAreaStats, updateTask } = useTasks()
  const [financesLoaded, setFinancesLoaded] = useState(false)
  const [summary, setSummary] = useState<FinanceSummary>({
    saldo: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    byCategory: {} as any
  })

  useEffect(() => {
    async function fetchFinances() {
      const dbData = await getDashboardData()
      setSummary({
        saldo: dbData.saldo,
        totalReceitas: dbData.entradas,
        totalDespesas: dbData.saidas,
        byCategory: {} as any
      })
      setFinancesLoaded(true)
    }
    fetchFinances()
  }, [])

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTask(taskId, {
        status: task.status === "concluida" ? "pendente" : "concluida",
      })
    }
  }

  if (!tasksLoaded || !financesLoaded) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu equilíbrio de vida
        </p>
      </div>

      <QuickActions
        onNewTask={() => router.push("/app/tarefas?nova=true")}
        onVoiceInput={() => router.push("/chat")}
        onViewFinances={() => router.push("/financas-planilha")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTasks tasks={tasks} onToggleStatus={handleToggleStatus} />
        <FinanceSummaryCard summary={summary} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Áreas da Vida</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(LIFE_AREAS) as LifeArea[]).map((areaKey) => {
            const area = LIFE_AREAS[areaKey]
            const stats = getAreaStats(areaKey)
            return <AreaCard key={areaKey} area={area} stats={stats} />
          })}
        </div>
      </div>
    </div>
  )
}
