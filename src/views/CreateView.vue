<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExpenses } from '../composables/useExpenses.js'
import { format } from 'date-fns'

const router = useRouter()
const { saveExpense } = useExpenses()

const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
const itemsText = ref('')
const step = ref(1) // 1 = input items, 2 = input prices
const items = ref([])
const saving = ref(false)
const priceInputs = ref([])

function parseItems() {
  const names = itemsText.value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  if (names.length === 0) return

  items.value = names.map((name) => ({
    name,
    price: ''
  }))

  step.value = 2

  nextTick(() => {
    focusInput(0)
  })
}

function focusInput(index) {
  const inputs = document.querySelectorAll('.price-input')
  if (inputs[index]) {
    inputs[index].focus()
  }
}

function handlePriceKeydown(e, index) {
  if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    if (index < items.value.length - 1) {
      focusInput(index + 1)
    }
  }
}

const canSave = computed(() => {
  return items.value.every(
    (item) => item.price !== '' && Number(item.price) > 0
  )
})

async function handleSave() {
  if (!canSave.value || saving.value) return

  saving.value = true

  try {
    await saveExpense(selectedDate.value, items.value)
    // Reset
    step.value = 1
    itemsText.value = ''
    items.value = []
    router.push('/')
  } catch (err) {
    console.error('Save error:', err)
    alert('Failed to save. Check console for details.')
  } finally {
    saving.value = false
  }
}

function goBack() {
  step.value = 1
}

function formatInput(value) {
  if (value === '' || value === null || value === undefined) return ''
  return Number(value).toLocaleString()
}

function updatePrice(event, index) {
  const rawValue = event.target.value.replace(/[^0-9.]/g, '')
  items.value[index].price = rawValue === '' ? '' : parseFloat(rawValue)
}
</script>

<template>
  <div class="create-view">
    <!-- Sticky Date Header -->
    <header class="sticky-header">
      <div class="header-content">
        <div class="header-left">
          <button v-if="step === 2" class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 class="page-title">
            {{ step === 1 ? 'New Expense' : 'Set Prices' }}
          </h1>
        </div>
        <div class="date-picker-wrapper">
          <input
            type="date"
            v-model="selectedDate"
            class="date-input"
          />
        </div>
      </div>
    </header>

    <!-- Step 1: Enter item names -->
    <div class="form-body" v-if="step === 1">
      <div class="input-group">
        <label class="input-label">Items</label>
        <p class="input-hint">Enter item names separated by commas</p>
        <textarea
          v-model="itemsText"
          class="items-textarea"
          placeholder="e.g. Coffee, Lunch, Taxi"
          rows="5"
          @keydown.enter.ctrl="parseItems"
        ></textarea>
      </div>

      <button
        class="btn-primary next-btn"
        @click="parseItems"
        :disabled="itemsText.trim().length === 0"
      >
        Next →
      </button>
    </div>

    <!-- Step 2: Enter prices -->
    <div class="form-body" v-else>
      <div class="items-list">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="item-row"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price-wrapper">
            <input
              type="text"
              :value="formatInput(item.price)"
              @input="updatePrice($event, index)"
              class="price-input"
              placeholder="0"
              inputmode="decimal"
              @keydown="handlePriceKeydown($event, index)"
            />
          </div>
        </div>
      </div>

      <!-- Sticky Save Footer -->
      <div class="sticky-footer">
        <div class="total-preview" v-if="canSave">
          Total: <strong>{{ items.reduce((s, i) => s + Number(i.price), 0).toLocaleString() }}</strong>
        </div>
        <button
          class="btn-primary save-btn"
          :disabled="!canSave || saving"
          @click="handleSave"
        >
          <span v-if="saving" class="spinner"></span>
          <span v-else>Save Expense</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-view {
  padding-bottom: 80px;
  max-width: 480px;
  margin: 0 auto;
}

/* Sticky Header */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: calc(12px + var(--sat, 0px)) 16px 12px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.01em;
}

.back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0.95);
}

.date-picker-wrapper {
  flex-shrink: 0;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.date-input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
}

/* Form Body */
.form-body {
  padding: 20px 16px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.input-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 10px;
}

.items-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  background: var(--surface);
  color: var(--text-primary);
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.items-textarea:focus {
  border-color: var(--primary);
}

.items-textarea::placeholder {
  color: var(--text-tertiary);
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
  transition: border-color 0.2s;
}

.item-row:focus-within {
  border-color: var(--primary);
}

.item-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.item-price-wrapper {
  width: 120px;
  flex-shrink: 0;
}

.price-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  font-weight: 600;
  text-align: right;
  background: var(--bg);
  color: var(--text-primary);
  outline: none;
  box-sizing: border-box;
  appearance: none;
  -moz-appearance: textfield;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input:focus {
  border-color: var(--primary);
  background: var(--surface);
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease, opacity 0.2s ease, transform 0.1s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.next-btn {
  margin-top: 8px;
}

/* Sticky Footer */
.sticky-footer {
  position: fixed;
  bottom: calc(100px + var(--sab, 0px)); /* Above floating nav & safe area */
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 440px;
  z-index: 50;
  padding: 16px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.15);
}

.sticky-footer .btn-primary {
  width: 100%;
  display: block;
}

.total-preview {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.total-preview strong {
  color: var(--text-primary);
  font-weight: 700;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
