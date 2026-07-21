import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { readPlatform } from '@/lib/platformStore'

export const dynamic = 'force-dynamic'

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export async function GET(request) {
  const session = getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const platform = await readPlatform()
  const rows = platform.newsletter_subscribers.map((subscriber) => [
    subscriber.email,
    subscriber.name,
    subscriber.status,
    subscriber.consent ? 'sí' : 'no',
    subscriber.preferences?.join('|') || '',
    subscriber.branch_id,
    subscriber.qr_source_id,
    subscriber.created_at,
  ])
  const csv = [
    ['email', 'nombre', 'estado', 'consentimiento', 'preferencias', 'sucursal', 'origen_qr', 'fecha'].map(csvCell).join(','),
    ...rows.map((row) => row.map(csvCell).join(',')),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="newsletter-cafe-raiz.csv"',
    },
  })
}
