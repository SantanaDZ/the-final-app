"use client"

import Link from "next/link"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LIFE_AREAS, PRIORITY_CONFIG } from "@/lib/constants"
import type { Task } from "@/lib/types"

interface RecentTasksProps {
  tasks: Task[]
  onToggleStatus: (taskId: string) => void
}

export function RecentTasks({ tasks, onToggleStatus }: RecentTasksProps) {
  const recentTasks = tasks
    .filter((t) => t.status !== "concluida")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/app/tarefas">
            Ver todas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma tarefa pendente. Que tal criar uma?
          </p>
        ) : (
          <ul className="space-y-3">
            {recentTasks.map((task) => {
              const area = LIFE_AREAS[task.area]
              const priority = PRIORITY_CONFIG[task.priority]
              
              return (
                <li
                  key={task.id}
                  className="flex items-start gap-3 group"
                >
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {task.status === "concluida" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                        style={{ backgroundColor: `${area.color}15`, color: area.color }}
                      >
                        {area.name}
                      </Badge>
                      <span
                        className="text-xs"
                        style={{ color: priority.color }}
                      >
                        {priority.label}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
