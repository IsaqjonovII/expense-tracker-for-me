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
  chartData30,
  isLoading
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
    <header class="sticky-header">
      <div class="header-content">
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
      </div>
    </header>

    <div class="view-content">
      <section class="stats-grid">
        <StatCard
          label="Spent Today"
          :value="totalToday"
          icon="📅"
          :loading="isLoading"
        />
        <StatCard
          label="This Month"
          :value="totalMonth"
          icon="💰"
          :loading="isLoading"
        />
        <StatCard
          label="Daily Average"
          :value="avgPerDay"
          icon="📊"
          :loading="isLoading"
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

        <div v-if="isLoading" class="skeleton" style="height: 250px; border-radius: 20px;"></div>
        
        <template v-else>
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
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100%;
 width: 100%; 
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: calc(16px + var(--sat, 20px)) 16px 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-content {
 width: 100%; 
  padding: 24px 16px calc(120px + var(--sab, 0px));
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.page-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 2px 0 0;
  text-transform: capitalize;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 38px;
  height: 38px;
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
