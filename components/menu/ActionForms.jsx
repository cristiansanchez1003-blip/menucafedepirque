'use client'

import { useState } from 'react'
import { formatCLP } from '@/lib/format'

export default function ActionForms({ branchId, qrSourceId, featuredProduct }) {
  const [mode, setMode] = useState('reserva')
  const [message, setMessage] = useState(null)
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    adults: 2,
    children: 0,
    name: '',
    phone: '',
    email: '',
    occasion: '',
    requirements: '',
    allergies: '',
  })
  const [order, setOrder] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    quantity: 1,
  })

  function updateReservation(field, value) {
    setReservation((current) => ({ ...current, [field]: value }))
  }

  function updateOrder(field, value) {
    setOrder((current) => ({ ...current, [field]: value }))
  }

  async function submitReservation(e) {
    e.preventDefault()
    setMessage('Guardando reserva...')
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...reservation, branch_id: branchId, qr_source_id: qrSourceId }),
    })
    const data = await res.json()
    setMessage(res.ok ? 'Reserva recibida. El local debe confirmarla desde el panel.' : data.error)
  }

  async function submitOrder(e) {
    e.preventDefault()
    if (!featuredProduct) return
    setMessage('Enviando pedido...')
    const quantity = Number(order.quantity || 1)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_id: branchId,
        qr_source_id: qrSourceId,
        customer: { name: order.name, phone: order.phone, email: order.email },
        items: [{ product_id: featuredProduct.id, name: featuredProduct.name, quantity, price: featuredProduct.price }],
        total: featuredProduct.price * quantity,
        notes: order.notes,
        fulfillment: 'pickup',
      }),
    })
    const data = await res.json()
    setMessage(res.ok ? 'Pedido recibido. Pago al retirar en el local.' : data.error)
  }

  const inputCls = 'rounded-xl border border-linen bg-paper px-4 py-3 text-[14px] outline-none focus:border-forest focus:ring-2 focus:ring-mint dark:border-linendark dark:bg-paperdark'

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <div className="rounded-[22px] border border-linen bg-card p-5 shadow-card dark:border-linendark dark:bg-carddark">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-forest dark:text-mint">
              Acciones rápidas
            </p>
            <h2 className="mt-1 font-playfair text-[28px] font-bold text-ink dark:text-paper">
              Reserva o pide para retirar
            </h2>
          </div>
          <div className="rounded-full border border-linen bg-paper p-1 dark:border-linendark dark:bg-paperdark">
            {['reserva', 'pedido'].map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-black capitalize ${
                  mode === item ? 'bg-ink text-mint dark:bg-mint dark:text-ink' : 'text-muted'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {mode === 'reserva' ? (
          <form onSubmit={submitReservation} className="mt-5 grid gap-3 md:grid-cols-3">
            <input required type="date" value={reservation.date} onChange={(e) => updateReservation('date', e.target.value)} className={inputCls} />
            <input required type="time" value={reservation.time} onChange={(e) => updateReservation('time', e.target.value)} className={inputCls} />
            <input required value={reservation.name} onChange={(e) => updateReservation('name', e.target.value)} placeholder="Nombre" className={inputCls} />
            <input required value={reservation.phone} onChange={(e) => updateReservation('phone', e.target.value)} placeholder="Teléfono" className={inputCls} />
            <input type="email" value={reservation.email} onChange={(e) => updateReservation('email', e.target.value)} placeholder="Correo opcional" className={inputCls} />
            <input type="number" min="1" value={reservation.adults} onChange={(e) => updateReservation('adults', e.target.value)} placeholder="Adultos" className={inputCls} />
            <input value={reservation.occasion} onChange={(e) => updateReservation('occasion', e.target.value)} placeholder="Ocasión" className={inputCls} />
            <input value={reservation.allergies} onChange={(e) => updateReservation('allergies', e.target.value)} placeholder="Alergias" className={inputCls} />
            <input value={reservation.requirements} onChange={(e) => updateReservation('requirements', e.target.value)} placeholder="Requerimientos" className={inputCls} />
            <button className="rounded-xl bg-forest px-5 py-3 text-[14px] font-black text-white md:col-span-3">
              Solicitar reserva
            </button>
          </form>
        ) : (
          <form onSubmit={submitOrder} className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-linen bg-paper p-4 dark:border-linendark dark:bg-paperdark md:col-span-3">
              <p className="text-[12px] font-bold text-muted">Pedido rápido</p>
              <p className="font-lato text-[16px] font-black text-ink dark:text-paper">
                {featuredProduct?.name || 'Producto destacado'} · {formatCLP(featuredProduct?.price || 0)}
              </p>
              <p className="mt-1 text-[12.5px] text-muted dark:text-muteddark">
                Pago al retirar. Pasarela de pago no conectada.
              </p>
            </div>
            <input required value={order.name} onChange={(e) => updateOrder('name', e.target.value)} placeholder="Nombre" className={inputCls} />
            <input required value={order.phone} onChange={(e) => updateOrder('phone', e.target.value)} placeholder="Teléfono" className={inputCls} />
            <input type="number" min="1" value={order.quantity} onChange={(e) => updateOrder('quantity', e.target.value)} placeholder="Cantidad" className={inputCls} />
            <input type="email" value={order.email} onChange={(e) => updateOrder('email', e.target.value)} placeholder="Correo opcional" className={inputCls} />
            <input value={order.notes} onChange={(e) => updateOrder('notes', e.target.value)} placeholder="Comentarios" className={`${inputCls} md:col-span-2`} />
            <button className="rounded-xl bg-forest px-5 py-3 text-[14px] font-black text-white md:col-span-3">
              Enviar pedido
            </button>
          </form>
        )}

        {message && <p className="mt-3 text-[13px] font-bold text-forest dark:text-mint">{message}</p>}
      </div>
    </section>
  )
}
