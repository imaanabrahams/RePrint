<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/NavbarComp.vue'
import Footer from './components/FooterComp.vue'
import { useProductsStore } from './stores/productsStores.js'

const route = useRoute()

const isStaffArea = computed(() => route.path.startsWith('/staff'))

onMounted(() => {
  useProductsStore().load()
})
</script>

<template>
  <Navbar v-if="!isStaffArea" />
  <main class="app-main">
    <RouterView />
  </main>
  <Footer v-if="!isStaffArea" />
</template>

<style scoped>
.app-main {
  min-height: 70vh;
}
</style>
