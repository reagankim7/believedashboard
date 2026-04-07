import { supabase } from './supabaseClient'

export async function getUsers() {
  return supabase.from('users').select('*')
}

export async function getMealsByUser(userId: string) {
  return supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
}