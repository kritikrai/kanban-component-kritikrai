import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

import { KanbanBoard } from './components/KanbanBoard/KanbanBoard'
import { sampleColumns, sampleTasks } from './sampleData'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="p-4">
      <KanbanBoard
        columns={sampleColumns}
        tasks={sampleTasks}
        onTaskMove={(taskId, from, to, newIndex) => console.log('move', {taskId, from, to, newIndex})}
        onTaskCreate={(col, task) => console.log('create', {col, task})}
        onTaskUpdate={(id, updates) => console.log('update', {id, updates})}
        onTaskDelete={(id) => console.log('delete', id)}
      />
    </div>
  </React.StrictMode>,
)