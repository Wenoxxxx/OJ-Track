import { useCallback, useEffect, useRef, useState } from 'react'

export function CustomScrollbar() {
  const [isMobile, setIsMobile] = useState(false)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ grabOffset: number; scrollTop: number } | null>(null)

  // Find the actual scrollable pane — the SidebarInset main element
  const getScrollEl = useCallback((): HTMLElement | null => {
    // SidebarInset renders as <main data-slot="sidebar-inset">
    const el = document.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')
    return el ?? null
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      const mobileMedia = window.matchMedia('(max-width: 767px)')
      const hasTouch = window.matchMedia('(pointer: coarse)').matches
      setIsMobile(mobileMedia.matches || hasTouch)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const updateScrollbar = useCallback(() => {
    if (isMobile) return
    if (!trackRef.current) return

    const el = getScrollEl()
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const scrollableHeight = scrollHeight - clientHeight

    if (scrollableHeight <= 0) {
      setThumbHeight(0)
      setThumbTop(0)
      return
    }

    const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight))
    const trackHeight = trackRef.current.clientHeight
    const rawThumb = trackHeight * (clientHeight / scrollHeight)
    const thumb = Math.max(30, Math.min(rawThumb, trackHeight))
    setThumbHeight(thumb)
    setThumbTop(progress * (trackHeight - thumb))
  }, [isMobile, getScrollEl])

  // Attach scroll listener to the content pane
  useEffect(() => {
    if (isMobile) return

    const el = getScrollEl()
    if (!el) return

    requestAnimationFrame(updateScrollbar)
    el.addEventListener('scroll', updateScrollbar, { passive: true })

    const ro = new ResizeObserver(updateScrollbar)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollbar)
      ro.disconnect()
    }
  }, [isMobile, updateScrollbar, getScrollEl])

  // Drag logic
  useEffect(() => {
    if (isMobile || !isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current || !dragStartRef.current) return

      const el = getScrollEl()
      if (!el) return

      const trackRect = trackRef.current.getBoundingClientRect()
      const { scrollHeight, clientHeight } = el
      const scrollableHeight = scrollHeight - clientHeight
      if (scrollableHeight <= 0) return

      const { grabOffset } = dragStartRef.current
      const rawTop = e.clientY - trackRect.top - grabOffset
      const maxMovable = trackRect.height - thumbHeight
      const clamped = Math.max(0, Math.min(rawTop, maxMovable))
      const ratio = maxMovable > 0 ? clamped / maxMovable : 0

      el.scrollTop = ratio * scrollableHeight
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragStartRef.current = null
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, thumbHeight, isMobile, getScrollEl])

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!trackRef.current) return
    const thumbRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const el = getScrollEl()
    dragStartRef.current = {
      grabOffset: e.clientY - thumbRect.top,
      scrollTop: el?.scrollTop ?? 0,
    }
    setIsDragging(true)
    document.body.style.userSelect = 'none'
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const el = getScrollEl()
    if (!el) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const clickY = e.clientY - trackRect.top
    const targetTop = clickY - thumbHeight / 2
    const maxMovable = trackRect.height - thumbHeight
    const clamped = Math.max(0, Math.min(targetTop, maxMovable))
    const ratio = maxMovable > 0 ? clamped / maxMovable : 0
    const { scrollHeight, clientHeight } = el

    el.scrollTo({ top: ratio * (scrollHeight - clientHeight), behavior: 'smooth' })
  }

  if (isMobile) return null

  const showScrollbar = thumbHeight > 0

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Custom scrollbar"
      className={`fixed right-0 top-24 bottom-24 w-6 z-50 hidden md:flex items-center justify-center cursor-pointer select-none group transition-opacity duration-300 ${
        showScrollbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { if (!isDragging) setIsHovered(false) }}
      onClick={handleTrackClick}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="w-[2px] h-full bg-border/40 group-hover:bg-border relative transition-colors duration-300"
      >
        {/* Thumb */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 rounded-full cursor-grab active:cursor-grabbing transition-[width,background-color,box-shadow] duration-200 ${
            isDragging || isHovered
              ? 'w-1.5 bg-primary shadow-[0_0_8px_rgba(27,93,239,0.4)]'
              : 'w-[2px] bg-muted-foreground/40'
          }`}
          style={{ height: `${thumbHeight}px`, top: `${thumbTop}px` }}
          onMouseDown={handleThumbMouseDown}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
