'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div style={styles.navbar}>
      
        {/* LEFT: BRAND */}
        <div style={styles.left}>
        <Link href="/dashboard" style={styles.logo}>
            Believe Fitness
        </Link>
        </div>

        {/* CENTER: NAV LINKS */}
        <div style={styles.center}>
        <Link
            href="/dashboard"
            style={{
            ...styles.link,
            ...(pathname === '/dashboard' ? styles.active : {}),
            }}
        >
            Home
        </Link>

        <Link
            href="/dashboard/clients"
            style={{
            ...styles.link,
            ...(pathname.startsWith('/dashboard/clients') ? styles.active : {}),
            }}
        >
            Clients
        </Link>

        <Link
            href="/dashboard/add"
            style={{
            ...styles.link,
            ...(pathname === '/dashboard/add' ? styles.active : {}),
            }}
        >
            Add Client
        </Link>
        </div>

        {/* RIGHT: (future user/logout) */}
        <div style={styles.right}>
        {/* placeholder */}
        </div>

    </div>
  )
}

const styles: any = {
    navbar: {
        width: '100%',
        padding: '16px 50px',
        backgroundColor: '#3c3c3c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },

    left: {
        fontWeight: 700,
    },

    logo: {
        textDecoration: 'none',
        color: '#d4a017',
        fontSize: 20,
        letterSpacing: 0.5,
    },

    center: {
        display: 'flex',
        gap: 30, // more spacing
    },

    link: {
        textDecoration: 'none',
        color: '#bbb',
        fontSize: 15,
        fontWeight: 500,
        paddingBottom: 4,
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s ease',
    },

    active: {
        color: '#d4a017',
        fontWeight: 700,
        borderBottom: '2px solid #d4a017',
    },

    right: {},
}