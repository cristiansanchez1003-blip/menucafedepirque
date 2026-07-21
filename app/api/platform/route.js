import { NextResponse } from 'next/server'
import { readMenu } from '@/lib/menuStore'
import { generateRecommendations, isOpenNow, readPlatform, summarizePlatform } from '@/lib/platformStore'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('business_id') || 'cafe-raiz'
  const branchId = searchParams.get('branch') || 'all'
  const days = searchParams.get('days') || '7'

  try {
    const [platform, menu] = await Promise.all([readPlatform(), readMenu()])
    const analytics = summarizePlatform(platform, menu, { businessId, branchId, days })
    const recommendations = generateRecommendations(platform, menu, analytics)
    const business = platform.businesses.find((item) => item.id === businessId) || platform.businesses[0]
    const branches = platform.branches.filter((item) => item.business_id === business.id)

    return NextResponse.json({
      business,
      branches: branches.map((branch) => ({ ...branch, operational: isOpenNow(branch) })),
      qr_sources: platform.qr_sources.filter((item) => item.business_id === business.id),
      reservations: platform.reservations.filter((item) => item.business_id === business.id),
      orders: platform.orders.filter((item) => item.business_id === business.id),
      subscribers: platform.newsletter_subscribers.filter((item) => item.business_id === business.id),
      loyalty_customers: platform.loyalty_customers.filter((item) => item.business_id === business.id),
      reviews: platform.reviews.filter((item) => item.business_id === business.id),
      notices: platform.notices.filter((item) => item.business_id === business.id),
      integrations: platform.integrations.filter((item) => item.business_id === business.id),
      analytics,
      recommendations,
    })
  } catch (err) {
    console.error('Error leyendo plataforma:', err)
    return NextResponse.json({ error: 'No se pudo cargar la plataforma' }, { status: 500 })
  }
}
