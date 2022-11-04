<template>
  <div class="flex items-center justify-between p-2 font-semibold border-b last:border-b-0 border-slate-300">
    <div class="flex items-center w-3/4">
      <span
        class="mr-5"
        v-html="icon"
      />
      <p class="mr-5 truncate max-w-[80%]">
        {{ name }}
      </p>
    </div>
    {{ formatTimestamp(item.eventType ? item.payload.created_at : item.created_at) }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import moment from 'moment'
import icons from '../assets/icons.json'

const props = defineProps({
  item: Object,
})

function formatTimestamp (timestamp) {
  return moment(timestamp).format('HH:mm:ss')
}

const isAlert = computed(() => {
  return props.item.eventType
})

const icon = computed(() => {
  if (isAlert.value) {
    return props.item.payload.alertType === 'ALERT_FAILURE' ? icons['circle-failure'] : icons['circle-success']
  }
  return props.item.hasErrors || props.item.hasFailures ? icons['circle-failure'] : icons['circle-success']
})

const name = computed(() => {
  if (isAlert.value) {
    return props.item.payload.alertType === 'ALERT_FAILURE' ? 'Failure Alert' : 'Recovery Alert'
  }
  return props.item.name
})
</script>
