'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ClientDetail({ client }: { client: any }) {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(client)

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enableEdit() {
    const confirmed = confirm(
      'Are you sure you want to enter editing mode? This will change the user data.'
    )

    if (confirmed) {
      setEditMode(true)
    }
  }

  async function handleSave() {
    const { error } = await supabase
      .from('users')
      .update(form)
      .eq('id', client.id)

    if (!error) {
      alert('Saved successfully')
      setEditMode(false)
    } else {
      alert('Error saving changes')
    }
  }

return (
  <div style={styles.container}>

    {/* HEADER */}
    <div style={styles.header}>
      <div>
        <h1 style={styles.name}>{client.name}</h1>
        <p style={styles.sub}>
          {client.category || 'Uncategorized'}
        </p>
      </div>

      {!editMode ? (
        <button onClick={enableEdit} style={styles.editBtn}>
          Edit
        </button>
      ) : (
        <button onClick={handleSave} style={styles.saveBtn}>
          Save Changes
        </button>
      )}
    </div>

    {/* SECTION: BASIC INFO */}
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Basic Info</h2>

      <div style={styles.grid}>
        {renderField('Name', 'name')}
        {renderField('Phone', 'phone_number')}
        {renderField('Age', 'age')}
        {renderField('Gender', 'gender')}
      </div>
    </div>

    {/* SECTION: BODY METRICS */}
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Body Metrics</h2>

      <div style={styles.grid}>
        {renderField('Weight (kg)', 'weight')}
        {renderField('Body Fat (%)', 'body_fat')}
        {renderField('Lean Mass', 'lean_mass')}
      </div>
    </div>

    {/* SECTION: PROGRAM */}
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Program</h2>

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Category</label>

          {editMode ? (
            <select
              name="category"
              value={form.category || ''}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Category</option>
              <option value="6-week">6-Week Program</option>
              <option value="1-on-1">1-on-1 Coaching</option>
            </select>
          ) : (
            <p style={styles.value}>{form.category || '-'}</p>
          )}
        </div>
        
        {renderField('Calorie Goal', 'calorie_goal')}
        {renderField('Start Date', 'program_start_date')}
      </div>
    </div>

  </div>
)

  function renderField(label: string, key: string) {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>

        {editMode ? (
          <input
            name={key}
            value={form[key] || ''}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <p style={styles.value}>{form[key] || '-'}</p>
        )}
      </div>
    )
  }
}

const styles: any = {
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '40px 20px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  name: {
    fontSize: 28,
    fontWeight: 700,
  },

  sub: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #eee',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    borderLeft: '4px solid #d4a017',
    paddingLeft: 10,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },

  value: {
    fontWeight: 500,
    fontSize: 15,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },

  editBtn: {
    backgroundColor: '#d4a017',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  saveBtn: {
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer',
  },
}