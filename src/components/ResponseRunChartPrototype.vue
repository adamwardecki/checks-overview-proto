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
      class="check-run-chart"
      :options="prototypeOptions"
      :callback="insertDrawerButton"
    />
  </div>
</template>

<script setup>
import { results } from '../fixtures/moreData.js'

const props = defineProps({
  isDrawerOpen: Boolean,
  setExtremes: Function,
})

const emit = defineEmits(['toggle:drawer', 'set:period'])

const prototypeOptions = {
  title: {
    text: '',
  },
  chart: {
    marginTop: 60,
    events: {
      redraw () {
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
    crosshair: true,
    events: {
      setExtremes: props.setExtremes,
    },
  },
  yAxis: {
    opposite: false,
    title: '',
  },
  series: [
    {
      id: 'resp-time',
      name: 'Response Time',
      data: results.map((result) => ({
        x: new Date(result.created_at).getTime(),
        y: result.responseTime,
        ...(result.hasFailures
          ? {
              color: '#BF0B23',
              marker: { lineColor: '#BF0B23', lineWidth: 2 },
            }
          : {}),
      })),
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
}

function insertDrawerButton (chart) {
  const button = document.createElement('button')
  button.classList.add('check-details-button', 'p-1', 'text-xs', 'border', 'border-gray-300', 'rounded-md', 'bg-slate-100', 'hover:bg-slate-300', 'absolute', 'top-3', 'left-0')
  const content = document.createTextNode('Show details')
  button.appendChild(content)

  button.addEventListener('click', () => {
    emit('toggle:drawer')
    button.innerText = `${props.isDrawerOpen ? 'Show' : 'Hide'} details`
  })

  document.querySelector('.check-run-chart .highcharts-container').appendChild(button)
}
</script>
