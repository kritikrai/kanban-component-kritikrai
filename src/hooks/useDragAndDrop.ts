import { useCallback, useRef, useState } from 'react'

interface DragState {
  isDragging: boolean
  draggedId: string | null
  overColumnId: string | null
  overIndex: number | null
}

export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    overColumnId: null,
    overIndex: null
  })

  const dragImageRef = useRef<HTMLDivElement | null>(null)

  const onDragStart = useCallback((id: string, ev: React.DragEvent) => {
    setState(s => ({ ...s, isDragging: true, draggedId: id }))
    // Use a transparent drag image to rely on our own ghost styles
    if (!dragImageRef.current) {
      const el = document.createElement('div')
      el.style.opacity = '0'
      document.body.appendChild(el)
      dragImageRef.current = el
    }
    if (dragImageRef.current) ev.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
    ev.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDragOver = useCallback((columnId: string, index: number, ev: React.DragEvent) => {
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'move'
    setState(s => ({ ...s, overColumnId: columnId, overIndex: index }))
  }, [])

  const onDrop = useCallback(() => {
    setState(s => ({ ...s, isDragging: false }))
  }, [])

  const reset = useCallback(() => {
    setState({ isDragging: false, draggedId: null, overColumnId: null, overIndex: null })
  }, [])

  // Keyboard DnD (space to pick, arrows to move index, enter to drop) — parent component interprets
  const [kbdActive, setKbdActive] = useState(false)
  const [kbdIndex, setKbdIndex] = useState<number>(0)
  const [kbdColumn, setKbdColumn] = useState<string | null>(null)
  const startKeyboardDrag = useCallback((id: string, columnId: string, index: number) => {
    setState(s => ({ ...s, draggedId: id, isDragging: true }))
    setKbdActive(true); setKbdColumn(columnId); setKbdIndex(index)
  }, [])
  const moveKeyboard = useCallback((deltaCol: -1|0|1, deltaIndex: -1|0|1, columnsOrder: string[], columnSizes: Record<string, number>) => {
    if (!kbdActive || !kbdColumn) return
    const currentColIdx = columnsOrder.indexOf(kbdColumn)
    const nextColIdx = Math.min(Math.max(0, currentColIdx + deltaCol), columnsOrder.length - 1)
    const nextColId = columnsOrder[nextColIdx]
    const size = columnSizes[nextColId] ?? 0
    const nextIndex = Math.min(Math.max(0, kbdIndex + deltaIndex), size)
    setKbdColumn(nextColId)
    setKbdIndex(nextIndex)
    setState(s => ({ ...s, overColumnId: nextColId, overIndex: nextIndex }))
  }, [kbdActive, kbdColumn, kbdIndex])

  const commitKeyboardDrop = useCallback(() => {
    setKbdActive(false)
    setState(s => ({ ...s, isDragging: false }))
    return { columnId: kbdColumn, index: kbdIndex }
  }, [kbdColumn, kbdIndex])

  return {
    ...state,
    onDragStart, onDragOver, onDrop, reset,
    // keyboard helpers
    kbdActive, startKeyboardDrag, moveKeyboard, commitKeyboardDrop
  }
}