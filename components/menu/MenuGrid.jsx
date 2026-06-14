'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  )
}

export default function MenuGrid({ products, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-lato text-muted">
          No hay productos en esta categoría por ahora.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04 } },
      }}
      className="grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <ProductCard product={product} onClick={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  )
}
