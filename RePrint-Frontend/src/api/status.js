import { reactive } from 'vue'

// Shared, app-wide flag: true whenever any API call has silently
// fallen back to hardcoded placeholder data instead of a real response.
export const apiStatus = reactive({
  usingMockData: false,
  failedEndpoints: new Set(),
})

export function markMockFallback(endpoint, error = null) {
  // Auth failures (401/403) mean "not allowed", not "API is down" —
  // don't show the demo-data banner for those.
  if (error && (error.status === 401 || error.status === 403)) return
  apiStatus.usingMockData = true
  apiStatus.failedEndpoints.add(endpoint)
  const reason = error && error.message ? ` (${error.message})` : ''
  console.warn(`[RePrint] "${endpoint}" failed${reason} — showing placeholder demo data, not real data.`)
}

export function clearMockFallback() {
  apiStatus.usingMockData = false
  apiStatus.failedEndpoints.clear()
}