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
import { computed } from 'vue'
import prototypeResponseChartOptions from '../fixtures/prototypeResponseChartOptions.js'

const props = defineProps({
  isDrawerOpen: Boolean,
})

const emit = defineEmits(['open:drawer', ['close:drawer']])

const prototypeOptions = computed(() => ({
  ...prototypeResponseChartOptions,
}))

function insertDrawerButton (chart) {
  const button = document.createElement('button')
  button.classList.add('check-details-button', 'p-1', 'text-xs', 'border', 'border-gray-300', 'rounded-md', 'bg-slate-100', 'hover:bg-slate-300', 'z-20', 'absolute', 'top-10', 'left-16')
  const content = document.createTextNode('Show details')
  button.appendChild(content)
  button.addEventListener('click', () => {
    if (!props.isDrawerOpen) {
      emit('open:drawer', chart.series[0].points)
    } else {
      emit('close:drawer')
    }
    button.innerText = `${props.isDrawerOpen ? 'Show' : 'Hide'} details`
  })
  document.querySelector('.check-run-chart .highcharts-container').appendChild(button)
}
</script>
