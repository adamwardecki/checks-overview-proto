<template>
  <Drawer
    :is-open="isDrawerOpen"
    :selected-period="selectedPeriod"
    @toggle:drawer="toggleDrawer"
  />
  <div class="px-8">
    <div class="py-4">
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
    </div>
    <div id="container">
      <ResponseRunsChartWithDrawer
        :results="results"
        @set:period="selectedPeriod = $event"
        @open:drawer="openDrawer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { results } from './fixtures/moreData'
import Drawer from './components/Drawer.vue'
import ResponseRunsChartWithDrawer from './components/ResponseRunsChartWithDrawer.vue'

const isDrawerOpen = ref(false)
const selectedPeriod = ref({})

function toggleDrawer () {
  document.querySelector('.check-details-button').innerText = `${isDrawerOpen.value ? 'Show' : 'Hide'} details`
  isDrawerOpen.value = !isDrawerOpen.value
}

function openDrawer () {
  if (!isDrawerOpen.value) {
    isDrawerOpen.value = true
    document.querySelector('.check-details-button').innerText = 'Hide details'
  }
}
</script>
