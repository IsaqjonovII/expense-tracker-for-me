<script setup>
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
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
