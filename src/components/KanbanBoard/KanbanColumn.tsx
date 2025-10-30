import React, { memo } from 'react'
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types'
import { KanbanCard } from './KanbanCard'
import { Button } from '../primitives/Button'

interface Props {
  column: KanbanColumn
  tasks: KanbanTask[]
  onAddTask: (columnId: string) => void
  onEditTask: (task: KanbanTask) => void
  onDeleteTask: (taskId: string) => void
  drag: {
    onDragOverCard: (columnId: string, index: number, ev: React.DragEvent) => void
    onDragStartCard: (taskId: string, ev: React.DragEvent) => void
    onDropColumn: (columnId: string) => void
    isDragging: boolean
    onKeyDragStart: (task: KanbanTask, columnId: string, index: number) => void
  }
}

export const KanbanColumn: React.FC<Props> = memo(({ column, tasks, onAddTask, onEditTask, onDeleteTask, drag }) => {
  const count = tasks.length
  const nearingWip = typeof column.maxTasks === 'number' && count >= (column.maxTasks - 1)
  const overWip = typeof column.maxTasks === 'number' && count > column.maxTasks

  return (
    <div
      className="shrink-0 w-[300px] max-w-[320px] rounded-xl bg-neutral-50 border border-neutral-200 p-3 mr-3"
      role="region"
      aria-label={`${column.title} column. ${count} tasks.`}
      onDragOver={(e) => drag.onDragOverCard(column.id, count, e)}
      onDrop={() => drag.onDropColumn(column.id)}
    >
      <div className="sticky top-0 z-10 bg-neutral-50 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold" style={{ color: column.color }}>{column.title}</h3>
          <div className="text-xs text-neutral-600">{count}{typeof column.maxTasks === 'number' ? ` / ${column.maxTasks}` : ''}</div>
        </div>
        {nearingWip && <div className="text-xs text-warning-700">Approaching WIP limit</div>}
        {overWip && <div className="text-xs text-error-700">Over WIP limit</div>}
      </div>

      <div className="mt-2 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {tasks.length === 0 && (
          <div className="text-sm text-neutral-500 italic">No tasks</div>
        )}
        {tasks.map((task, idx) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => drag.onDragStartCard(task.id, e)}
            onDragOver={(e) => drag.onDragOverCard(column.id, idx, e)}
          >
            <KanbanCard
              task={task}
              index={idx}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              draggableProps={{ draggable: true, onDragStart: (e) => drag.onDragStartCard(task.id, e) }}
              dragState={{ isDragging: drag.isDragging }}
              onKeyDragStart={drag.onKeyDragStart}
              columnId={column.id}
            />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Button aria-label={`Add task to ${column.title}`} onClick={() => onAddTask(column.id)}>Add Task</Button>
      </div>
    </div>
  )
})