"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LIFE_AREAS, PRIORITY_CONFIG } from "@/lib/constants"
import type { LifeArea, TaskPriority, TaskStatus } from "@/lib/types"

interface TaskFiltersProps {
  selectedArea: LifeArea | "all"
  selectedPriority: TaskPriority | "all"
  selectedStatus: TaskStatus | "all"
  onAreaChange: (area: LifeArea | "all") => void
  onPriorityChange: (priority: TaskPriority | "all") => void
  onStatusChange: (status: TaskStatus | "all") => void
  onClearFilters: () => void
}

export function TaskFilters({
  selectedArea,
  selectedPriority,
  selectedStatus,
  onAreaChange,
  onPriorityChange,
  onStatusChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasFilters =
    selectedArea !== "all" || selectedPriority !== "all" || selectedStatus !== "all"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={selectedArea} onValueChange={(v) => onAreaChange(v as LifeArea | "all")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Área" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as áreas</SelectItem>
          {Object.entries(LIFE_AREAS).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
                {value.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedPriority}
        onValueChange={(v) => onPriorityChange(v as TaskPriority | "all")}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(PRIORITY_CONFIG).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
                {value.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus}
        onValueChange={(v) => onStatusChange(v as TaskStatus | "all")}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="em_progresso">Em Progresso</SelectItem>
          <SelectItem value="concluida">Concluída</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
