import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])

  const count = computed(() => items.value.length)
  const isWished = (id) => items.value.some((p) => p.id === id)

  function toggle(product) {
    const idx = items.value.findIndex((p) => p.id === product.id)
    if (idx === -1) {
      items.value.push(product)
    } else {
      items.value.splice(idx, 1)
    }
  }

  function add(product) {
    if (!isWished(product.id)) {
      items.value.push(product)
    }
  }

  function remove(id) {
    items.value = items.value.filter((p) => p.id !== id)
  }

  return { items, count, isWished, toggle, add, remove }
})
