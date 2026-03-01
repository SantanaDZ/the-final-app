"use client"

import { Plus, Mic, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickActionsProps {
  onNewTask: () => void
  onVoiceInput: () => void
  onViewFinances: () => void
}

export function QuickActions({ onNewTask, onVoiceInput, onViewFinances }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button onClick={onNewTask} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
        <Button onClick={onVoiceInput} size="sm" variant="secondary" className="gap-2">
          <Mic className="h-4 w-4" />
          Adicionar por Voz
        </Button>
        <Button onClick={onViewFinances} size="sm" variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Ver Finanças
        </Button>
      </CardContent>
    </Card>
  )
}
