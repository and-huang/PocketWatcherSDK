import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  console.log('[dynamic] received webhook', { headers, rawBody })

  const { error } = await supabase.from('webhook_deliveries').insert({
    provider: 'dynamic',
    raw_payload: JSON.parse(rawBody),
    headers,
    verified: false,
  })

  if (error) {
    console.error('[dynamic] insert error', error)
    return NextResponse.json({ error: 'insert failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
