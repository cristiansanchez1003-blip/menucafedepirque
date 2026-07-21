import { NextResponse } from 'next/server'
import { recordEvent, summarizePlatform } from '@/lib/platformStore'
import { readMenu } from '@/lib/menuStore'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!body?.type) {
    return NextResponse.json({ error: 'Falta el tipo de evento' }, { status: 400 })
  }

  try {
    const result = await recordEvent(body, request)
    const menu = await readMenu()
    const analytics = summarizePlatform(result.platform, menu, {
      businessId: body.business_id,
      branchId: body.branch_id || 'all',
      days: 7,
    })
    return NextResponse.json({
      ok: true,
      deduped: result.deduped,
      event_id: result.event?.id || null,
      analytics,
    })
  } catch (err) {
    console.error('Error registrando evento:', err)
    return NextResponse.json({ error: 'No se pudo registrar el evento' }, { status: 500 })
  }
}
