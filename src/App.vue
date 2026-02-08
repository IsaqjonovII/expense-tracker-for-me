<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()

onMounted(() => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp
    tg.ready()
    tg.expand()
    
    // Set colors to match our emerald theme
    tg.setHeaderColor('#0f172a') // var(--bg)
    tg.setBackgroundColor('#0f172a')
  }
})
</script>

<template>
  <router-view></router-view>
  <BottomNav v-if="route.name !== 'login'" />
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  position: relative;
}
</style>
