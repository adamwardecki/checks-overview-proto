<template>
  <div class="py-6">
    <div class="text-left">
      <h3 class="text-xl font-semibold">
        Check Runs Duration
      </h3>
    </div>
    <highcharts
      class="check-run-chart"
      constructor-type="stockChart"
      :options="prototypeOptions"
      :callback="setupChart"
    />
  </div>
</template>

<script setup>
import { formatDuration } from '../fixtures/helpers'

const props = defineProps({
  isDrawerOpen: Boolean,
  setExtremes: Function,
  results: Array,
  timestamps: Array,
})

const emit = defineEmits(['toggle:drawer', 'set:period', 'open:drawer'])

const dummyColumn = props.timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map((timestamp) => (
  { x: new Date(timestamp).getTime(), y: 1 }
))

const prototypeOptions = {
  title: {
    text: '',
  },
  chart: {
    marginTop: 60,
    height: 300,
    events: {
      render () {
        emit('set:period', this.xAxis[0].getExtremes())
      },
      redraw () {
        const plotLinesAndBandsIds = this.xAxis[0].plotLinesAndBands.map(({ id }) => id)
        updatePlotLinesWidth(this.xAxis[0], plotLinesAndBandsIds)
        addPlotLines(this.xAxis[0])
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
  xAxis: {
    type: 'datetime',
    crosshair: true,
    events: {
      setExtremes: props.setExtremes,
    },
    tickLength: 0,
  },
  yAxis: {
    opposite: false,
    title: '',
    labels: {
      formatter () {
        return formatDuration(this.value, { showUnit: true })
      },
    },
  },
  series: [
    {
      id: 'resp-time',
      name: 'Check duration',
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
      id: 'dummy',
      name: '',
      lineWidth: 0,
      data: dummyColumn,
      marker: {
        lineColor: '#ffffff',
        enabled: false,
      },
      enableMouseTracking: false,
    },
  ],
  legend: {
    enabled: false,
  },
  time: {
    useUTC: false,
  },
  credits: {
    enabled: false,
  },

  navigator: {
    enabled: false,
  },

  scrollbar: {
    enabled: false,
  },

  rangeSelector: {
    enabled: false,
  },

  plotOptions: {
    series: {
      dataGrouping: {
        forced: true,
        units: [
          ['minute', [30, 45, 60]],
        ],
      },
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
  },
  tooltip: {
    split: false,
    formatter () {
      return `
        <div>
          ${this.series.name}: ${formatDuration(this.y, { showUnit: true })}<br/>
        </div>
      `
    },
  },
}

function updatePlotLinesWidth (xAxisSerie, plotLinesAndBandsIds) {
  for (const existingPlotLine of plotLinesAndBandsIds) {
    xAxisSerie.removePlotLine(existingPlotLine)
  }
}

const failureResults = props.results.filter((result) => result.hasFailures)

function addPlotLines (xAxisSerie) {
  const chartColumnEl = document.querySelector('.highcharts-column-series .highcharts-point')
  const pointWidth = Math.round(chartColumnEl?.point?.pointWidth)
  const delta = xAxisSerie.closestPointRange
  const dataRanges = xAxisSerie.series[0].processedXData

  for (const failure of failureResults) {
    const failureStarted = new Date(failure.created_at).getTime()

    for (const dataRange of dataRanges) {
      if (failureStarted >= dataRange && failureStarted <= dataRange + delta) {
        xAxisSerie.addPlotLine({
          value: dataRange,
          color: 'rgba(255, 0, 0, 0.1)',
          width: Number(pointWidth + pointWidth * 0.3) || 10,
          id: failure.id,
        })
      }
    }
  }
}

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

  document.querySelector('.check-run-chart .highcharts-container').appendChild(button)
}

function setupChart (chart) {
  insertDrawerButton(chart)
  addPlotLines(chart.xAxis[0])
}
</script>
