<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Spent',
      data: props.data,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    tooltip: {
      backgroundColor: '#1e1e2e',
      titleColor: '#fff',
      bodyColor: '#e0e0e0',
      cornerRadius: 8,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (ctx) => `${ctx.parsed.y.toLocaleString()}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#94a3b8',
        font: { size: 10, family: "'Inter', sans-serif" },
        maxRotation: 45,
        autoSkip: true,
        maxTicksLimit: 8
      },
      border: { display: false }
    },
    y: {
      grid: {
        color: 'rgba(148, 163, 184, 0.08)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: { size: 10, family: "'Inter', sans-serif" },
        callback: (val) => val.toLocaleString()
      },
      border: { display: false },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="chart-card">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.chart-wrapper {
  height: 200px;
  position: relative;
}
</style>
