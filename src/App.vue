
<template>
  <nav class="pb-8">
    <a href="#/">Playground</a> |
    <a href="#/prototype">Prototype</a>
  </nav>
  <component :is="currentView" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Playground from './Playground.vue'
import Prototype from './Prototype.vue'

const routes = {
  '/': Playground,
  '/prototype': Prototype
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>