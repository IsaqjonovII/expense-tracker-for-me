<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenses } from '../composables/useExpenses.js'
import { format, parseISO } from 'date-fns'

const router = useRouter()
const { subscribe, cleanup, groupedExpenses, deleteExpense, isLoading } = useExpenses()

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

    <div v-if="isLoading">
      <div v-for="i in 3" :key="i" class="date-group">
        <div class="skeleton" style="width: 100px; height: 16px; margin-bottom: 12px;"></div>
        <div class="entries-list">
          <div v-for="j in 2" :key="j" class="expense-entry skeleton" style="height: 64px;"></div>
        </div>
      </div>
    </div>

    <div v-else-if="groupedExpenses.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>No expenses found this month.</p>
    </div>

    <div v-else class="groups-container">
      <div v-for="group in groupedExpenses" :key="group.date" class="date-group">
        <h2 class="group-date">{{ formatDate(group.date) }}</h2>
        
        <div class="entries-list">
          <div v-for="entry in group.items" :key="entry.id" class="expense-entry-wrapper">
            <div class="expense-entry" @click="router.push(`/edit/${entry.id}`)">
              <div class="entry-main">
                <div v-for="(item, idx) in entry.items" :key="idx" class="detail-row">
                  <span class="detail-name">{{ item.name }}</span>
                  <span class="detail-price">{{ Number(item.price).toLocaleString() }}</span>
                </div>
                <div class="entry-footer">
                  <span class="total-label">Total</span>
                  <span class="entry-total">{{ entry.total.toLocaleString() }}</span>
                </div>
              </div>
              
              <button class="delete-btn" @click.stop="confirmDelete(entry.id)" title="Delete Entry">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  padding: 24px 16px 120px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 6px 0 0;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
  background: rgba(30, 30, 46, 0.4);
  border-radius: 24px;
  border: 1px dashed var(--border);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.date-group {
  margin-bottom: 32px;
}

.group-date {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
  padding-left: 4px;
  opacity: 0.9;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.expense-entry-wrapper {
  margin-bottom: 0;
}

.expense-entry {
  background: linear-gradient(145deg, rgba(30, 30, 46, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  position: relative;
  overflow: hidden;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.expense-entry:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: linear-gradient(145deg, rgba(36, 36, 56, 0.95) 0%, rgba(26, 26, 42, 1) 100%);
}

.expense-entry:active {
  transform: scale(0.99);
}

.entry-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08); /* Dashed border for better aesthetic */
}

.detail-row:last-of-type {
  border-bottom: none;
  padding-bottom: 0px; /* Reduced from previous padding */
}

.detail-name {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.4;
  padding-right: 12px;
}

.detail-price {
  font-weight: 600;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.entry-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--text-tertiary);
  letter-spacing: 0.1em;
}

.entry-total {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.delete-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--danger);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.delete-btn:hover {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  transform: scale(1.05);
}

.delete-btn:active {
  transform: scale(0.95);
}

/* Adjust top padding of first item to clear the delete button if needed, 
   or we can just let it overlap if the price is far enough left. 
   To be safe, let's create a clear zone for the button */
.detail-row:first-child {
  padding-right: 40px;
}
</style>
