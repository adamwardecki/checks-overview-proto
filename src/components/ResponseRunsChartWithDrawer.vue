<template>
  <div class="py-8">
    <div class="text-left">
      <h3 class="text-xl font-semibold">Check Runs in Drawer</h3>
      <p>
        Drawer opens when the runs are selected.
      </p>
    </div>
    <highcharts
      :constructor-type="'stockChart'"
      :options="defaultOptions"
    ></highcharts>
  </div>
</template>

<script setup>
import { mergeResponseDates } from '../fixtures/helpers.js';
import {
  duration,
  dates,
  responseTime,
} from '../fixtures/data.js';
import { computed, ref } from 'vue';

const emit = defineEmits(['select:period'])

const defaultOptions = computed(() => {
  return {
    chart: {
      marginTop: 34,
      // plotAreaHeight: 200
    },
    yAxis: [
      {
        labels: {
          align: 'left',
        },
        height: '80%',
      },
      {
        labels: {
          align: 'left',
        },
        top: '80%',
        height: '20%',
        offset: 0,
      },
    ],
    series: [
      {
        id: 'aapl-ohlc',
        name: 'Response Time',
        data: mergeResponseDates(responseTime, dates),
        lineWidth: 1,
        color: '#333',
      },
      {
        type: 'column',
        id: 'aapl-volume',
        name: 'Check Runs',
        data: mergeResponseDates(duration, dates),
        yAxis: 1,
        lineWidth: 1,
        color: '#333',
        cursor: 'pointer',
        events: {
          click: ({point}) => {
            emit('select:period', point)
          }
        }
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
});
</script>
