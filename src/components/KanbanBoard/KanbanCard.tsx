import React, { memo } from 'react'
import type { KanbanTask } from './KanbanBoard.types'
import { getPriorityColor, isOverdue, formatDate } from '../../utils/task.utils'
import { Avatar } from '../primitives/Avatar'

interface KanbanCardProps {
  task: KanbanTask
  index: number
  onEdit: (task: KanbanTask) => void
  onDelete: (taskId: string) => void
  draggableProps: {
    draggable: boolean
    onDragStart: (ev: React.DragEvent) => void
  }
  dragState: { isDragging: boolean }
  onKeyDragStart: (task: KanbanTask, columnId: string, index: number) => void
  columnId: string
}

export const KanbanCard: React.FC<KanbanCardProps> = memo(({ task, index, onEdit, onDelete, draggableProps, dragState, onKeyDragStart, columnId }) => {
  const priorityClass = getPriorityColor(task.priority)

  return (
    <div
      className={`bg-white border border-neutral-200 rounded-lg p-3 shadow-card hover:shadow-card-hover transition-shadow cursor-grab active:cursor-grabbing ${priorityClass}`}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.status}. Priority: ${task.priority ?? 'none'}. Press space to grab.`}
      aria-grabbed={dragState.isDragging}
      onKeyDown={(e) => {
        if (e.code === 'Space') { e.preventDefault(); onKeyDragStart(task, columnId, index) }
      }}
      {...draggableProps}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2">{task.title}</h4>
        {task.priority && (<span className="text-xs px-2 py-0.5 rounded bg-neutral-100 capitalize">{task.priority}</span>)}
      </div>

      {task.description && (<p className="text-xs text-neutral-600 mb-2 line-clamp-2">{task.description}</p>)}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {task.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
        {task.assignee && <Avatar name={task.assignee} />}
      </div>

      {task.dueDate && (
        <div className={`text-xs mt-2 ${isOverdue(task.dueDate) ? 'text-error-700' : 'text-neutral-500'}`}>
          Due: {formatDate(task.dueDate)}
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <button className="text-xs underline" onClick={() => onEdit(task)}>Edit</button>
        <button className="text-xs underline text-error-700" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
})