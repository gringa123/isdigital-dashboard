import { NextResponse } from 'next/server'
export async function POST(request) {
  const { password } = await request.json()
  if (password !== process.env.AUTH_PASSWORD) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  const response = NextResponse.json({ success: true })
  response.cookies.set('isdigital_auth', process.env.AUTH_SECRET, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:604800, path:'/' })
  return response
}
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('isdigital_auth')
  return response
}
