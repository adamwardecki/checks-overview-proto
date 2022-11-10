<template>
  <div class="flex flex-col border-b last:border-b-0 border-slate-300">
    <div
      class="flex items-center justify-between w-full p-2 font-semibold "
      :class="{
        'bg-[rgba(255,0,0,0.1)]': isFailure,
      }"
    >
      <div class="flex items-center w-3/4">
        <span
          class="mr-5"
          v-html="icon"
        />
        <p class="mr-5 truncate max-w-[80%] flex items-center">
          {{ getLocationName(item.runLocation) }}
          <img
            class="h-5 ml-2"
            :src="getLocationFlag(item.runLocation)"
          >
          <span class="mx-4 text-xs text-slate-400">
            {{ formatDuration(item.responseTime, { showUnit: true }) }}
          </span>
          <span v-html="icons['camera']" />
        </p>
      </div>
      {{ formatTimestamp(item.eventType ? item.payload.created_at : item.created_at) }}
    </div>

    <div
      v-if="hasAlert && !showOnlyResults"
      class="flex items-center justify-between w-full p-2 font-semibold border-t pl-11 last:border-b-0 border-slate-300"
      :class="{
        'bg-[rgba(255,0,0,0.1)]': isFailure,
      }"
    >
      <div class="flex items-center w-3/4">
        <span
          class="mr-5"
          v-html="alertIcon"
        />
        <p class="mr-5 truncate max-w-[80%] flex items-center">
          {{ alertDescription }}
        </p>
      </div>
      {{ formatTimestamp(item.eventType ? item.payload.created_at : item.created_at) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import moment from 'moment'
import icons from '../assets/icons.json'
import { getLocationName, getLocationFlag } from '../fixtures/locations'
import { formatDuration } from '../fixtures/helpers'

const props = defineProps({
  item: Object,
  activeFilters: Array,
})

function formatTimestamp (timestamp) {
  return moment(timestamp).format('HH:mm:ss')
}

const hasAlert = computed(() => props.item.event)

const showOnlyResults = computed(() => props.activeFilters.length === 1 && props.activeFilters.includes('Results'))

const isFailure = computed(() => {
  if (hasAlert.value) {
    return props.item.event.payload.alertType === 'ALERT_FAILURE'
  }
  return props.item.hasErrors || props.item.hasFailures
})

const icon = computed(() => isFailure.value ? icons['circle-failure'] : icons['circle-success'])
const alertIcon = computed(() => isFailure.value ? icons['alert-failure'] : icons['alert-success'])
const alertDescription = computed(() => {
  return props.item.event.payload.alertType === 'ALERT_FAILURE' ? 'Failure Alert' : 'Recovery Alert'
})
</script>
