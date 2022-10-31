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
import {
  duration,
  ttfb,
  fcp,
  lcp,
  dates,
  durationBucketed,
  responseTime,
  zones,
} from '../fixtures/data.js';
import {
  mergeDates,
  mergeResponseDates,
  getSeries,
} from '../fixtures/helpers.js';

const defaultOptions = computed(() => ({
  yAxis: [
    {
      labels: {
        align: 'left',
      },
      height: '80%',
      // resize: {
      //   enabled: true,
      // },
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
      data: mergeDates(duration, dates),
      yAxis: 1,
      lineWidth: 1,
      color: '#333',
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
}));
</script>

<style scoped></style>
