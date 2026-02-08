<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>Home</span>
    </router-link>
    <router-link to="/list" class="nav-item" :class="{ active: $route.path === '/list' }">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20v-6M6 20V10M18 20V4"/>
      </svg>
      <span>History</span>
    </router-link>
    <router-link to="/create" class="nav-item" :class="{ active: $route.path === '/create' }">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <span>Create</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: calc(24px + var(--sab, 0px));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 400px;
  display: flex;
  background: rgba(30, 30, 46, 0.8);
  border: 1px solid var(--border);
  border-radius: 24px;
  z-index: 100;
  padding: 8px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
}

.nav-item.active {
  color: #fff;
  background: var(--primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
}
</style>
