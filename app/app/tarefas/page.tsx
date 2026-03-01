"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TaskDialog } from "@/components/app/task-dialog"
import { TaskItem } from "@/components/app/task-item"
import { TaskFilters } from "@/components/app/task-filters"
import { useTasks } from "@/hooks/use-tasks"
import type { Task, LifeArea, TaskPriority, TaskStatus } from "@/lib/types"

import { Suspense } from "react"

export default function TarefasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando Tarefas...</div>}>
      <TarefasPageContent />
    </Suspense>
  )
}

function TarefasPageContent() {
  const searchParams = useSearchParams()
  const {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Filtros
  const [selectedArea, setSelectedArea] = useState<LifeArea | "all">("all")
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all")

  // Abrir dialog se ?nova=true
  useEffect(() => {
    if (searchParams.get("nova") === "true") {
      setDialogOpen(true)
    }
  }, [searchParams])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedArea !== "all" && task.area !== selectedArea) return false
      if (selectedPriority !== "all" && task.priority !== selectedPriority) return false
      if (selectedStatus !== "all" && task.status !== selectedStatus) return false
      return true
    }).sort((a, b) => {
      // Ordenar por prioridade e depois por data
      const priorityOrder = { urgente: 0, alta: 1, media: 2, baixa: 3 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]
      if (aPriority !== bPriority) return aPriority - bPriority
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [tasks, selectedArea, selectedPriority, selectedStatus])

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

  const clearFilters = () => {
    setSelectedArea("all")
    setSelectedPriority("all")
    setSelectedStatus("all")
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas em todas as áreas da vida
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <TaskFilters
        selectedArea={selectedArea}
        selectedPriority={selectedPriority}
        selectedStatus={selectedStatus}
        onAreaChange={setSelectedArea}
        onPriorityChange={setSelectedPriority}
        onStatusChange={setSelectedStatus}
        onClearFilters={clearFilters}
      />

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            {tasks.length === 0
              ? "Você ainda não tem tarefas. Comece criando a primeira!"
              : "Nenhuma tarefa encontrada com os filtros selecionados."}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar primeira tarefa
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
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

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingTask(null)
        }}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  )
}
