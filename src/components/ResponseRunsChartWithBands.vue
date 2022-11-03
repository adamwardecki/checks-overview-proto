<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Runs Duration & Amount
      </h3>
      <p>
        Top chart shows the duration of the runs.
        Bottom chart shows the amount of runs in a given time period.
        Plot bands show the time span between an alert being sent and check recovery.
      </p>
    </div>
    <highcharts
      constructor-type="stockChart"
      :options="defaultOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import defaultChartOptions from '../fixtures/defaultResponseChartOptions.js'

const defaultOptions = computed(() => ({
  ...defaultChartOptions,
  xAxis: {
    plotBands: [{
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-20T22:00:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T02:30:00Z').getTime(), // End of the plot band
    },
    {
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-21T05:45:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T06:15:00Z').getTime(), // End of the plot band
    },
    {
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-21T16:30:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T17:00:00Z').getTime(), // End of the plot band
    }],
  },
}))
</script>
