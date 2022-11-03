<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Runs Duration P99
      </h3>
      <p>
        This chart show the 99th percentile of the duration of the runs in a given time period.
      </p>
    </div>
    <highcharts :options="defaultOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mergeResponseDates } from '../fixtures/helpers.js'
import { responseTime } from '../fixtures/moreData.js'

const defaultOptions = computed(() => ({
  title: '',
  chart: {
    marginTop: 34,
    zoomType: 'x',
  },
  yAxis: {
    opposite: false,
    title: '',
  },
  xAxis: {
    type: 'datetime',
    plotBands: [
      {
        color: 'rgba(255, 0, 0, 0.1)', // Color value
        from: new Date('2022-09-28T19:20:00.234Z').getTime(), // Start of the plot band
        to: new Date('2022-09-28T19:28:44.665Z').getTime(), // End of the plot band
      },
      {
        color: 'rgba(255, 0, 0, 0.1)', // Color value
        from: new Date('2022-09-28T12:59:18.478Z').getTime(), // Start of the plot band
        to: new Date('2022-09-28T13:08:42.767Z').getTime(), // End of the plot band
      }],
  },
  series: [
    {
      id: 'resp-time',
      name: 'Response Time',
      data: mergeResponseDates(responseTime.series[2].data, responseTime.categories),
      lineWidth: 1,
      color: '#333',
    },
  ],
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  navigator: {
    enabled: false,
  },
  plotOptions: {
    series: {
      marker: {
        radius: 3,
        lineColor: '#000',
        fillColor: '#fff',
        enabled: true,
        lineWidth: 1,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
    },
  },
}))
</script>
