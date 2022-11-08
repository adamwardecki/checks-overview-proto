<template>
  <div
    class="flex items-center justify-between p-2 font-semibold border-b last:border-b-0 border-slate-300"
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
        <template v-if="isAlert">
          {{ alertDescription }}
        </template>
        <template v-else>
          {{ getLocationName(item.runLocation) }}
          <img
            class="h-5 ml-2"
            :src="getLocationFlag(item.runLocation)"
          >
          <span class="mx-4 text-xs text-slate-400">
            {{ formatDuration(item.responseTime, { showUnit: true }) }}
          </span>
          <span v-html="icons['camera']" />
        </template>
      </p>
    </div>
    {{ formatTimestamp(item.eventType ? item.payload.created_at : item.created_at) }}
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
})

function formatTimestamp (timestamp) {
  return moment(timestamp).format('HH:mm:ss')
}

const isAlert = computed(() => props.item.eventType)

const isFailure = computed(() => {
  if (isAlert.value) {
    return props.item.payload.alertType === 'ALERT_FAILURE'
  }
  return props.item.hasErrors || props.item.hasFailures
})

const icon = computed(() => isFailure.value ? icons['circle-failure'] : icons['circle-success'])

const alertDescription = computed(() => {
  return props.item.payload.alertType === 'ALERT_FAILURE' ? 'Failure Alert' : 'Recovery Alert'
})
</script>
