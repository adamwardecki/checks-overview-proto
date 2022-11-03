import { mergeResponseDates } from './helpers.js'
import {
  dates,
  responseTime,
} from './data.js'

export default {
  chart: {
    marginTop: 34,
    zoomType: 'x',
    zooming: {
      resetButton: {
        position: {
          align: 'left',
          y: 5,
          x: 100,
        },
        theme: {
          fill: '#F1F5F9',
          stroke: '#D1D5DB',
          r: 5,
          padding: 5,
          states: {
            hover: {
              fill: '#CBD5E1',
            },
          },
        },
      },
    },
  },
  xAxis: {
    plotBands: [{
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-20T22:00:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T02:30:00Z').getTime(), // End of the plot band
    },
    {
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-21T05:45:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T06:15:00Z').getTime(), // End of the plot band
    },
    {
      color: 'rgba(255, 0, 0, 0.1)', // Color value
      from: new Date('2022-10-21T16:30:00Z').getTime(), // Start of the plot band
      to: new Date('2022-10-21T17:00:00Z').getTime(), // End of the plot band
    }],
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
