import { NextResponse } from 'next/server'
import { addOrder, recordEvent } from '@/lib/platformStore'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const result = await addOrder(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await recordEvent({ ...body, type: 'order_created' }, request)
  return NextResponse.json({ ok: true, order: result.order })
}
