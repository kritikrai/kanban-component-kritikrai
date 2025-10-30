import type { Meta, StoryObj } from '@storybook/react'
import { KanbanBoard } from './KanbanBoard'
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types'

const meta: Meta<typeof KanbanBoard> = {
  title: 'Kanban/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  }
}
export default meta

const makeData = (n = 8) => {
  const cols: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 10 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 5 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] }
  ]
  const tasks: Record<string, KanbanTask> = {}
  let i = 1
  for (; i <= n; i++) {
    const id = `task-${i}`
    const col = cols[i % cols.length]
    col.taskIds.push(id)
    tasks[id] = {
      id, title: `Task ${i} sample title`, description: i % 2 === 0 ? 'Optional description' : undefined,
      status: col.id, priority: (['low','medium','high','urgent'] as const)[i%4], assignee: i%3? 'Jane Smith':'John Doe',
      tags: ['frontend','ui','react'].slice(0,(i%3)+1), createdAt:new Date(2024,0,10+i), dueDate: i%2? undefined : new Date(2024,0,20+i)
    }
  }
  return { columns: cols, tasks }
}

// Default
export const Default: StoryObj<typeof KanbanBoard> = {
  args: {
    ...makeData(12),
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  }
}

// Empty State
export const Empty: StoryObj<typeof KanbanBoard> = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] }
    ],
    tasks: {},
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  }
}

// Many Tasks (30+)
export const LargeDataset: StoryObj<typeof KanbanBoard> = {
  args: {
    ...makeData(36),
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  }
}

// Mobile View (simulate narrow container)
export const MobileResponsive: StoryObj<typeof KanbanBoard> = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <KanbanBoard {...args} />
    </div>
  ),
  args: {
    ...makeData(8),
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  }
}

// Interactive Playground
export const InteractivePlayground: StoryObj<typeof KanbanBoard> = {
  args: {
    ...makeData(10),
    onTaskMove: (taskId, from, to, index) => console.log('move', {taskId, from, to, index}),
    onTaskCreate: (col, task) => console.log('create', {col, task}),
    onTaskUpdate: (id, updates) => console.log('update', {id, updates}),
    onTaskDelete: (id) => console.log('delete', id),
  },
  parameters: {
    controls: { expanded: true }
  }
}