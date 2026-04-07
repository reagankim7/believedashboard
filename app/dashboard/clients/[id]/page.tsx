import { createSupabaseServerClient } from '@/lib/supabaseServer'
import ClientDetail from './ClientDetail'

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServerClient()
  const { id } = await params

  const { data: client } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <div style={{ padding: 40 }}>
      <ClientDetail client={client} />
    </div>
  )
}