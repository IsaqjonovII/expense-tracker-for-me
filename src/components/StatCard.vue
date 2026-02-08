<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  icon: { type: String, default: '' }
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" v-if="icon">{{ icon }}</div>
    <div class="stat-content">
      <span class="stat-value">{{ Number(value).toLocaleString() }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 18px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
