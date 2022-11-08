
<template>
  <nav class="px-8 pt-4 text-left">
    <a href="#/">Playground</a> |
    <a href="#/prototype">Separate Charts</a> |
    <a href="#/single-chart">Single Chart</a>
  </nav>
  <component :is="currentView" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Playground from './Playground.vue'
import Prototype from './Prototype.vue'
import PrototypeSingleChart from './PrototypeSingleChart.vue'

const routes = {
  '/': Playground,
  '/prototype': Prototype,
  '/single-chart': PrototypeSingleChart,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>
