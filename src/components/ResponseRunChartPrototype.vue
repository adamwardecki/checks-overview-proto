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
      constructor-type="stockChart"
      :options="prototypeOptions"
      :callback="insertDrawerButton"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import prototypeResponseChartOptions from '../fixtures/prototypeResponseChartOptions.js'

const prototypeOptions = computed(() => ({
  ...prototypeResponseChartOptions,
}))

function insertDrawerButton (chart) {
  console.log(chart)
  const button = document.createElement('button')
  button.classList.add('px-3', 'py-0.5', 'text-sm', 'border', 'rounded', 'bg-[#f7f7f7]', 'hover:bg-slate-200', 'z-20', 'absolute', 'top-10', 'left-5')
  const content = document.createTextNode('Show details')
  button.appendChild(content)
  document.querySelector('.check-run-chart .highcharts-container').appendChild(button)
}
</script>
