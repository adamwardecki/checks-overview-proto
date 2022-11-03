
<template>
  <Drawer
    :is-open="isDrawerOpen"
    :selected-period="selectedPeriod"
    @close:drawer="toggleDrawerState"
  />
  <div class="px-8">
    <div class="py-10">
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
    </div>
    <RunResultsColumnsChart />
    <ResponseRunChartPrototype @select:period="setPeriod($event)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RunResultsColumnsChart from './components/RunResultsColumnsChart.vue'
import ResponseRunChartPrototype from './components/ResponseRunChartPrototype.vue'
import Drawer from './components/Drawer.vue'

const isDrawerOpen = ref(false)
const selectedPeriod = ref({})

function setPeriod (point) {
  selectedPeriod.value = point
  if (!isDrawerOpen.value) isDrawerOpen.value = true
}

function toggleDrawerState () {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>
