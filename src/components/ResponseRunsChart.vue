<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">Check Runs Duration & Amount</h3>
      <p>
        Top chart shows the duration of the runs. Bottom chart shows the amount of runs in a given time period.
      </p>
    </div>
    <highcharts
      :constructor-type="'stockChart'"
      :options="defaultOptions"
    ></highcharts>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import defaultChartOptions from '../fixtures/defaultResponseChartOptions.js';

const defaultOptions = computed(() => defaultChartOptions);
</script>
