import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
export default function DashboardLayout({ children }) {
  const cookieStore = cookies()
  const token = cookieStore.get('isdigital_auth')
  if (token?.value !== process.env.AUTH_SECRET) redirect('/login')
  return (
    <div className="min-h-screen" style={{background:'#0a0a0f'}}>
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-4">{children}</main>
    </div>
  )
}
