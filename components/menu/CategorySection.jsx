'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

export default function CategorySection({ category, products, onSelect, sectionRef }) {
  if (products.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id={`cat-${category.id}`}
      data-category={category.id}
      className="scroll-mt-[64px] px-4 pt-7"
    >
      <motion.div
        className="mb-3.5 flex items-center gap-2.5 px-1"
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.45 }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint/60 text-lg">
          {category.emoji}
        </span>
        <h2 className="font-playfair text-[21px] font-bold text-ink">{category.name}</h2>
        <span className="ml-auto rounded-full bg-ink/5 px-2.5 py-1 text-[11.5px] font-bold text-muted">
          {products.length}
        </span>
      </motion.div>

      <div className="flex flex-col gap-2.5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            emoji={category.emoji}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
