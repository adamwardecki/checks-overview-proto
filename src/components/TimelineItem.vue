<template>
  <div class="flex justify-between p-2 font-semibold border-b last:border-b-0 border-slate-300">
    <p class="flex items-center"><span v-html="icon" class="mr-5"/>{{ name }}</p>
    {{ formatTimestamp(item.eventType ? item.payload.created_at : item.created_at) }}
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
    isAlert () {
      return this.item.eventType
    },
    icon () {
      if (this.isAlert) {
        return this.item.payload.alertType === 'ALERT_FAILURE' ? icons['circle-failure'] : icons['circle-success']
      }
      return this.item.hasErrors || this.item.hasFailures ? icons['circle-failure'] : icons['circle-success']
    },
    name () {
      if (this.isAlert) {
        return this.item.payload.alertType === 'ALERT_FAILURE' ? 'Failure Alert' : 'Recovery Alert'
      }
      return this.item.name
    }
  }
};
</script>
