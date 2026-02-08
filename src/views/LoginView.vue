<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser.js'

const username = ref('')
const router = useRouter()
const { login } = useUser()

function handleLogin() {
  if (username.value.trim()) {
    login(username.value)
    router.push('/')
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-card">
      <div class="icon-wrapper">
        <span class="app-icon">💰</span>
      </div>
      <h1 class="app-title">Expense Tracker</h1>
      <p class="app-subtitle">Simple. Fast. Yours.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <label class="input-label">Who are you?</label>
        <input
          v-model="username"
          type="text"
          class="username-input"
          placeholder="Enter your name (e.g. Ilxom)"
          required
          autofocus
        />
        <button type="submit" class="btn-primary">
          Start Tracking
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg);
}

.login-card {
  width: 100%;
  max-width: 360px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.app-icon {
  font-size: 32px;
}

.app-title {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.app-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}

.login-form {
  text-align: left;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.username-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  background: var(--bg);
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.username-input:focus {
  border-color: var(--primary);
  background: var(--surface);
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(1px);
}
</style>
