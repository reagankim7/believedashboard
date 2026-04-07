'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      alert('Error sending login email')
      alert(error.message)
    } else {
      alert('Check your email for login link!')
    }

    setLoading(false)
  }

  return (
    <div style={{
      padding: 20,
      fontFamily: 'sans-serif',
      maxWidth: 400,
      margin: '100px auto'
    }}>
      <h1>Believe Fitness Login</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          marginTop: 10,
          marginBottom: 10
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: 10
        }}
      >
        {loading ? 'Sending...' : 'Login'}
      </button>
    </div>
  )
}