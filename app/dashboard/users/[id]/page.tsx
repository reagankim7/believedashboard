import { createSupabaseServerClient } from '@/lib/supabaseServer'
import MealsDashboard from './MealsDashboard'


export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createSupabaseServerClient()

  const { id: userId } = await params

  // 1. Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
    
  console.log('USER ID:', userId)
  console.log('USER ERROR:', userError)
  console.log('USER DATA:', user)
  
  // 2. Get meals
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  console.log('MEALS ERROR:', mealsError)
  console.log('MEALS DATA:', meals)

  // 3. Group meals by date
  const groupedMeals = meals?.reduce((acc: any, meal: any) => {
    const date = new Date(meal.created_at).toDateString()

    if (!acc[date]) acc[date] = []
    acc[date].push(meal)

    return acc
  }, {})

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <MealsDashboard user={user} meals={meals || []} />
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
    maxWidth: 1000,
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

  dateHeader: {
    marginBottom: 10,
  },

  macros: {
    color: '#666',
    fontSize: 14,
  },

  grid: {
    display: 'grid',
    gap: 16,
  },

  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    border: '1px solid #eee',
  },

  image: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 10,
  },

  foodTitle: {
    fontWeight: 600,
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },

  macrosSmall: {
    fontSize: 13,
    color: '#444',
  },
}