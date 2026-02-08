<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useExpenses } from '../composables/useExpenses.js'
import { format, parseISO } from 'date-fns'

const { subscribe, cleanup, groupedExpenses, deleteExpense } = useExpenses()

onMounted(() => subscribe())
onUnmounted(() => cleanup())

const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'EEEE, MMM dd')
  } catch (e) {
    return dateStr
  }
}

const confirmDelete = async (id) => {
  if (confirm('Are you sure you want to delete this entry?')) {
    try {
      await deleteExpense(id)
    } catch (err) {
      alert('Delete failed')
    }
  }
}
</script>

<template>
  <div class="list-view">
    <header class="page-header">
      <h1 class="page-title">History</h1>
      <p class="page-subtitle">All your tracked expenses</p>
    </header>

    <div v-if="groupedExpenses.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>No expenses found this month.</p>
    </div>

    <div v-else class="groups-container">
      <div v-for="group in groupedExpenses" :key="group.date" class="date-group">
        <h2 class="group-date">{{ formatDate(group.date) }}</h2>
        
        <div class="entries-list">
          <div v-for="entry in group.items" :key="entry.id" class="expense-entry">
            <div class="entry-main">
              <div class="entry-items">
                {{ entry.items.map(i => i.name).join(', ') }}
              </div>
              <div class="entry-total">
                {{ entry.total.toLocaleString() }}
              </div>
            </div>
            
            <button class="delete-btn" @click="confirmDelete(entry.id)" title="Delete Entry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  padding: 24px 16px 140px;
  max-width: 480px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.date-group {
  margin-bottom: 24px;
}

.group-date {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.expense-entry {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.entry-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.entry-items {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entry-total {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--danger);
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: var(--danger);
  color: #fff;
}
</style>
