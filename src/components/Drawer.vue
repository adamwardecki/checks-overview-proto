<template>
  <aside
    class="fixed top-0 z-50 w-1/3 h-full p-8 overflow-scroll text-left bg-white drop-shadow-md"
    :class="open ? 'drawer--open' : 'drawer--closed'"
  >
    <div class="flex justify-between align-middle">
      <h2 class="text-lg font-bold">XX:XX - XX:XX</h2>
      <p class="text-sm cursor-pointer text-slate-500">See all</p>
    </div>
      <TimelineItem
        v-for="(result, index) in results"
        :key="index"
        :item="result"
      />
  </aside>
</template>

<script>
import { results } from '../fixtures/data.js';
import TimelineItem from './TimelineItem.vue'

export default {
  name: 'Drawer',
  props: {
    open: Boolean,
    timeRange: String,
    checkRunResults: Array,
  },
  components: { TimelineItem },
  data: () => ({ results })
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
