import { NextResponse } from 'next/server'
import { addReservation, recordEvent } from '@/lib/platformStore'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const result = await addReservation(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await recordEvent({ ...body, type: 'reservation_created' }, request)
  return NextResponse.json({ ok: true, reservation: result.reservation })
}
