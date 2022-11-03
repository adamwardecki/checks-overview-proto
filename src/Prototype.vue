
<template>
  <div class="px-8">
    <div class="py-10">
      <h2 class="text-2xl font-semibold">
        Check Overview
      </h2>
    </div>
    <RunResultsColumnsChart />
    <ResponseRunChartPrototype />
  </div>
</template>

<script setup>
import RunResultsColumnsChart from './components/RunResultsColumnsChart.vue'
import ResponseRunChartPrototype from './components/ResponseRunChartPrototype.vue'
</script>
