<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 overflow-scroll text-left bg-white drop-shadow-md"
    :class="open ? 'drawer--open' : 'drawer--closed'"
  >
    <div class="flex justify-between mb-6 align-middle">
      <h2 class="text-lg font-bold">XX:XX - XX:XX</h2>
      <p class="text-sm cursor-pointer text-slate-500">See all</p>
    </div>
      <TimelineItem
        v-for="(item, index) in sortedItem"
        :key="index"
        :item="item"
      />
  </aside>
</template>

<script>
import { alerts, results } from '../fixtures/data.js';
import TimelineItem from './TimelineItem.vue'

export default {
  name: 'Drawer',
  props: {
    open: Boolean,
    timeRange: String,
    checkRunResults: Array,
  },
  components: { TimelineItem },
  data: () => ({ results }),
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
    }
  },
  computed: {
    sortedItem() {
      const items = [...alerts, ...results]
      return items.sort((a, b) => this.compare(a,b))
    }
  },
};
</script>

<style>
.drawer--open {
  right: 0;
  transition: right 1s;
}
.drawer--closed {
  right: -100%;
  transition: right 800ms;
}
</style>
