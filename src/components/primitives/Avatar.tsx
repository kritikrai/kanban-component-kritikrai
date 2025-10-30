import React from 'react'
import { getInitials } from '../../utils/task.utils'

export const Avatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center" aria-label={`Assignee ${name}`}>
      {getInitials(name)}
    </div>
  )
}