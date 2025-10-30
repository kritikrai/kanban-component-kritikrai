import React, { useMemo, useState, useCallback } from 'react'
import type { KanbanColumn, KanbanTask, KanbanViewProps } from './KanbanBoard.types'
import { KanbanColumn as Column } from './KanbanColumn'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { TaskModal } from './TaskModal'

export const KanbanBoard: React.FC<KanbanViewProps> = (props) => {
  const { columns: initialColumns, tasks: initialTasks } = props

  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks)

  const drag = useDragAndDrop()
  const [modal, setModal] = useState<{ open: boolean; columnId: string | null; editTask?: KanbanTask }>({
    open: false,
    columnId: null
  })

  const mapTasksFor = useCallback((col: KanbanColumn) => col.taskIds.map(id => tasks[id]).filter(Boolean), [tasks])

  const columnsOrder = useMemo(() => columns.map(c => c.id), [columns])
  const columnSizes = useMemo(() => Object.fromEntries(columns.map(c => [c.id, c.taskIds.length])), [columns])

  const onDragStartCard = (taskId: string, ev: React.DragEvent) => {
    drag.onDragStart(taskId, ev)
  }

  const onDragOverCard = (columnId: string, index: number, ev: React.DragEvent) => {
    drag.onDragOver(columnId, index, ev)
  }

  const onDropColumn = (columnId: string) => {
    if (drag.draggedId && drag.overIndex !== null) {
      const fromColumn = columns.find(c => c.taskIds.includes(drag.draggedId!))!
      const toColumn = columns.find(c => c.id === columnId)!
      const newIndex = drag.overIndex

      if (fromColumn.id === toColumn.id) {
        const ids = fromColumn.taskIds.slice()
        const currentIndex = ids.indexOf(drag.draggedId!)
        ids.splice(currentIndex, 1)
        ids.splice(newIndex, 0, drag.draggedId!)
        setColumns(cols => cols.map(c => c.id === fromColumn.id ? { ...c, taskIds: ids } : c))
      } else {
        const fromIds = fromColumn.taskIds.slice()
        const toIds = toColumn.taskIds.slice()
        const currentIndex = fromIds.indexOf(drag.draggedId!)
        fromIds.splice(currentIndex, 1)
        toIds.splice(newIndex, 0, drag.draggedId!)
        setColumns(cols => cols.map(c => {
          if (c.id === fromColumn.id) return { ...c, taskIds: fromIds }
          if (c.id === toColumn.id) return { ...c, taskIds: toIds }
          return c
        }))
        setTasks(t => ({ ...t, [drag.draggedId!]: { ...t[drag.draggedId!], status: toColumn.id } }))
      }

      props.onTaskMove(drag.draggedId!, fromColumn.id, toColumn.id, newIndex)
    }
    drag.onDrop()
    drag.reset()
  }

  // Keyboard DnD integration
  const onKeyDragStart = (task: KanbanTask, columnId: string, index: number) => {
    drag.startKeyboardDrag(task.id, columnId, index)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!drag.kbdActive) return
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft') drag.moveKeyboard(-1, 0, columnsOrder, columnSizes)
    if (e.key === 'ArrowRight') drag.moveKeyboard(1, 0, columnsOrder, columnSizes)
    if (e.key === 'ArrowUp') drag.moveKeyboard(0, -1, columnsOrder, columnSizes)
    if (e.key === 'ArrowDown') drag.moveKeyboard(0, 1, columnsOrder, columnSizes)
    if (e.key === 'Enter') {
      const result = drag.commitKeyboardDrop()
      if (result.columnId && drag.draggedId != null && result.index != null) {
        onDropColumn(result.columnId)
      }
    }
    if (e.key === 'Escape') {
      drag.reset()
    }
  }

  // callbacks required by props
  const handleCreate = (columnId: string, task: KanbanTask) => {
    setTasks(prev => ({ ...prev, [task.id]: task }))
    setColumns(prev => prev.map(c => c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c))
    props.onTaskCreate(columnId, task)
  }
  const handleUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], ...updates } }))
    props.onTaskUpdate(taskId, updates)
  }
  const handleDelete = (taskId: string) => {
    setColumns(prev => prev.map(c => ({ ...c, taskIds: c.taskIds.filter(id => id !== taskId) })))
    setTasks(prev => {
      const copy = { ...prev }
      delete copy[taskId]
      return copy
    })
    props.onTaskDelete(taskId)
  }

  return (
    <div className="w-full" onKeyDown={onKeyDown}>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-2">
        {columns.map(col => (
          <div key={col.id} className="snap-start">
            <Column
              column={col}
              tasks={mapTasksFor(col)}
              onAddTask={(columnId) => setModal({ open: true, columnId })}
              onEditTask={(task) => setModal({ open: true, columnId: task.status, editTask: task })}
              onDeleteTask={handleDelete}
              drag={{
                onDragOverCard,
                onDragStartCard,
                onDropColumn,
                isDragging: drag.isDragging,
                onKeyDragStart
              }}
            />
          </div>
        ))}
      </div>

      <TaskModal
        open={modal.open}
        columnId={modal.columnId ?? ''}
        initial={modal.editTask}
        onClose={() => setModal({ open: false, columnId: null })}
        onSave={(task) => {
          if (modal.editTask) {
            handleUpdate(task.id, task)
          } else {
            handleCreate(modal.columnId!, task)
          }
          setModal({ open: false, columnId: null })
        }}
      />
    </div>
  )
}