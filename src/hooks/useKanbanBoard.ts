import { useCallback, useMemo, useState } from 'react'
import type { KanbanColumn, KanbanTask } from '../components/KanbanBoard/KanbanBoard.types'
import { moveTaskBetweenColumns, reorderTasks } from '../utils/column.utils'

export const useKanbanBoard = (initialColumns: KanbanColumn[], initialTasks: Record<string, KanbanTask>) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks)

  const getColumnById = useCallback((id: string) => columns.find(c => c.id === id)!, [columns])

  const createTask = useCallback((columnId: string, task: KanbanTask) => {
    setTasks(prev => ({ ...prev, [task.id]: task }))
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c))
  }, [])

  const updateTask = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setColumns(prev => prev.map(c => ({ ...c, taskIds: c.taskIds.filter(id => id !== taskId) })))
    setTasks(prev => {
      const copy = { ...prev }
      delete copy[taskId]
      return copy
    })
  }, [])

  const moveTask = useCallback((taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setColumns(prev => {
      const from = prev.find(c => c.id === fromColumn)!
      const to = prev.find(c => c.id === toColumn)!

      if (from.id === to.id) {
        const reordered = reorderTasks(from.taskIds, from.taskIds.indexOf(taskId), newIndex)
        return prev.map(c => c.id === from.id ? { ...c, taskIds: reordered } : c)
      } else {
        const { source, destination } = moveTaskBetweenColumns(from.taskIds, to.taskIds, from.taskIds.indexOf(taskId), newIndex)
        return prev.map(c => {
          if (c.id === from.id) return { ...c, taskIds: source }
          if (c.id === to.id) return { ...c, taskIds: destination }
          return c
        })
      }
    })
    setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], status: toColumn } }))
  }, [])

  return {
    columns, tasks,
    createTask, updateTask, deleteTask, moveTask,
    getColumnById
  }
}