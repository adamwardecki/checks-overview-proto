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
    <highcharts
      :options="defaultOptions"
      constructor-type="stockChart"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  setExtremes: Function,
  results: Array,
})

const resultTypes = {
  failure: [],
  degraded: [],
  success: [],
}

for (const result of props.results) {
  if (result.hasFailures) resultTypes.failure.push(result)
  if (result.isDegraded) resultTypes.degraded.push(result)
  if (!result.hasFailures && !result.isDegraded) resultTypes.success.push(result)
}

// eslint-disable-next-line no-unused-vars
const getResults = (resultTypes) => resultTypes.map(({ startedAt }) => (
  [new Date(startedAt).getTime(), 1]
)).sort((a, b) => a[0] - b[0])

const defaultOptions = computed(() => ({
  chart: {
    height: 200,
    marginTop: 34,
    type: 'column',
    zoomType: 'x',
    zooming: {
      resetButton: {
        position: {
          align: 'left',
          x: 5,
        },
        theme: {
          fill: '#F1F5F9',
          stroke: '#D1D5DB',
          r: 5,
          padding: 5,
          states: {
            hover: {
              fill: '#CBD5E1',
            },
          },
        },
      },
    },
  },

  title: '',

  yAxis: {
    opposite: false,
    showLastLabel: true,
    labels: {
      enabled: true,
      align: 'right',
    },

    title: {
      text: '',
    },
  },

  xAxis: {
    type: 'datetime',
    crosshair: true,
    events: {
      setExtremes: props.setExtremes,
    },
  },

  rangeSelector: {
    enabled: false,
  },

  navigator: {
    enabled: false,
  },

  legend: {
    enabled: true,
    align: 'left',
  },

  scrollbar: {
    enabled: false,
  },

  plotOptions: {
    series: {
      dataGrouping: {
        forced: true,
        units: [
          ['hour', [1, 3, 6, 12]],
        ],
      },
    },
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: false,
      },
    },
  },

  series: [
    {
      name: 'Success',
      // pointInterval: 86400000,
      data: getResults(resultTypes.success),
      color: '#5ced73',
    },
    {
      name: 'Failure',
      // pointInterval: 86400000,
      data: getResults(resultTypes.failure),
      color: '#BF0B23',
    },
    {
      name: 'Degraded',
      // pointInterval: 86400000,
      data: getResults(resultTypes.degraded),
      color: '#F5A623',
    }],
  credits: {
    enabled: false,
  },
}))
</script>
