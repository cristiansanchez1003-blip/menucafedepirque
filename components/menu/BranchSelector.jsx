'use client'

export default function BranchSelector({ branches = [], selectedId, onSelect }) {
  if (!branches.length) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
      <div className="rounded-[18px] border border-linen bg-card p-3 shadow-card dark:border-linendark dark:bg-carddark">
        <p className="px-1 text-[11px] font-black uppercase tracking-[0.18em] text-forest dark:text-mint">
          Elige sucursal
        </p>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {branches.map((branch) => {
            const active = branch.id === selectedId
            return (
              <button
                key={branch.id}
                onClick={() => onSelect(branch.id)}
                className={`min-w-[210px] rounded-[16px] border p-3 text-left transition active:scale-[0.98] ${
                  active
                    ? 'border-forest bg-mintsoft text-ink dark:border-mint dark:bg-forest/25 dark:text-paper'
                    : 'border-linen bg-paper text-ink/75 dark:border-linendark dark:bg-paperdark dark:text-paper/75'
                }`}
              >
                <span className="block text-[14px] font-black">{branch.name}</span>
                <span className="mt-1 block truncate text-[12px] text-muted dark:text-muteddark">
                  {branch.address}
                </span>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-black uppercase tracking-[0.1em] ${
                  branch.operational?.open ? 'bg-forest text-white' : 'bg-ink/10 text-muted dark:bg-paper/10'
                }`}>
                  {branch.operational?.label || 'Estado no disponible'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
