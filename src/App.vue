
<template>
  <nav class="px-8 py-4 text-left h-14">
    <a href="#/">Playground</a> |
    <a href="#/prototype">Separate Charts</a> |
    <a href="#/single-chart">Single Chart</a> |
    <a href="#/single-chart-push-content">Single Chart Push Content</a>
  </nav>
  <component :is="currentView" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Playground from './Playground.vue'
import Prototype from './Prototype.vue'
import PrototypeSingleChart from './PrototypeSingleChart.vue'
import PrototypeSingleChartPushContent from './PrototypeSingleChartPushContent.vue'

const routes = {
  '/': Playground,
  '/prototype': Prototype,
  '/single-chart': PrototypeSingleChart,
  '/single-chart-push-content': PrototypeSingleChartPushContent,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>
