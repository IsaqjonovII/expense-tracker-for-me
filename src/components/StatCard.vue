<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" v-if="icon">{{ icon }}</div>
    <div class="stat-content">
      <div v-if="loading" class="skeleton" style="width: 100px; height: 32px; margin-bottom: 4px;"></div>
      <span v-else class="stat-value">{{ Number(value).toLocaleString() }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--surface);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08); /* More subtle border */
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, rgba(30, 30, 46, 1) 0%, rgba(40, 40, 60, 1) 100%);
}

.stat-icon {
  font-size: 24px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  flex-shrink: 0;
  color: var(--primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.8;
}
</style>
