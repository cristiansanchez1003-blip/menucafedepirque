'use client'

import { useEffect, useRef } from 'react'

// Barra de categorías sticky con scroll horizontal.
// Al tocar una categoría, hace scroll a su sección; la píldora activa
// se mantiene visible automáticamente.
export default function CategoryNav({ categories, activeId, onSelect }) {
  const barRef = useRef(null)
  const pillRefs = useRef({})

  useEffect(() => {
    const pill = pillRefs.current[activeId]
    if (pill && barRef.current) {
      const bar = barRef.current
      const target = pill.offsetLeft - bar.clientWidth / 2 + pill.clientWidth / 2
      bar.scrollTo({ left: target, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <nav className="sticky top-0 z-30 border-b border-linen/70 bg-paper/90 backdrop-blur-md">
      <div
        ref={barRef}
        className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3"
        role="tablist"
        aria-label="Categorías del menú"
      >
        {categories.map((cat) => {
          const active = cat.id === activeId
          return (
            <button
              key={cat.id}
              ref={(el) => (pillRefs.current[cat.id] = el)}
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-bold transition-all duration-200 active:scale-95 ${
                active
                  ? 'bg-ink text-mint shadow-nav'
                  : 'border border-linen bg-card text-ink/70'
              }`}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              {cat.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
