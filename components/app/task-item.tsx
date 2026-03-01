"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { LIFE_AREAS, PRIORITY_CONFIG } from "@/lib/constants"
import type { Task } from "@/lib/types"

interface TaskItemProps {
  task: Task
  onToggleStatus: () => void
  onEdit: () => void
  onDelete: () => void
  onAddSubtask: (title: string) => void
  onToggleSubtask: (subtaskId: string) => void
  onDeleteSubtask: (subtaskId: string) => void
}

export function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)

  const area = LIFE_AREAS[task.area]
  const priority = PRIORITY_CONFIG[task.priority]
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length
  const hasSubtasks = task.subtasks.length > 0

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask.trim())
      setNewSubtask("")
      setIsAddingSubtask(false)
    }
  }

  return (
    <div
      className={`rounded-lg border bg-card transition-colors ${
        task.status === "concluida" ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggleStatus}
          className="mt-0.5 shrink-0"
          aria-label={task.status === "concluida" ? "Marcar como pendente" : "Marcar como concluída"}
        >
          {task.status === "concluida" ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={`font-medium ${
                  task.status === "concluida" ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
                aria-label="Editar tarefa"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={onDelete}
                aria-label="Excluir tarefa"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: `${area.color}15`, color: area.color }}
            >
              {area.name}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs"
              style={{ borderColor: priority.color, color: priority.color }}
            >
              {priority.label}
            </Badge>
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">
                Vence em {new Date(task.dueDate).toLocaleDateString("pt-BR")}
              </span>
            )}
            {hasSubtasks && (
              <span className="text-xs text-muted-foreground">
                {completedSubtasks}/{task.subtasks.length} subtarefas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtarefas */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border-t px-4 py-2 flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 -ml-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Subtarefas
            </Button>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => {
              setIsOpen(true)
              setIsAddingSubtask(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 group"
              >
                <button
                  onClick={() => onToggleSubtask(subtask.id)}
                  className="shrink-0"
                >
                  {subtask.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <span
                  className={`text-sm flex-1 ${
                    subtask.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {subtask.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => onDeleteSubtask(subtask.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {isAddingSubtask && (
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Nova subtarefa..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSubtask()
                    if (e.key === "Escape") setIsAddingSubtask(false)
                  }}
                  autoFocus
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddSubtask}
                  disabled={!newSubtask.trim()}
                >
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingSubtask(false)}
                >
                  Cancelar
                </Button>
              </div>
            )}

            {!isAddingSubtask && task.subtasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nenhuma subtarefa ainda.
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
