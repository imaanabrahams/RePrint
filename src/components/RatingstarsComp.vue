<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: { type: Number, default: 5 },
  size: { type: Number, default: 16 },
})

const stars = computed(() => {
  const result = []
  for (let i = 1; i <= 5; i++) {
    result.push(i <= Math.round(props.rating))
  }
  return result
})
</script>

<template>
  <div class="rating" :style="{ gap: `${size * 0.2}px` }" :aria-label="`${rating} out of 5 stars`">
    <svg
      v-for="(filled, i) in stars"
      :key="i"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :fill="filled ? '#995E62' : 'rgba(143,131,137,0.25)'"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
}
</style>
