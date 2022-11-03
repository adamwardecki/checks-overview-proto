<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Runs Duration
      </h3>
      <p>
        Shows the duration of the runs.
      </p>
    </div>
    <highcharts
      constructor-type="stockChart"
      :options="prototypeOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import prototypeResponseChartOptions from '../fixtures/prototypeResponseChartOptions.js'

const prototypeOptions = computed(() => ({
  ...prototypeResponseChartOptions,
}))
</script>
