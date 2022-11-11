<template>
  <aside
    class="fixed top-0 z-10 w-1/3 h-full p-8 overflow-auto text-left bg-white drop-shadow-md"
    :class="isOpen ? 'drawer--open' : 'drawer--closed'"
  >
    <span
      class="absolute cursor-pointer top-3 right-3 hover:fill-slate-500"
      @click="emit('toggle:drawer')"
      v-html="icons.close"
    />
    <div class="flex justify-between mb-4 align-middle">
      <h2 class="text-lg font-bold">
        {{ formattedPeriod }}
      </h2>
      <button class="text-sm cursor-pointer text-slate-500">
        See all
      </button>
    </div>

    <div class="flex mb-5">
      <FilterItem
        v-for="(filterItem, index) in filters"
        :key="index"
        :name="filterItem"
        :active="filterBy === filterItem"
        @click="toggleFilter(filterItem)"
      />
    </div>

    <div>
      <template v-if="filteredItems.length">
        <TimelineItem
          v-for="(item, index) in filteredItems"
          :key="index"
          :item="item"
          :active-filter="filterBy"
        />
      </template>
      <template v-else>
        <p class="text-sm text-slate-500">
          No matching results or alerts found.
        </p>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import icons from '../assets/icons.json'
import { events, results } from '../fixtures/moreData.js'
import TimelineItem from './TimelineItem.vue'
import FilterItem from './FilterItem.vue'
import moment from 'moment'

const props = defineProps({
  isOpen: Boolean,
  selectedPeriod: Object,
})

const emit = defineEmits(['toggle:drawer'])

watch(() => props.isOpen, () => {
  filterBy.value = ''
})

const filters = ref(['Results', 'Alerts', 'Failures'])
const filterBy = ref('')

function toggleFilter (item) {
  filterBy.value === item ? filterBy.value = '' : filterBy.value = item
}

function getCreatedAt (item) {
  return item.payload ? item.payload.created_at : item.created_at
}

const formattedPeriod = computed(() => {
  const startTime = moment(props.selectedPeriod.min).format('MMM DD HH:mm:ss')
  const endTime = moment(props.selectedPeriod.max).format('MMM DD HH:mm:ss')

  return `${startTime} - ${endTime}`
})

function hasAlert (item) {
  return item.event
}

function isFailure (item) {
  if (hasAlert(item)) {
    return item.event.payload.alertType === 'ALERT_FAILURE'
  }
  return item.hasErrors || item.hasFailures
}

const sortedItems = computed(() => {
  const resultsWithAlerts = [...results]

  for (const event of events) {
    const result = resultsWithAlerts.find(result => event.payload.resultId === result.id)
    result.event = event
  }

  return resultsWithAlerts
})

const selectedItems = computed(() => {
  return sortedItems.value.filter(item => {
    const date = new Date(getCreatedAt(item)).getTime()
    return date >= props.selectedPeriod.min && date <= props.selectedPeriod.max
  })
})

const filteredItems = computed(() => {
  if (filterBy.value.length) {
    return selectedItems.value.filter(item => {
      if (filterBy.value === 'Failures') return isFailure(item)

      if (filterBy.value === 'Alerts') return hasAlert(item)

      if (filterBy.value === 'Results') return item

      return false
    })
  }
  return selectedItems.value
})
</script>

<style>
.drawer--open {
  right: 0;
  transition: right 900ms;
}
.drawer--closed {
  right: -100%;
  transition: right 700ms;
}
</style>
