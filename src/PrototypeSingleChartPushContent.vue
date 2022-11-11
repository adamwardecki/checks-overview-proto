<template>
  <div class="w-full overflow-hidden border-t">
    <div
      class="p-8"
      :class="isDrawerOpen ? 'w-[calc(100%-450px)] pr-4' : 'w-full'"
    >
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
      <div id="container w-full">
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
    <DrawerPushContent
      class="top-[calc(3.5rem+1px)]"
      :is-open="isDrawerOpen"
      :selected-period="selectedPeriod"
      @toggle:drawer="toggleDrawer"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { results, events, createdAtTimeStamps } from './fixtures/moreData'
import DrawerPushContent from './components/DrawerPushContent.vue'
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
