import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  function addToCart(product, quantity = 1) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...product, quantity })
    }
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      item.quantity = quantity
    }
  }

  function removeFromCart(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, count, subtotal, addToCart, updateQuantity, removeFromCart, clear }
})
