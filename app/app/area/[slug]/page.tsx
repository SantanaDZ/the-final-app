"use client"

import { useState, useMemo } from "react"
import { useParams, notFound } from "next/navigation"
import { Plus } from "lucide-react"
import {
  Heart,
  Home,
  Users,
  Sparkles,
  GraduationCap,
  Briefcase,
  Wallet,
  HeartHandshake,
  Brain,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TaskDialog } from "@/components/app/task-dialog"
import { TaskItem } from "@/components/app/task-item"
import { LIFE_AREAS } from "@/lib/constants"
import { useTasks } from "@/hooks/use-tasks"
import type { Task, LifeArea, TaskPriority } from "@/lib/types"

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

export default function AreaPage() {
  const params = useParams()
  const slug = params.slug as string

  // Verificar se a área existe
  if (!LIFE_AREAS[slug as LifeArea]) {
    notFound()
  }

  const area = LIFE_AREAS[slug as LifeArea]
  const Icon = iconMap[area.icon] || Heart

  const {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getAreaStats,
  } = useTasks()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const areaTasks = useMemo(() => {
    return tasks
      .filter((t) => t.area === slug)
      .sort((a, b) => {
        // Colocar concluídas no final
        if (a.status === "concluida" && b.status !== "concluida") return 1
        if (a.status !== "concluida" && b.status === "concluida") return -1
        // Ordenar por prioridade
        const priorityOrder = { urgente: 0, alta: 1, media: 2, baixa: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
  }, [tasks, slug])

  const stats = getAreaStats(slug as LifeArea)

  const handleSaveTask = (data: {
    title: string
    description?: string
    area: LifeArea
    priority: TaskPriority
    dueDate?: string
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      updateTask(taskId, {
        status: task.status === "concluida" ? "pendente" : "concluida",
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${area.color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color: area.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{area.name}</h1>
            <p className="text-muted-foreground">{area.description}</p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-3xl font-bold" style={{ color: area.color }}>
                {stats.percentage}%
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.completed} de {stats.total} tarefas concluídas
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">pendentes</p>
            </div>
          </div>
          <Progress
            value={stats.percentage}
            className="h-2"
            style={
              {
                "--progress-background": area.color,
              } as React.CSSProperties
            }
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tarefas</h2>
        {areaTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20">
            <Icon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhuma tarefa nesta área ainda.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar primeira tarefa
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {areaTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={() => handleToggleStatus(task.id)}
                onEdit={() => handleEditTask(task)}
                onDelete={() => deleteTask(task.id)}
                onAddSubtask={(title) => addSubtask(task.id, title)}
                onToggleSubtask={(subtaskId) => toggleSubtask(task.id, subtaskId)}
                onDeleteSubtask={(subtaskId) => deleteSubtask(task.id, subtaskId)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingTask(null)
        }}
        task={editingTask}
        defaultArea={slug as LifeArea}
        onSave={handleSaveTask}
      />
    </div>
  )
}
