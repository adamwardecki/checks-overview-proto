<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 overflow-auto text-left bg-white drop-shadow-md"
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
        :name="filterItem.name"
        :active="filterItem.active"
        @click="filterItem.active = !filterItem.active"
      />
    </div>

    <div>
      <TimelineItem
        v-for="(item, index) in filteredItems"
        :key="index"
        :item="item"
      />
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
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

const filters = ref({
  results: {
    name: 'Run results',
    active: false,
  },
  alerts: {
    name: 'Alerts',
    active: false,
  },
})

function getCreatedAt (item) {
  return item.payload ? item.payload.created_at : item.created_at
}

function compare (a, b) {
  if (getCreatedAt(a) > getCreatedAt(b)) {
    return -1
  } else if (getCreatedAt(a) < getCreatedAt(b)) {
    return 1
  }
  return 0
}

function isAlert (item) {
  return item.eventType
}

const formattedPeriod = computed(() => {
  const startTime = moment(props.selectedPeriod.min).format('MMM DD HH:mm:ss')
  const endTime = moment(props.selectedPeriod.max).format('MMM DD HH:mm:ss')

  return `${startTime} - ${endTime}`
})

const sortedItems = computed(() => {
  // sort array by date, order: newest => oldest
  return [...events, ...results].sort((a, b) => compare(a, b))
})

const selectedItems = computed(() => {
  return sortedItems.value.filter(item => {
    const date = new Date(getCreatedAt(item)).getTime()
    return date >= props.selectedPeriod.min && date <= props.selectedPeriod.max
  })
})

const filteredItems = computed(() => {
  if (!filters.value.results.active && !filters.value.alerts.active) {
    return selectedItems.value
  }
  return selectedItems.value.filter(item =>
    (filters.value.alerts.active && isAlert(item)) || (filters.value.results.active && !isAlert(item)),
  )
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
