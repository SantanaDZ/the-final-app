"use client"

import { useState } from "react"
import { Trash2, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ConfiguracoesPage() {
  const [exported, setExported] = useState(false)

  const handleExportData = () => {
    const tasks = localStorage.getItem("equilibra_tasks") || "[]"
    const finances = localStorage.getItem("equilibra_finances") || "[]"
    
    const data = {
      tasks: JSON.parse(tasks),
      finances: JSON.parse(finances),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `equilibra-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.tasks) {
          localStorage.setItem("equilibra_tasks", JSON.stringify(data.tasks))
        }
        if (data.finances) {
          localStorage.setItem("equilibra_finances", JSON.stringify(data.finances))
        }

        window.location.reload()
      } catch {
        alert("Erro ao importar arquivo. Verifique se é um backup válido.")
      }
    }
    input.click()
  }

  const handleClearAllData = () => {
    localStorage.removeItem("equilibra_tasks")
    localStorage.removeItem("equilibra_finances")
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie seus dados e preferências do aplicativo
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backup e Restauração</CardTitle>
            <CardDescription>
              Exporte seus dados para fazer backup ou importe um backup anterior.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleExportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {exported ? "Exportado!" : "Exportar Dados"}
            </Button>
            <Button onClick={handleImportData} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Importar Backup
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis. Tenha certeza antes de prosseguir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Apagar Todos os Dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá apagar permanentemente
                    todas as suas tarefas e transações financeiras do navegador.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, apagar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Equilibra</CardTitle>
            <CardDescription>
              Informações sobre o aplicativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Versão:</strong> 1.0.0 (Beta)
            </p>
            <p>
              <strong className="text-foreground">Armazenamento:</strong> LocalStorage (dados salvos no seu navegador)
            </p>
            <p className="pt-2">
              O Equilibra é um app de gestão de vida que ajuda você a equilibrar
              todas as 9 áreas importantes: Física, Familiar, Social, Espiritual,
              Acadêmica, Corporativa, Financeira, Amorosa e Emocional.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
