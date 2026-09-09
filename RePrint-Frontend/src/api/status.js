import { reactive } from 'vue'

// Shared, app-wide flag: true whenever any API call has silently
// fallen back to hardcoded placeholder data instead of a real response.
export const apiStatus = reactive({
  usingMockData: false,
  failedEndpoints: new Set(),
})

export function markMockFallback(endpoint) {
  apiStatus.usingMockData = true
  apiStatus.failedEndpoints.add(endpoint)
  console.warn(`[RePrint] "${endpoint}" failed — showing placeholder demo data, not real data.`)
}