<template>
  <div class="py-6">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Run Results
      </h3>
    </div>
    <highcharts
      class="pl-6"
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

const emit = defineEmits(['set:period', 'open:drawer'])

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
    tickLength: 0,
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

  time: {
    useUTC: false,
  },

  plotOptions: {
    series: {
      dataGrouping: {
        forced: true,
        units: [
          ['minute', [5, 30, 45, 60]],
        ],
      },
      point: {
        events: {
          click () {
            let index = null

            if (this.series.stackKey) {
              index = this.series.xAxis.series[0].points.find(point => point.x === this.x).index
            } else {
              index = this.index
            }

            const endTime = this.series.xAxis.series[0].points[index + 1]
              ? this.series.xAxis.series[0].points[index + 1].x
              : this.series.xAxis.dataMax

            emit('set:period', {
              min: this.x,
              max: endTime,
            })

            emit('open:drawer')
          },
        },
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
      name: 'Successful check runs',
      data: getResults(resultTypes.success),
      color: '#A3B3C2',
    },
    {
      name: 'Failed check runs',
      data: getResults(resultTypes.failure),
      color: '#BF0B23',
    },
    {
      name: 'Degraded check runs',
      data: getResults(resultTypes.degraded),
      color: '#F5A623',
    }],

  credits: {
    enabled: false,
  },

  tooltip: {
    valueDecimals: 0,
  },
}))
</script>
