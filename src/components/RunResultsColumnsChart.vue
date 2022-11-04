<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Run Results
      </h3>
      <p>
        Stacked column chart with run results segmented by success, failure, and
        degraded.
      </p>
    </div>
    <highcharts :options="defaultOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { results } from '../fixtures/moreData'
import moment from 'moment'

const resultTypes = {
  failure: [],
  degraded: [],
  success: [],
}

for (const result of results) {
  if (result.hasFailures) resultTypes.failure.push(result)
  if (result.isDegraded) resultTypes.degraded.push(result)
  if (!result.hasFailures && !result.isDegraded) resultTypes.success.push(result)
}

const groupedResults = (resultTypes) => Object.entries(resultTypes
  .map(({ startedAt }) => moment(startedAt).startOf('hour').unix() * 1000)
  .reduce((acc, timestamp) => {
    if (acc[timestamp]) {
      acc[timestamp] += 1
    } else {
      acc[timestamp] = 1
    }

    return acc
  }, {})).map(([timestamp, count]) => ({ x: Number(timestamp), y: count }))

const defaultOptions = computed(() => ({
  chart: {
    marginTop: 34,
    height: 200,
  },
  title: '',
  yAxis: {
    title: '',
  },
  xAxis: {
    type: 'datetime',
  },
  series: [
    {
      name: 'Failure',
      type: 'column',
      data: groupedResults(resultTypes.failure),
      color: '#BF0B23',
    },
    {
      name: 'Degraded',
      type: 'column',
      data: groupedResults(resultTypes.degraded),
      color: '#F5A623',
    },
    {
      name: 'Success',
      type: 'column',
      data: groupedResults(resultTypes.success),
      color: '#5ced73',
    },
  ],
  legend: {
    enabled: true,
    align: 'left',
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      pointWidth: 20,
      dataLabels: {
        enabled: false,
      },
    },
  },
}))
</script>
