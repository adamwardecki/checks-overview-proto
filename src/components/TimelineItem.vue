<template>
  <div class="flex justify-between p-2 font-semibold border-b-2 border-slate-300">
    <p class="flex items-center"><span v-html="icon" class="mr-5"/>{{ item.name }}</p>
    {{ formatTimestamp(item.created_at) }}
  </div>
</template>

<script>
import moment from 'moment'
import icons from '../assets/icons.json'

export default {
  name: 'TimelineItem',
  props: {
    item: Object,
  },
  methods: {
    formatTimestamp(timestamp) {
      return moment(timestamp).format('MMM DD HH:mm:ss')
    }
  },
  computed: {
    icon () {
      return this.item.hasErrors || this.item.hasFailures ? icons['circle-failure'] : icons['circle-success']

    }
  }
};
</script>
