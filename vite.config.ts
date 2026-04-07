import { execSync } from 'child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getCommitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/coffee-chat-shuffler/',
  define: {
    __COMMIT_SHA__: JSON.stringify(getCommitSha()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
