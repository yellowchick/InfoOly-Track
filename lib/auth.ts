const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export function login(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}

export function generateToken(): string {
  const token = `admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
  return Buffer.from(token).toString('base64')
}

export function setAdminCookie(): string {
  const token = generateToken()
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearAdminCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}

export function checkAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return false

  const cookies = cookieHeader.split(';').map((c) => c.trim())
  const adminCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!adminCookie) return false

  const tokenValue = adminCookie.split('=').slice(1).join('=')
  if (!tokenValue) return false

  try {
    const decoded = Buffer.from(tokenValue, 'base64').toString('utf-8')
    return decoded.startsWith('admin-token-')
  } catch {
    return false
  }
}

export function requireAdmin(request: Request): Response | null {
  if (!checkAdmin(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return null
}
