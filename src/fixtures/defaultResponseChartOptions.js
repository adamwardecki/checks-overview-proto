import { mergeResponseDates } from '../fixtures/helpers.js';
import {
  duration,
  dates,
  responseTime,
} from '../fixtures/data.js';

export default {
    chart: {
      marginTop: 34,
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