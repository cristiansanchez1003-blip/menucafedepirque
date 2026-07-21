'use client'

import { trackEvent } from '@/hooks/usePlatform'

export default function ReviewsSection({ branch, reviews = [], qrSourceId }) {
  if (!branch) return null
  const featured = reviews.filter((review) => review.featured).slice(0, 2)

  async function handleReviewClick() {
    await trackEvent({
      type: 'review_click',
      branch_id: branch.id,
      qr_source_id: qrSourceId,
    })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <div className="rounded-[22px] bg-ink p-5 text-white shadow-cardHover">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-mint">
              Google Reviews
            </p>
            <h2 className="mt-2 font-playfair text-[30px] font-bold leading-tight">
              ¿Cómo estuvo tu experiencia?
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-white/65">
              Tu opinión ayuda al local a mejorar y a que más personas descubran la sucursal.
            </p>
            <a
              href={branch.reviewUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleReviewClick}
              className="mt-4 inline-flex rounded-full bg-mint px-5 py-3 text-[13px] font-black text-ink"
            >
              Déjanos tu opinión
            </a>
            <p className="mt-3 text-[11.5px] text-white/42">
              Integración Google Business: no conectada. Reseñas visibles: datos de ejemplo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((review) => (
              <article key={review.id} className="rounded-[18px] border border-white/10 bg-white/8 p-4">
                <div className="text-mint">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/78">&quot;{review.text}&quot;</p>
                <p className="mt-3 text-[12px] font-black text-white">{review.author}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
