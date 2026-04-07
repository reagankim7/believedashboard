import Navbar from '@/components/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
// import { redirect } from 'next/navigation'
// import { createSupabaseServerClient } from '@/lib/supabaseServer'
// import Navbar from '@/components/Navbar'


// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createSupabaseServerClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }

//   return (
//     <div>
//       <Navbar />
//       {children}
//     </div>
//   )
// }