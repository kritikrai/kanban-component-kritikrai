import React from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost'

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }> = ({
  className,
  variant = 'primary',
  ...props
}) => {
  const styles = clsx(
    'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500',
    variant === 'primary' && 'bg-primary-600 hover:bg-primary-700 text-white shadow',
    variant === 'secondary' && 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
    variant === 'ghost' && 'hover:bg-neutral-100 text-neutral-700',
    className
  )
  return <button className={styles} {...props} />
}