<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenses } from '../composables/useExpenses.js'
import { useUser } from '../composables/useUser.js'
import StatCard from '../components/StatCard.vue'
import ExpenseChart from '../components/ExpenseChart.vue'

const {
  subscribe,
  cleanup,
  totalToday,
  totalMonth,
  avgPerDay,
  chartData7,
  chartData30
} = useExpenses()

const chartView = ref('7')

const { currentUser, logout } = useUser()
const router = useRouter()

onMounted(() => subscribe())

onUnmounted(() => cleanup())

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-view">
    <header class="dashboard-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">{{ currentUser }}'s spending overview</p>
      </div>
      <button class="logout-btn" @click="handleLogout" title="Logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </header>

    <section class="stats-grid">
      <StatCard
        label="Spent Today"
        :value="totalToday"
        icon="📅"
      />
      <StatCard
        label="This Month"
        :value="totalMonth"
        icon="💰"
      />
      <StatCard
        label="Daily Average"
        :value="avgPerDay"
        icon="📊"
      />
    </section>

    <section class="chart-section">
      <div class="chart-toggle">
        <button
          :class="{ active: chartView === '7' }"
          @click="chartView = '7'"
        >
          7 Days
        </button>
        <button
          :class="{ active: chartView === '30' }"
          @click="chartView = '30'"
        >
          30 Days
        </button>
      </div>

      <ExpenseChart
        v-if="chartView === '7'"
        :labels="chartData7.labels"
        :data="chartData7.data"
        title="Last 7 Days"
      />
      <ExpenseChart
        v-else
        :labels="chartData30.labels"
        :data="chartData30.data"
        title="Last 30 Days"
      />
    </section>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px 16px 100px;
  max-width: 480px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0;
  text-transform: capitalize;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-toggle {
  display: flex;
  gap: 8px;
  background: var(--bg);
  border-radius: 10px;
  padding: 4px;
  border: 1px solid var(--border);
}

.chart-toggle button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.chart-toggle button.active {
  background: var(--surface);
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
</style>
