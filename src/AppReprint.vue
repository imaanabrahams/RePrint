<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useProductsStore } from './stores/products'

onMounted(() => {
  useProductsStore().load()
})
</script>

<template>
  <Navbar />
  <main class="app-main">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
.app-main {
  min-height: 70vh;
}
</style>
