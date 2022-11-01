<template>
  <div>
    <Drawer @close:drawer="toggleDrawerState" :is-open="isDrawerOpen" />

    <div class="grid">
      <highcharts class="chart" :options="durationChartOptions" />
      <highcharts class="chart" :options="ttfbChartOptions" />
      <highcharts class="chart" :options="fcpChartOptions" />
      <highcharts class="chart" :options="lcpChartOptions" />
    </div>

    <div class="full">
      <highcharts class="py-8" :options="durationFullChartOptions" />
      <highcharts class="py-8" :options="fcpFullChartOptions" />

      <div class="py-8">
        <div class="text-left">
          <h3 class="text-xl font-semibold">Performance</h3>
          <h4 class="font-semibold">Check duration</h4>
          <p>
            Shows the aggregated check duration across all the selected
            locations by default. The check duration reflects the full browser
            session, including all pages visited and any waits.
          </p>
        </div>
        <highcharts
          class="chartFull"
          :options="durationBucketedFullChartOptions"
        />
      </div>
      <ResponseRunsChart />

      <ResponseRunsChartWithBands />

      <ResponseRunsChartWithAlerts />

      <ResponseRunsChartWithDrawer @select:period="toggleDrawerState" />
    </div>
  </div>
</template>

<script>
import Drawer from './components/Drawer.vue'
import ResponseRunsChart from './components/ResponseRunsChart.vue';
import ResponseRunsChartWithBands from './components/ResponseRunsChartWithBands.vue';
import ResponseRunsChartWithAlerts from './components/ResponseRunsChartWithAlerts.vue';
import ResponseRunsChartWithDrawer from './components/ResponseRunsChartWithDrawer.vue';
import {
  duration,
  dates,
  durationBucketed,
  zones,
} from './fixtures/data.js';
import { getSeries } from './fixtures/helpers.js';

export default {
  name: 'App',
  components: {
    ResponseRunsChart,
    Drawer,
    ResponseRunsChartWithBands,
    ResponseRunsChartWithAlerts,
    ResponseRunsChartWithDrawer,
  },
  data: () => ({
    options: {
      title: '',
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      yAxis: {
        opposite: false,
        title: '',
      },
      xAxis: {
        type: 'datetime',
      },
    },
    isDrawerOpen: false,
  }),
  computed: {
    durationChartOptions() {
      return {
        ...this.options,
        series: [{ ...getSeries(duration, 'duration', dates), ...zones }],
      };
    },
    ttfbChartOptions() {
      return {
        ...this.options,
        series: [{ ...getSeries(duration, 'ttfb', dates), ...zones }],
      };
    },
    fcpChartOptions() {
      return {
        ...this.options,
        series: [getSeries(duration, 'fcp', dates)],
      };
    },
    lcpChartOptions() {
      return {
        ...this.options,
        series: [getSeries(duration, 'lcp', dates)],
      };
    },
    durationFullChartOptions() {
      return {
        ...this.options,
        series: [getSeries(duration, 'durationFull', dates)],
      };
    },
    fcpFullChartOptions() {
      return {
        ...this.options,
        series: [getSeries(duration, 'fcp', dates)],
      };
    },
    durationBucketedFullChartOptions() {
      const bucketsArray = Object.entries(durationBucketed);

      return {
        ...this.options,
        series: [
          ...bucketsArray.map(([name, value]) => getSeries(value, name, dates)),
        ],
      };
    },
  },
  methods: {
    toggleDrawerState () {
      this.isDrawerOpen = !this.isDrawerOpen
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.text-left {
  text-align: left;
}

.grid {
  display: grid;
  grid-template: 200px / 1fr 1fr;
  grid-gap: 32px;
  justify-items: center;
  padding: 16px 0;
}

.full {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 200px;
  gap: 16px;
  padding: 16px 64px;
}

.chart {
  height: 200px;
  width: 610px;
}

.zone-safe {
  fill: none;
}

.zone-danger {
  fill: #aaa;
}
</style>
