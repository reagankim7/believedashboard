export default function AddClientPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Coming Soon</h1>
        <p style={styles.text}>
          Adding new clients will be available soon.
        </p>
      </div>
    </div>
  )
}

const styles: any = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  },

  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    border: '1px solid #eee',
    textAlign: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
  },

  text: {
    color: '#777',
  },
}