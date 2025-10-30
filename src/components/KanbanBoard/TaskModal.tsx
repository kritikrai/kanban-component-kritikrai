import React, { useState } from 'react'
import type { KanbanTask } from './KanbanBoard.types'
import { Modal } from '../primitives/Modal'
import { Button } from '../primitives/Button'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (task: KanbanTask) => void
  initial?: Partial<KanbanTask> & { id?: string }
  columnId: string
}

export const TaskModal: React.FC<Props> = ({ open, onClose, onSave, initial = {}, columnId }) => {
  const [title, setTitle] = useState(initial.title ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [priority, setPriority] = useState<KanbanTask['priority']>(initial.priority ?? 'medium')
  const [assignee, setAssignee] = useState(initial.assignee ?? '')
  const [dueDate, setDueDate] = useState<string>(initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0,10) : '')

  const handleSave = () => {
    const id = initial.id ?? `task-${Math.random().toString(36).slice(2,8)}`
    const task: KanbanTask = {
      id,
      title: title || 'Untitled Task',
      description: description || undefined,
      status: initial.status ?? columnId,
      priority: priority,
      assignee: assignee || undefined,
      tags: [],
      createdAt: initial.createdAt ?? new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined
    }
    onSave(task)
  }

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Task' : 'New Task'}>
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span>Title</span>
          <input className="border rounded-lg px-2 py-1" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Description</span>
          <textarea className="border rounded-lg px-2 py-1" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Priority</span>
          <select className="border rounded-lg px-2 py-1" value={priority} onChange={e => setPriority(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span>Assignee</span>
          <input className="border rounded-lg px-2 py-1" value={assignee} onChange={e => setAssignee(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Due date</span>
          <input type="date" className="border rounded-lg px-2 py-1" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  )
}