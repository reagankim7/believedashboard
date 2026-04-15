'use client'

import { useState } from 'react'

export default function MealsDashboard({
  user,
  meals,
}: {
  user: any
  meals: any[]
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const now = new Date()
  now.setDate(now.getDate() - 1) // shift to yesterday
  now.setDate(now.getDate() - 1) // 👈 shift to yesterday

  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  //to show last 7 days range
  function getLast7DaysRange() {
    const end = new Date()
    end.setDate(end.getDate() - 1)

    const start = new Date(end)
    start.setDate(end.getDate() - 6)

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    }

    return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`
  }

  function goPrevMonth() {
  setCurrentDate(new Date(year, month - 1, 1))
  }

  function goNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays = []

  // empty slots before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // actual days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d))
  }

  // 🔥 LAST 7 DAYS
  const last7DaysMeals = meals.filter((meal) => {
    const date = new Date(meal.created_at)
    return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000
  })

// 🔥 GROUP LAST 7 DAYS BY DATE
const mealsByDateLast7: Record<string, any[]> = {}

last7DaysMeals.forEach((meal: any) => {
  const date = new Date(meal.created_at).toDateString()

  if (!mealsByDateLast7[date]) mealsByDateLast7[date] = []
  mealsByDateLast7[date].push(meal)
})

// 🔥 CALCULATE DAILY TOTALS
const dailyTotals = Object.values(mealsByDateLast7).map((meals: any[]) => {
  return meals.reduce(
    (sum, m) => ({
      calories: sum.calories + (m.calories || 0),
      protein: sum.protein + (m.protein || 0),
      carbs: sum.carbs + (m.carbs || 0),
      fat: sum.fat + (m.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
})

// 🔥 AVERAGE PER DAY (NOT PER MEAL)
const averages = {
  calories: Math.round(
    dailyTotals.reduce((sum, d) => sum + d.calories, 0) / 7
  ),
  protein: Math.round(
    dailyTotals.reduce((sum, d) => sum + d.protein, 0) / 7
  ),
  carbs: Math.round(
    dailyTotals.reduce((sum, d) => sum + d.carbs, 0) / 7
  ),
  fat: Math.round(
    dailyTotals.reduce((sum, d) => sum + d.fat, 0) / 7
  ),
}

  function getStatus(value: number, target: number, range: number) {
    if (value < target - range) return 'under'
    if (value > target + range) return 'over'
    return 'on target'
  }

  const calorieStatus = getStatus(
    averages.calories,
    user.calorie_goal,
    300
  )

  const proteinTarget =
    (user.lean_mass ||
      user.weight * (1 - user.body_fat / 100)) * 2

  const proteinStatus = getStatus(
    averages.protein,
    proteinTarget,
    20
  )

  function getMacroInsight() {
    const proteinText =
      proteinStatus === 'under'
        ? 'Protein low'
        : proteinStatus === 'over'
        ? 'Protein high'
        : 'Protein on target'

    const carbsStatus = getStatus(averages.carbs, 150, 20)
    const carbsText =
      carbsStatus === 'under'
        ? 'Carbs low'
        : carbsStatus === 'over'
        ? 'Carbs high'
        : 'Carbs on target'

    const fatStatus = getStatus(averages.fat, 60, 20)
    const fatText =
      fatStatus === 'under'
        ? 'Fat low'
        : fatStatus === 'over'
        ? 'Fat high'
        : 'Fat on target'

    return [proteinText, carbsText, fatText]
  }

  const macroInsights = getMacroInsight()

  function getStatusStyle(status: string) {
    if (status === 'on target')
      return { color: '#1e7e34', fontWeight: 600 }

    if (status === 'under')
      return { color: '#ffd000', fontWeight: 600 }

    return { color: '#d00000', fontWeight: 600 }
  }

  function getStatusBadgeStyle(status: string) {
    if (status === 'on target') {
      return {
        backgroundColor: '#e6f4ea',
        color: '#1e7e34',
      }
    }

    if (status === 'under') {
      return {
        backgroundColor: '#fff4cc',
        color: '#b38b00',
      }
    }

    return {
      backgroundColor: '#fdecea',
      color: '#b42318',
    }
  }

  function formatStatus(status: string) {
    if (status === 'under') return 'Under Target'
    if (status === 'over') return 'Over Target'
    return 'On Target'
  }

  function getDotColor(status: string) {
    if (status === 'on target') return '#1e7e34'
    if (status === 'under') return '#ffd000'
    return '#d00000'
  }

  function renderMacro(label: string, value: number, status: string) {
    return (
      <div style={styles.macroItem}>
        <span
          style={{
            ...styles.dot,
            backgroundColor: getDotColor(status),
          }}
        />
        <span>{label}: {Math.round(value)}g</span>
      </div>
    )
  }

  // 📅 GROUP MEALS BY DATE
  const mealsByDate = meals.reduce((acc: any, meal: any) => {
    const date = new Date(meal.created_at).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(meal)
    return acc
  }, {})

  //meal score
  function getMealScore(meal: any, user: any) {
    const weight = user.weight || 70
    const bodyFat = user.body_fat || 20
    const calorieGoal = user.calorie_goal || 2000

    const leanMass =
      user.lean_mass || weight * (1 - bodyFat / 100)

    const proteinTarget = leanMass * 2
    const idealMealCalories = calorieGoal / 3

    let score = 0

    // 🔥 1. PROTEIN (max 5)
    const proteinRatio = meal.protein / proteinTarget

    if (proteinRatio >= 0.5) score += 5
    else if (proteinRatio >= 0.3) score += 4
    else if (proteinRatio >= 0.2) score += 2
    else score += 0

    // 🔥 2. CALORIES (max 3)
    const lower = idealMealCalories * 0.7
    const upper = idealMealCalories * 1.5

    if (meal.calories >= lower && meal.calories <= upper) {
      score += 3
    } else if (meal.calories <= upper * 1.3) {
      score += 2
    } else {
      score += 1
    }

    // 🔥 3. MACRO BALANCE (with penalties)
    let balanceScore = 2

    // ❌ too much fat
    if (meal.fat > 40) balanceScore -= 1

    // ❌ too much carbs
    if (meal.carbs > 120) balanceScore -= 1

    // ❌ VERY bad (extreme case)
    if (meal.carbs > 200 || meal.fat > 80) {
      balanceScore = 0
      score -= 2 // 🚨 HARD PENALTY
    }

    score += Math.max(balanceScore, 0)

    return Math.min(score, 10)
  }

  function getScoreStyle(score: number) {
    if (score >= 8) return { color: '#1e7e34', fontWeight: 600 }
    if (score >= 5) return { color: '#ffbb00', fontWeight: 600 }
    return { color: '#ff0505', fontWeight: 600 }
  }

  return (
    <div>

      {/* HEADER */}
      <h1 style={styles.title}>{user?.name}</h1>

      {/* 🔥 LAST 7 DAYS */}
      <div style={styles.section}>
        <div style={styles.headerBlock}>
          <div style={styles.headerBlock}>
            <h2 style={styles.sectionTitle}>Last 7 Days</h2>

            <p style={styles.dateRange}>
              {getLast7DaysRange()}
            </p>

            <p style={styles.subtext}>
              Average intake based on logged meals. Missing days may affect accuracy.
            </p>
          </div>
        </div>

        <div style={styles.cardRow}>

          {/* LEFT */}
          <div>

            <div style={styles.calorieRow}>
              <span style={styles.bigCalories}>
                {Math.round(averages.calories)} kcal
              </span>

              <span style={{
                ...styles.statusBadge,
                ...getStatusBadgeStyle(calorieStatus)
              }}>
                {formatStatus(calorieStatus)}
              </span>
            </div>

            <div style={styles.macrosRow}>

              {renderMacro('Protein', averages.protein, proteinStatus)}

              {renderMacro(
                'Carbs',
                averages.carbs,
                getStatus(averages.carbs, 150, 20)
              )}

              {renderMacro(
                'Fat',
                averages.fat,
                getStatus(averages.fat, 60, 20)
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div style={styles.insightBox}>
            <p style={styles.insightTitle}>Nutrition Quality</p>

            <p style={styles.insightText}>
              {macroInsights.length > 0
                ? macroInsights.join(' • ')
                : 'Well balanced intake'}            </p>
          </div>

        </div>
      </div>

    
      {/* 📅 CALENDAR */}
      <div style={styles.section}>
        <div style={styles.calendarHeader}>
          <button onClick={goPrevMonth} style={styles.navBtn}>
            ←
          </button>

          <h2 style={styles.monthTitle}>
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <button onClick={goNextMonth} style={styles.navBtn}>
            →
          </button>
        </div>

        <div style={styles.calendarGrid}>
          {calendarDays.map((date, i) => {
            if (!date) return <div key={i}></div>

            const key = date.toDateString()
            const mealsForDay = mealsByDate[key] || []

            function getDotColor(score: number) {
              if (score >= 8) return '#1e7e34' // green
              if (score >= 5) return '#ffcc00' // yellow
              return '#ff0000' // red
}
            return (
              <div
                key={i}
                style={styles.dayBox}
                onClick={() => mealsForDay && setSelectedDate(key)}
              >
                <span>{date.getDate()}</span>

                <div style={styles.dotContainer}>
                  {mealsForDay.map((meal: any) => {
                    const score = getMealScore(meal, user)

                    return (
                      <div
                        key={meal.id}
                        style={{
                          ...styles.calendarDot,
                          backgroundColor: getDotColor(score),
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🍽️ SELECTED DAY */}
      {selectedDate && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{selectedDate}</h2>

          {(mealsByDate[selectedDate] || []).length > 0 ? (
            (mealsByDate[selectedDate] || []).map((meal: any) => {
              const score = getMealScore(meal, user)

              return (
                <div key={meal.id} style={styles.mealCardNew}>

                  {meal.image_url && (
                    <img src={meal.image_url} style={styles.mealImageNew} />
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={styles.mealTopRow}>
                      <p style={styles.mealTitle}>{meal.food_title}</p>

                      <span style={getScoreStyle(score)}>
                        {score}/10
                      </span>
                    </div>

                    <p style={styles.mealDesc}>
                      {meal.food_description}
                    </p>

                    <p style={styles.mealTime}>
                      {new Date(meal.created_at).toLocaleTimeString()}
                    </p>

                    <div style={styles.macroRow}>
                      <span>{meal.calories} kcal</span>
                      <span>{meal.protein}g protein</span>
                      <span>{meal.carbs}g carbs</span>
                      <span>{meal.fat}g fat</span>
                    </div>
                  </div>

                </div>
              )
            })
          ) : (
            <div style={styles.emptyState}>
              No meals logged for this day
            </div>
          )}
        </div>
      )}

    </div>
  )
}

const styles: any = {
  title: {
    fontSize: 28,
    marginBottom: 20,
  },

  section: {
    marginBottom: 30,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },

  statCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #eee',
  },

  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 10,
  },

  day: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    cursor: 'pointer',
    border: '1px solid #eee',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
  },

  dotContainer: {
    display: 'flex',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },

  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },

  mealCard: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #eee',
    marginBottom: 8,
  },

  headerBlock: {
  marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 600,
  },

  subtext: {
    fontSize: 13,
    color: '#777',
  },

  mainStat: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #eee',
  },

  caloriesBig: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 10,
  },

  macroRow: {
    display: 'flex',
    gap: 15,
    color: '#555',
  },

  calendarGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 8,
  },

  dayBox: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },

  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: 600,
  },

  navBtn: {
    border: 'none',
    background: '#eee',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  dateRange: {
    fontSize: 13,
    color: '#999',
    marginBottom: 0,
  },

  mealCardNew: {
    display: 'flex',
    gap: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #eee',
    marginBottom: 12,
  },

  mealImageNew: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 10,
  },

  mealTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mealTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },

  statusRow: {
    marginTop: 10,
    display: 'flex',
    gap: 12,
  },

  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  calorieRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },

  bigCalories: {
    fontSize: 28,
    fontWeight: 700,
  },

  macros: {
    fontSize: 14,
    color: '#666',
  },

  insightBox: {
    textAlign: 'right',
    maxWidth: 250,
    minWidth: 280,
  },

  macroStatus: {
    fontWeight: 600,
    marginBottom: 6,
  },

  insightText: {
    fontSize: 13,
    color: '#777',
    whiteSpace: 'nowrap',
  },

  statusBadge: {
    padding: '6px 12px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
  },

  macrosRow: {
    display: 'flex',
    gap: 16,
    marginTop: 10,
  },

  macroItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    lineHeight: '20px', // 👈 ADD THIS
  },

  insightTitle: {
    fontWeight: 600,
    marginBottom: 6,
  },
}