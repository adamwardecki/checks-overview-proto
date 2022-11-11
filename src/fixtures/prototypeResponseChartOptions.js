import { results } from '../fixtures/moreData.js'

export default {
  title: {
    text: '',
  },
  chart: {
    marginTop: 60,
    zoomType: 'x',
    zooming: {
      resetButton: {
        position: {
          align: 'left',
          x: 5,
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
    type: 'datetime',
    plotBands: [
      {
        color: 'rgba(255, 0, 0, 0.1)', // Color value
        from: new Date('2022-09-28T19:20:00.234Z').getTime(), // Start of the plot band
        to: new Date('2022-09-28T19:28:44.665Z').getTime(), // End of the plot band
      },
      {
        color: 'rgba(255, 0, 0, 0.1)', // Color value
        from: new Date('2022-09-28T12:59:18.478Z').getTime(), // Start of the plot band
        to: new Date('2022-09-28T13:08:42.767Z').getTime(), // End of the plot band
      }],
  },
  yAxis: {
    opposite: false,
    title: '',
  },
  series: [
    {
      id: 'resp-time',
      name: 'Check duration',
      data: results.map((result) => ({
        x: new Date(result.created_at).getTime(),
        y: result.responseTime,
        ...(result.hasFailures
          ? {
              color: '#BF0B23',
              marker: { lineColor: '#BF0B23', lineWidth: 2 },
            }
          : {}),
      })),
      lineWidth: 1,
      color: '#333',
    },
  ],
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  navigator: {
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
