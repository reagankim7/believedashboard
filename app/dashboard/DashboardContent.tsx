import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()


  const { data: trainer } = await supabase
  .from('trainers')
  .select('*')
  .eq('id', '15431d30-65d0-4402-b425-0f60588bafb4')
  .single()
  // // 1. Get logged-in user
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // 2. Get trainer
  // const { data: trainer } = await supabase
  //   .from('trainers')
  //   .select('*')
  //   .eq('auth_user_id', user?.id)
  //   .single()

  // 3. Get clients for this trainer
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('trainer_id', trainer?.id)
    .order('created_at', { ascending: false })

  // 4. Split categories
 const sixWeekClients = users?.filter(
  (u: any) => u.category === '6-week'
  )

  const oneOnOneClients = users?.filter(
    (u: any) => u.category === '1-on-1'
  )

  const uncategorizedClients = users?.filter(
    (u: any) => !u.category // handles NULL / undefined
  )

  const trainerName = trainer?.name || 'Coach'

  function getDaysLeft(startDate: string) {
    const start = new Date(startDate)
    const today = new Date()

    const diffTime = today.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    const totalDays = 42
    const daysLeft = totalDays - diffDays

    return daysLeft > 0 ? daysLeft : 0
  }

  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.welcome}>
            Welcome, <span style={styles.highlight}>{trainerName}</span>
          </h1>
          <p style={styles.subtext}>Manage your clients and track progress</p>
        </div>

        {/* 6-WEEK CLIENTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6-Week Program Clients</h2>

          {!sixWeekClients?.length && (
            <div style={styles.emptyState}>
              No clients yet
            </div>
          )}

          <div style={styles.grid}>
            {sixWeekClients?.map((client: any) => {
              const daysLeft = getDaysLeft(client.program_start_date)

              return (
                <Link key={client.id} href={`/dashboard/users/${client.id}`}>
                  <div style={styles.card}>
                    <div>
                      <p style={styles.name}>{client.name || 'No Name'}</p>
                      <p style={styles.phone}>{client.phone_number}</p>
                    </div>

                    {/* 🔥 DAYS LEFT BADGE */}
                    <span style={styles.daysBadge}>
                      {daysLeft > 0
                        ? `${daysLeft} days left`
                        : 'Completed'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 1-ON-1 CLIENTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1-on-1 Clients</h2>

          {!oneOnOneClients?.length && (
            <div style={styles.emptyState}>
              No clients yet
            </div>
          )}

          <div style={styles.grid}>
            {oneOnOneClients?.map((client: any) => (
              <Link key={client.id} href={`/dashboard/users/${client.id}`}>
                <div style={styles.card}>
                  <div>
                    <p style={styles.name}>{client.name || 'No Name'}</p>
                    <p style={styles.phone}>{client.phone_number}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* UNCATEGORIZED CLIENTS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Uncategorized Clients</h2>

          {!uncategorizedClients?.length && (
            <div style={styles.emptyState}>
              No uncategorized clients
            </div>
          )}

          <div style={styles.grid}>
            {uncategorizedClients?.map((client: any) => (
              <Link key={client.id} href={`/dashboard/users/${client.id}`}>
                <div style={styles.card}>
                  <div>
                    <p style={styles.name}>{client.name || 'No Name'}</p>
                    <p style={styles.phone}>{client.phone_number}</p>
                  </div>

                  {/* 🔥 small status tag */}
                  <span style={styles.badge}>
                    Needs Category
                  </span>
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
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },

  inner: {
    maxWidth: 1100,
    margin: '0 auto',
  },

  header: {
    marginBottom: 30,
  },

  welcome: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 6,
  },

  emptyState: {
    padding: 20,
    border: '1px dashed #ddd',
    borderRadius: 10,
    color: '#777',
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },

  highlight: {
    color: '#d4a017',
  },

  subtext: {
    color: '#666',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    borderLeft: '4px solid #d4a017',
    paddingLeft: 10,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },

  card: {
    padding: 18,
    border: '1px solid #eaeaea',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
  },

  name: {
    fontWeight: 600,
    marginBottom: 4,
  },

  phone: {
    margin: 0,
    color: '#777',
    fontSize: 14,
  },

  badge: {
    fontSize: 12,
    backgroundColor: '#ffe5b4',
    color: '#a15c00',
    padding: '4px 8px',
    borderRadius: 6,
    fontWeight: 500,
  },

  daysBadge: {
    fontSize: 12,
    backgroundColor: '#e6f4ea',
    color: '#1e7e34',
    padding: '6px 10px',
    borderRadius: 8,
    fontWeight: 600,
  },
}