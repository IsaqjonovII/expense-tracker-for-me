<script setup>
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div class="app-shell">
    <router-view />
    <BottomNav />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  position: relative;
}
</style>
