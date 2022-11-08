<template>
  <div class="py-6">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Runs Duration & Amount
      </h3>
    </div>
    <highcharts
      class="check-runs-durations"
      constructor-type="stockChart"
      :options="defaultOptions"
      :callback="insertDrawerButton"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isDrawerOpen: Boolean,
  setExtremes: Function,
  results: Array,
  events: Array,
})

const emit = defineEmits(['set:period', 'open:drawer', 'toggle:drawer'])

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

const getAlerts = (events) => events
  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  .reduce(function (acc, value, index, array) {
    if (index % 2 === 0) {
      value.from = new Date(value.timestamp).getTime()
      // result.push(array.slice(index, index + 2))
    } else {
      value.to = new Date(value.timestamp).getTime()
    }
    acc.push(value)
    return acc
  }, [])
console.log(getAlerts(props.events))
// eslint-disable-next-line no-unused-vars
const getResults = (resultTypes) => resultTypes.map(({ startedAt }) => (
  [new Date(startedAt).getTime(), 1]
)).sort((a, b) => a[0] - b[0])

const defaultOptions = computed(() => {
  return {
    chart: {
      marginTop: 34,
      events: {
        render () {
          emit('set:period', this.xAxis[0].getExtremes())
        },
      },
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
    yAxis: [
      {
        labels: {
          align: 'left',
        },
        height: '80%',
      },
      {
        labels: {
          align: 'left',
        },
        top: '80%',
        height: '20%',
        offset: 0,
      },
    ],
    xAxis: {
      type: 'datetime',
      plotBands: [
        {
          color: 'rgba(255, 0, 0, 0.1)', // Color value
          from: new Date('2022-09-28T19:15:00.234Z').getTime(), // Start of the plot band
          to: new Date('2022-09-28T19:38:44.665Z').getTime(), // End of the plot band
        },
        {
          color: 'rgba(255, 0, 0, 0.1)', // Color value
          from: new Date('2022-09-28T12:50:18.478Z').getTime(), // Start of the plot band
          to: new Date('2022-09-28T13:08:42.767Z').getTime(), // End of the plot band
        }],
      crosshair: true,
      events: {
        setExtremes: props.setExtremes,
      },
      tickLength: 0,
    },
    series: [
      {
        id: 'resp-time',
        name: 'Response Time',
        data: props.results.map((result) => ({
          x: new Date(result.created_at).getTime(),
          y: result.responseTime,
          ...(result.hasFailures
            ? {
                color: '#BF0B23',
                marker: { lineColor: '#BF0B23', lineWidth: 2 },
              }
            : {}),
        })).sort((a, b) => a.x - b.x),
        lineWidth: 1,
        color: '#333',
      },
      {
        name: 'Success',
        data: getResults(resultTypes.success),
        color: '#A3B3C2',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Failure',
        data: getResults(resultTypes.failure),
        color: '#BF0B23',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Degraded',
        data: getResults(resultTypes.degraded),
        color: '#F5A623',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
    ],
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    time: {
      useUTC: false,
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
        dataGrouping: {
          forced: true,
          units: [
            ['minute', [5, 30, 45, 60]],
          ],
        },
        point: {
          events: {
            click () {
              const endTime = this.series.xAxis.series[0].points[this.index + 1]
                ? this.series.xAxis.series[0].points[this.index + 1].x
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
    tooltip: {
      valueDecimals: 0,
    },
  }
})

function insertDrawerButton (chart) {
  const button = document.createElement('button')
  button.classList.add('check-details-button', 'p-1', 'text-xs', 'border', 'border-gray-300', 'rounded-md', 'bg-slate-100', 'hover:bg-slate-300', 'absolute', 'top-3', 'left-0')
  const content = document.createTextNode('Show details')
  button.appendChild(content)

  button.addEventListener('click', () => {
    emit('toggle:drawer')
    emit('set:period', this.xAxis[0].getExtremes())
    button.innerText = `${props.isDrawerOpen ? 'Show' : 'Hide'} details`
  })

  document.querySelector('.check-runs-durations .highcharts-container').appendChild(button)
}
</script>
