<template>
  <div class="py-6">
    <div>
      <h3 class="text-xl font-semibold text-left">
        Check Runs Duration & Amount
      </h3>
      <p class="pr-12 text-sm text-right text-slate-500">
        Granularity: {{ granularity }}
      </p>
    </div>
    <button @click="resetZoom">
      Reset zoom
    </button>
    <highcharts
      ref="responseRunsChartApiSynced"
      class="check-runs-api-synced-chart"
      constructor-type="stockChart"
      :options="defaultOptions"
      :callback="setupChart"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatDuration } from '../fixtures/helpers'
import { fetchGroupedData } from '../services/api'

const props = defineProps({
  isDrawerOpen: Boolean,
  results: Array,
  events: Array,
  timestamps: Array,
})

const emit = defineEmits(['set:period', 'open:drawer', 'toggle:drawer'])

const responseRunsChartApiSynced = ref(null)
const granularity = ref('30 min')

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

const initialMin = ref()
const initialMax = ref()
function resetZoom () {
  responseRunsChartApiSynced.value.chart.xAxis[0].setExtremes(initialMin.value, initialMax.value)
  fetchGroupedData({ target: { chart: responseRunsChartApiSynced.value.chart }, trigger: 'reset' })
}

async function afterSetExtremes (e) {
  const resp = await fetchGroupedData(e)
  if (resp?.granularity) setGranularity(resp.granularity)
  return resp
}

async function setupChart (chart) {
  // there is no min/max yet - need to fix this - i
  const resp = await afterSetExtremes({ target: { chart }, trigger: 'setup' })
  insertDrawerButton(chart)
  addPlotLines(chart.xAxis[0])
  if (resp.min && resp.max) {
    initialMin.value = resp.min
    initialMax.value = resp.max
  }
}

// eslint-disable-next-line no-unused-vars
function setGranularity (miliseconds) {
  granularity.value = formatDuration(miliseconds, { showUnit: true })
}

const defaultOptions = computed(() => {
  return {
    chart: {
      marginTop: 34,
      events: {
        redraw () {
          // TODO: plotlines are based on the results from props - need to change to the ones from fetchGroupedData
          removePlotLines(this.xAxis[0])
          addPlotLines(this.xAxis[0])
        },
      },
      zoomType: 'x',
      zooming: {
        resetButton: {
          theme: {
            // hide the default reset button
            zIndex: -1,
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
      events: {
        afterSetExtremes,
      },
    },
    series: [
      {
        id: 'resp-time',
        name: 'Response Time',
        data: [],
        lineWidth: 1,
        color: '#333',
      },
      {
        name: 'Successful check runs',
        data: [],
        color: '#A3B3C2',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Failed check runs',
        data: [],
        color: '#BF0B23',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: 'Degraded check runs',
        data: [],
        color: '#F5A623',
        type: 'column',
        yAxis: 1,
        lineWidth: 1,
      },
      {
        name: '',
        data: [],
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

  document.querySelector('.check-runs-api-synced-chart .highcharts-container').appendChild(button)
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
</script>
