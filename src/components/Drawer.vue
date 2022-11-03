<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 overflow-scroll text-left bg-white drop-shadow-md"
    :class="isOpen ? 'drawer--open' : 'drawer--closed'"
  >
    <span
      class="absolute cursor-pointer top-3 right-3 hover:fill-slate-500"
      @click="closeDrawer"
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
import { alerts, results } from '../fixtures/data.js'
import TimelineItem from './TimelineItem.vue'
import FilterItem from './FilterItem.vue'
import moment from 'moment'

const props = defineProps({
  isOpen: Boolean,
  selectedPeriod: Object,
})

const emit = defineEmits(['close:drawer'])

const filters = ref({
  results: {
    name: 'Run results',
    active: true,
  },
  alerts: {
    name: 'Alerts',
    active: true,
  },
})

function getCreatedAt (item) {
  return item.payload ? item.payload.created_at : item.created_at
}

function compare (a, b) {
  if (getCreatedAt(a) > getCreatedAt(b)) {
    return -1
  }
  if (getCreatedAt(a) < getCreatedAt(b)) {
    return 1
  }
  return 0
}

function isAlert (item) {
  return item.eventType
}

function closeDrawer () {
  emit('close:drawer')
}

const formattedPeriod = computed(() => {
  return moment.utc(props.selectedPeriod.x).format('MMM DD HH:mm:ss')
})

const sortedItems = computed(() => {
  const items = [...alerts, ...results]
  return items.sort((a, b) => compare(a, b))
})

const filteredItems = computed(() => {
  return sortedItems.value.filter(item =>
    (isAlert(item) && filters.value.alerts.active) || (!isAlert(item) && filters.value.results.active),
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
