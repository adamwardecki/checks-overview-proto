<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 overflow-scroll text-left bg-white drop-shadow-md"
    :class="isOpen ? 'drawer--open' : 'drawer--closed'"
  >
    <span v-html="icons.close" class="absolute cursor-pointer top-3 right-3 hover:fill-slate-500" @click="toggleDrawer" />
    <div class="flex justify-between mb-4 align-middle">
      <h2 class="text-lg font-bold">XX:XX - XX:XX</h2>
      <button class="text-sm cursor-pointer text-slate-500">See all</button>
    </div>

    <div class="flex mb-6">
      <FilterItem
        v-for="(filterItem, index) in filters"
        :name="filterItem.name"
        :key="index"
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

<script>
import icons from '../assets/icons.json'
import { alerts, results } from '../fixtures/data.js';
import TimelineItem from './TimelineItem.vue'
import FilterItem from './FilterItem.vue'

export default {
  name: 'Drawer',
  props: {
    timeRange: String,
    checkRunResults: Array,
  },
  components: { TimelineItem, FilterItem },
  data: () => ({
    icons,
    isOpen: false,
    filters: {
      results: {
        name: "Run results",
        active: true,
      },
      alerts: {
        name: "Alerts",
        active: true,
      },
    }
  }),
  methods: {
    getCreatedAt(item) {
      return item.payload ? item.payload.created_at : item.created_at
    },
    compare(a, b) {
      if (this.getCreatedAt(a) > this.getCreatedAt(b) ) {
        return -1
      }
      if (this.getCreatedAt(a) < this.getCreatedAt(b)) {
        return 1
      }
      return 0
    },
    isAlert (item) {
      return item.eventType
    },
    toggleDrawer () {
      this.isOpen = !this.isOpen
    }
  },
  computed: {
    sortedItems () {
      const items = [...alerts, ...results]
      return items.sort((a, b) => this.compare(a,b))
    },
    filteredItems () {
      return [...this.sortedItems].filter(item =>
        this.isAlert(item) && this.filters.alerts.active || !this.isAlert(item) && this.filters.results.active
      )
    }
  },
}
</script>

<style>
.drawer--open {
  right: 0;
  transition: right 800ms;
}
.drawer--closed {
  right: -100%;
  transition: right 600ms;
}
</style>
