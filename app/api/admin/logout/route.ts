import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/auth'

export async function POST() {
  const clearCookie = clearAdminCookie()

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Set-Cookie': clearCookie,
      },
    }
  )
}
