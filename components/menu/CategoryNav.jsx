'use client'

export default function CategoryNav({ categories, activeId, onSelect }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur shadow-sm">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {categories.map((cat) => {
          const isActive = cat.id === activeId
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={[
                'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-coffee text-cream shadow'
                  : 'bg-transparent text-muted hover:bg-border/50',
              ].join(' ')}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
