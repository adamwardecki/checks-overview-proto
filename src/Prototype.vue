
<template>
  <Drawer
    :is-open="isDrawerOpen"
    :selected-period="selectedPeriod"
    @toggle:drawer="toggleDrawer"
  />
  <div class="px-8">
    <div class="py-10">
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
    </div>
    <ResponseRunChartPrototype
      :is-drawer-open="isDrawerOpen"
      @toggle:drawer="toggleDrawer"
      @set:period="selectedPeriod = $event"
    />

    <RunResultsColumnsChart />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RunResultsColumnsChart from './components/RunResultsColumnsChart.vue'
import ResponseRunChartPrototype from './components/ResponseRunChartPrototype.vue'
import Drawer from './components/Drawer.vue'

const isDrawerOpen = ref(false)
const selectedPeriod = ref({})

function toggleDrawer () {
  document.querySelector('.check-details-button').innerText = `${isDrawerOpen.value ? 'Show' : 'Hide'} details`
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>
