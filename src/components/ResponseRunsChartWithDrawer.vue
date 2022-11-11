<template>
  <div class="py-6">
    <div>
      <h3 class="text-xl font-semibold text-left">
        Check Runs Duration & Amount
      </h3>
      <p class="pr-12 text-sm text-right text-slate-500">
        Granularity: {{ formatDuration(granularity, { showUnit: true }) }}
      </p>
    </div>
    <p class="flex items-center">
      <span
        class="mr-1"
        v-html="icons['light-bulb']"
      />Pro tip: Click and drag to zoom in
    </p>
    <highcharts
      ref="chart"
      class="check-runs-durations"
      constructor-type="stockChart"
      :options="defaultOptions"
      :callback="setupChart"
    />
  </div>
</template>

<script setup>
import { computed, ref, onUpdated } from 'vue'
import moment from 'moment'
import { formatDuration } from '../fixtures/helpers'
import icons from '../assets/icons.json'

const props = defineProps({
  isDrawerOpen: Boolean,
  results: Array,
  events: Array,
  timestamps: Array,
})

const emit = defineEmits(['set:period', 'open:drawer', 'toggle:drawer'])

const granularity = ref(null)
const chart = ref(null)

const resultTypes = {
  failure: [],
  degraded: [],
  success: [],
}

onUpdated(() => {
  chart.value.chart.reflow()
})

for (const result of props.results) {
  if (result.hasFailures) resultTypes.failure.push(result)
  if (result.isDegraded) resultTypes.degraded.push(result)
  if (!result.hasFailures && !result.isDegraded) resultTypes.success.push(result)
}

// eslint-disable-next-line no-unused-vars
const getResults = (resultTypes) => resultTypes.map(({ startedAt }) => (
  [new Date(startedAt).getTime(), 1]
)).sort((a, b) => a[0] - b[0])

const dummyColumn = props.timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map((timestamp) => (
  { x: new Date(timestamp).getTime(), y: 1 }
))

const successResults = getResults(resultTypes.success)
const failureResults = getResults(resultTypes.failure)
const degradedResults = getResults(resultTypes.degraded)
const lineResults = props.results.map((result) => ({
  x: new Date(result.created_at).getTime(),
  y: result.responseTime,
  ...(result.hasFailures
    ? {
        color: '#BF0B23',
        marker: { lineColor: '#BF0B23', lineWidth: 2 },
      }
    : {}),
})).sort((a, b) => a.x - b.x)

const defaultOptions = computed(() => {
  return {
    chart: {
      marginTop: 34,
      // with navigator
      // marginTop: 100
      events: {
        render (chart) {
          granularity.value = this.axes[2].series[0].currentDataGrouping.totalRange
          emit('set:period', this.xAxis[0].getExtremes())
        },
        redraw () {
          removePlotLines(this.xAxis[0])
          addPlotLines(this.xAxis[0])
        },
      },
      zoomType: 'x',
      zooming: {
        resetButton: {
          position: {
            align: 'left',
            x: 75,
          },
          theme: {
            fill: '#F1F5F9',
            stroke: '#D1D5DB',
            r: 5,
            padding: 6,
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
          formatter () {
            return formatDuration(this.value, { showUnit: true })
          },
        },
        height: '80%',
      },
      {
        opposite: false,
        labels: {
          align: 'right',
        },
        top: '80%',
        height: '20%',
        offset: 0,
        tickInterval: 5,
      },
    ],
    xAxis: {
      type: 'datetime',
      crosshair: true,
      tickLength: 0,
    },
    series: [
      {
        id: 'resp-time',
        name: 'Check duration',
        data: lineResults,
        lineWidth: 1,
        color: '#333',
      },
      {
        name: 'Successful check runs',
        data: successResults,
        color: '#A3B3C2',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Failed check runs',
        data: failureResults,
        color: '#BF0B23',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Degraded check runs',
        data: degradedResults,
        color: '#F5A623',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: '',
        data: dummyColumn,
        type: 'column',
        lineWidth: 0,
        enableMouseTracking: false,
      },
    ],
    rangeSelector: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    navigation: {
      buttonOptions: {
        enabled: true,
        text: '+',
      },
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
            ['minute', [10, 30]],
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
    tooltip: {
      valueDecimals: 0,
      formatter () {
      // The first returned item is the header, subsequent items are the points
        return [moment(this.x).format('MMM DD HH:mm') + ' - ' + moment(this.x + granularity.value).format('HH:mm')].concat(
          this.points
            ? this.points.map(function (point) {
              if (point.series.name === 'Check duration') {
                return (
                  point.series.name +
                  ': <b>' +
                  formatDuration(point.y, { showUnit: true }) +
                  '</b>'
                )
              } else {
                return (
                  '<span style="color:' +
                  point.color +
                  '">\u25CF</span> ' +
                  point.series.name +
                  ': <b>' +
                  point.y +
                  '</b>'
                )
              }
            })
            : [],
        )
      },
    },
  }
})

function insertDrawerButton (chart) {
  const button = document.createElement('button')
  button.classList.add('check-details-button', 'p-[4px]', 'text-xs', 'border', 'border-gray-300', 'rounded-md', 'bg-slate-100', 'hover:bg-slate-300', 'absolute', 'top-11', 'left-0', 'font-medium')
  const content = document.createTextNode('Show details')
  button.appendChild(content)

  button.addEventListener('click', () => {
    emit('toggle:drawer')
    emit('set:period', chart.xAxis[0].getExtremes())
    button.innerText = `${props.isDrawerOpen ? 'Show' : 'Hide'} details`
  })

  document.querySelector('.check-runs-durations .highcharts-container').appendChild(button)
}

function removePlotLines (xAxisSerie) {
  const plotLinesAndBandsIds = xAxisSerie.plotLinesAndBands.map(({ id }) => id)

  for (const existingPlotLine of plotLinesAndBandsIds) {
    xAxisSerie.removePlotLine(existingPlotLine)
  }
}

function addPlotLines (xAxisSerie) {
  const delta = xAxisSerie.closestPointRange
  const dataRanges = xAxisSerie.series[0].processedXData

  for (const failure of resultTypes.failure) {
    const failureStarted = new Date(failure.created_at).getTime()

    for (const dataRange of dataRanges) {
      if (
        failureStarted >= dataRange &&
        failureStarted <= dataRange + delta &&
        // make sure we don't add multiple plot lines over each other
        !xAxisSerie.plotLinesAndBands.find(({ options }) => options.value === dataRange)
      ) {
        xAxisSerie.addPlotLine({
          value: dataRange,
          color: 'rgba(255, 0, 0, 0.1)',
          width: xAxisSerie.series[0].closestPointRangePx,
          id: failure.id,
        })
      }
    }
  }
}

function setupChart (chart) {
  insertDrawerButton(chart)
  addPlotLines(chart.xAxis[0])
}
</script>
