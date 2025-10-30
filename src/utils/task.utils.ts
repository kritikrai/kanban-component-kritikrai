import dayjs from 'dayjs'

export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > new Date(dueDate);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getPriorityColor = (priority?: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-blue-50 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-50 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-50 text-red-700 border-l-4 border-red-500',
  };
  return priority ? (colors[priority] ?? colors.medium) : '';
};

export const formatDate = (d?: Date): string => {
  if (!d) return '';
  return dayjs(d).format('MMM D, YYYY');
};