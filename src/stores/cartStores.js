import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  function addToCart(product, quantity = 1, option = '') {
    const key = option || 'default'
    const existing = items.value.find((i) => i.id === product.id && i.option === key)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...product, option: key, quantity })
    }
  }

  function updateQuantity(id, quantity, option = '') {
    const key = option || 'default'
    const item = items.value.find((i) => i.id === id && i.option === key)
    if (!item) return
    if (quantity <= 0) {
      removeFromCart(id, option)
    } else {
      item.quantity = quantity
    }
  }

  function removeFromCart(id, option = '') {
    const key = option || 'default'
    items.value = items.value.filter((i) => !(i.id === id && i.option === key))
  }

  function clear() {
    items.value = []
  }

  return { items, count, subtotal, addToCart, updateQuantity, removeFromCart, clear }
})
