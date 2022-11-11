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
        :is-drawer-open="isDrawerOpen"
        :timestamps="createdAtTimeStamps"
        :results="results"
        :events="events"
        @set:period="selectedPeriod = $event"
        @open:drawer="openDrawer"
        @toggle:drawer="toggleDrawer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { results, events, createdAtTimeStamps } from './fixtures/moreData'
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
  }
}

function escapeHandler (event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (isDrawerOpen.value) {
      toggleDrawer()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', escapeHandler)
})
</script>
