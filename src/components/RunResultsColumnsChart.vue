<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">Check Run Results</h3>
      <p>
        Stacked column chart with run results segmented by success, failure, and degraded.
      </p>
    </div>
    <highcharts
      :options="defaultOptions"
    ></highcharts>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { mergeDates } from '../fixtures/helpers.js';
import {
  dates,
  failures,
  degradations,
  success
} from '../fixtures/data.js';

const defaultOptions = computed(() => ({
    chart: {
      marginTop: 34,
    },
    title: '',
    yAxis: {
      title: '',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [
      {
        name: 'Failure',
        type: 'column',
        data: mergeDates(failures, dates),
        color: '#BF0B23',
      },
      {
        name: 'Degraded',
        type: 'column',

        data: mergeDates(degradations, dates),
        color: '#F5A623',
      },
      {
        name: 'Success',
        type: 'column',
        data: mergeDates(success, dates),
        color: '#333',
      },
    ],
    legend: {
      enabled: true,
      align: 'left',
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
          stacking: 'normal',
          dataLabels: {
              enabled: false
          }
      }
    },
  }))
</script>
