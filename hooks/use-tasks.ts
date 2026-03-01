"use client"

import { useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { Task, SubTask, LifeArea, TaskPriority, TaskStatus } from "@/lib/types"

const STORAGE_KEY = "equilibra_tasks"

export function useTasks() {
  const [tasks, setTasks, isLoaded] = useLocalStorage<Task[]>(STORAGE_KEY, [])

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks" | "status">) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        status: "pendente",
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTasks((prev) => [...prev, newTask])
      return newTask
    },
    [setTasks]
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      )
    },
    [setTasks]
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    },
    [setTasks]
  )

  const addSubtask = useCallback(
    (taskId: string, title: string) => {
      const subtask: SubTask = {
        id: crypto.randomUUID(),
        title,
        completed: false,
      }
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: [...task.subtasks, subtask],
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      )
      return subtask
    },
    [setTasks]
  )

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                ),
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      )
    },
    [setTasks]
  )

  const deleteSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      )
    },
    [setTasks]
  )

  const getTasksByArea = useCallback(
    (area: LifeArea) => tasks.filter((task) => task.area === area),
    [tasks]
  )

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => tasks.filter((task) => task.status === status),
    [tasks]
  )

  const getTasksByPriority = useCallback(
    (priority: TaskPriority) => tasks.filter((task) => task.priority === priority),
    [tasks]
  )

  const getAreaStats = useCallback(
    (area: LifeArea) => {
      const areaTasks = tasks.filter((task) => task.area === area)
      const completed = areaTasks.filter((t) => t.status === "concluida").length
      const total = areaTasks.length
      return {
        total,
        completed,
        pending: total - completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    },
    [tasks]
  )

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getTasksByArea,
    getTasksByStatus,
    getTasksByPriority,
    getAreaStats,
  }
}
