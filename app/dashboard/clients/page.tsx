import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient()

  // get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // get trainer
  const { data: trainer } = await supabase
    .from('trainers')
    .select('*')
    .eq('auth_user_id', user?.id)
    .single()

  // get clients
  const { data: clients } = await supabase
    .from('users')
    .select('*')
    .eq('trainer_id', trainer?.id)
    .order('created_at', { ascending: false })

  const now = new Date()

  function isExpired(client: any) {
    if (client.category === '6-week' && client.program_start_date) {
      const start = new Date(client.program_start_date)
      const diffDays =
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

      return diffDays > 42
    }

    return false // 1-on-1 stays active
  }

  const activeClients = clients?.filter((c: any) => !isExpired(c))
  const expiredClients = clients?.filter((c: any) => isExpired(c))

  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        <h1 style={styles.title}>Clients</h1>

        {/* ACTIVE */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Clients</h2>

          {!activeClients?.length && (
            <div style={styles.empty}>No active clients</div>
          )}

          <div style={styles.grid}>
            {activeClients?.map((client: any) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
              >
                <div style={styles.card}>
                  <p style={styles.name}>{client.name}</p>
                  <p style={styles.meta}>
                    {client.category || 'Uncategorized'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* EXPIRED */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Expired Clients</h2>

          {!expiredClients?.length && (
            <div style={styles.empty}>No expired clients</div>
          )}

          <div style={styles.grid}>
            {expiredClients?.map((client: any) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
              >
                <div style={styles.cardExpired}>
                  <p style={styles.name}>{client.name}</p>
                  <p style={styles.meta}>
                    Program completed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const styles: any = {
  container: {
    padding: '40px 60px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },

  inner: {
    maxWidth: 1100,
    margin: '0 auto',
  },

  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 20,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    borderLeft: '4px solid #d4a017',
    paddingLeft: 10,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #eee',
    cursor: 'pointer',
  },

  cardExpired: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    border: '1px solid #ddd',
    opacity: 0.7,
    cursor: 'pointer',
  },

  name: {
    fontWeight: 600,
    marginBottom: 4,
  },

  meta: {
    fontSize: 13,
    color: '#666',
  },

  empty: {
    padding: 16,
    border: '1px dashed #ddd',
    borderRadius: 10,
    textAlign: 'center',
    color: '#777',
  },
}