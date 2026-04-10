'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e: any) {
    e.preventDefault()

    const { data: trainer, error: trainerError } = await supabase
      .from('trainers')
      .select('email')
      .eq('username', username.toLowerCase())
      .single()

    if (trainerError || !trainer) {
      alert('Invalid username')
      return
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: trainer.email,
      password,
    })

    if (loginError) {
      alert('Invalid password')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>

        <Image
          src="/logo.png"
          alt="Believe Fitness"
          width={200}
          height={200}
          style={{ margin: '0 auto' }}
        />

        <h1 style={styles.title}>Personal Trainer Meal Tracker</h1>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Login
        </button>

      </form>
    </div>
  )
}

const styles: any = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 16,
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center',
    margin: -18,
    paddingBottom: 18,
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 10,
  },

  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#d4a017',
    color: '#000',
    border: 'none',
    padding: '10px',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
}