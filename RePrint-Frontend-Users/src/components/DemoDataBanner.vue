<script setup>
import { apiStatus } from '../apiStatus.js'
</script>

<template>
  <div v-if="apiStatus.usingMockData" class="demo-data-banner">
    ⚠ Showing placeholder demo data — one or more API requests failed.
  </div>
</template>

<style scoped>
.demo-data-banner {
  background: #fef3c7;
  color: #92400e;
  text-align: center;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>