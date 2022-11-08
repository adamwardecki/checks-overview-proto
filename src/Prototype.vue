<template>
  <Drawer
    :is-open="isDrawerOpen"
    :selected-period="selectedPeriod"
    @toggle:drawer="toggleDrawer"
  />
  <div class="px-8">
    <div class="py-4">
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
    </div>
    <div id="container">
      <ResponseRunChartPrototype
        :results="results"
        :set-extremes="syncExtremes"
        :is-drawer-open="isDrawerOpen"
        @toggle:drawer="toggleDrawer"
        @open:drawer="openDrawer"
        @set:period="selectedPeriod = $event"
      />

      <RunResultsColumnsChartGrouped
        :results="results"
        :set-extremes="syncExtremes"
        @set:period="selectedPeriod = $event"
        @open:drawer="openDrawer"
      />
    </div>
  </div>
</template>

<script setup>
import Highcharts from 'highcharts'
import { ref, onMounted } from 'vue'
import { results } from './fixtures/moreData'
import RunResultsColumnsChartGrouped from './components/RunResultsColumnsChartGrouped.vue'
import ResponseRunChartPrototype from './components/ResponseRunChartPrototype.vue'
import Drawer from './components/Drawer.vue'

const isDrawerOpen = ref(false)
const selectedPeriod = ref({})

function toggleDrawer () {
  document.querySelector('.check-details-button').innerText = `${isDrawerOpen.value ? 'Show' : 'Hide'} details`
  isDrawerOpen.value = !isDrawerOpen.value
}

function openDrawer () {
  if (!isDrawerOpen.value) {
    isDrawerOpen.value = true
    document.querySelector('.check-details-button').innerText = 'Hide details'
  }
}

/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
function overrideChartEventHandlers () {
  ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
      eventType,
      function (e) {
        let chart,
          point,
          i,
          event

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
          chart = Highcharts.charts[i]
          // Find coordinates within the chart
          event = chart.pointer.normalize(e)
          // Get the hovered point
          point = chart.series[0].searchPoint(event, true)

          if (point) {
            point.highlight(e)
          }
        }
      },
    )
  })
}

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event)
  this.onMouseOver() // Show the hover marker
  this.series.chart.tooltip.refresh(this) // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
}

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes (e) {
  const thisChart = this.chart

  const shouldShowResetZoom = !(e.min === undefined && e.max === undefined)

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(
            e.min,
            e.max,
            undefined,
            false,
            { trigger: 'syncExtremes' },
          )
        }
      }

      if (shouldShowResetZoom && !chart.resetZoomButton) {
        chart.showResetZoom()
      } else if (!shouldShowResetZoom && chart.resetZoomButton) {
        chart.resetZoomButton = chart.resetZoomButton.destroy()
      }
    })
  }
}

onMounted(() => {
  overrideChartEventHandlers()
})
</script>
