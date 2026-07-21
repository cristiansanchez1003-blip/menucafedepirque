'use client'

import { useEffect, useRef } from 'react'
import { localizedField } from '@/lib/i18n'
import { useApp } from '@/contexts/AppContext'
import ControlsBar from './ControlsBar'

export default function CategoryNav({ categories, activeId, onSelect }) {
  const barRef = useRef(null)
  const pillRefs = useRef({})
  const { lang } = useApp()

  useEffect(() => {
    const pill = pillRefs.current[activeId]
    if (pill && barRef.current) {
      const bar = barRef.current
      const target = pill.offsetLeft - bar.clientWidth / 2 + pill.clientWidth / 2
      bar.scrollTo({ left: target, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <nav className="sticky top-0 z-30 border-b border-linen/70 bg-paper/92 backdrop-blur-xl dark:border-linendark/70 dark:bg-paperdark/92">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-6">
        <div
          ref={barRef}
          className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto"
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
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-black transition-all duration-200 active:scale-95 sm:px-5 ${
                  active
                    ? 'bg-ink text-mint shadow-nav dark:bg-mint dark:text-ink'
                    : 'border border-linen bg-card text-ink/70 hover:border-forest/30 hover:text-ink dark:border-linendark dark:bg-carddark dark:text-paper/70'
                }`}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {localizedField(cat, 'name', lang)}
              </button>
            )
          })}
        </div>

        <ControlsBar />
      </div>
    </nav>
  )
}
