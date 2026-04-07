import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function Home() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If logged in → dashboard
  if (user) {
    redirect('/dashboard')
  }

  // If not → login
  redirect('/login')
}