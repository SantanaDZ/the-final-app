"use client"

import Link from "next/link"
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LifeAreaInfo } from "@/lib/types"

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

interface AreaCardProps {
  area: LifeAreaInfo
  stats: {
    total: number
    completed: number
    pending: number
    percentage: number
  }
}

export function AreaCard({ area, stats }: AreaCardProps) {
  const Icon = iconMap[area.icon] || Heart

  return (
    <Link href={`/app/area/${area.id}`}>
      <Card className="group transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{area.name}</CardTitle>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:scale-110"
            style={{ backgroundColor: `${area.color}15` }}
          >
            <Icon className="h-4 w-4" style={{ color: area.color }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.percentage}%</p>
              <p className="text-xs text-muted-foreground">
                {stats.completed} de {stats.total} tarefas
              </p>
            </div>
          </div>
          <Progress
            value={stats.percentage}
            className="mt-3 h-1.5"
            style={
              {
                "--progress-background": area.color,
              } as React.CSSProperties
            }
          />
        </CardContent>
      </Card>
    </Link>
  )
}
