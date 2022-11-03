
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
    <ResponseRunChartPrototype
      :is-drawer-open="isDrawerOpen"
      @open:drawer="setPeriod($event)"
      @close:drawer="toggleDrawerState"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RunResultsColumnsChart from './components/RunResultsColumnsChart.vue'
import ResponseRunChartPrototype from './components/ResponseRunChartPrototype.vue'
import Drawer from './components/Drawer.vue'

const isDrawerOpen = ref(false)
const selectedPeriod = ref({})

function setPeriod (points) {
  selectedPeriod.value = points
  if (!isDrawerOpen.value) isDrawerOpen.value = true
}

function toggleDrawerState () {
  document.querySelector('.check-details-button').innerText = `${isDrawerOpen.value ? 'Show' : 'Hide'} details`
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>
