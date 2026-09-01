<script setup>
import { onMounted } from 'vue'
import Navbar from './components/NavbarComp.vue'
import Footer from './components/FooterComp.vue'
import { useProductsStore } from './stores/productsStores.js'

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
